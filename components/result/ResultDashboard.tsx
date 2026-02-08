'use client';

import React, { useState } from 'react';
import { Sparkles, Share2, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StylingTipsCard } from './StylingTipsCard';
import { AccessoriesCard } from './AccessoriesCard';
import { ColorPaletteCard } from './ColorPaletteCard';
import { useLanguage } from '@/contexts/LanguageContext';
import type {
  CoordinateResponse,
  BodyInfo,
  StyleOption,
  TPO,
  BodyConcern,
  GenerateCoordinateImageResponse,
} from '@/types/coordinate';
import { downloadImage } from '@/lib/utils';

interface ResultDashboardProps {
  result: NonNullable<CoordinateResponse['data']>;
  bodyInfo: BodyInfo | null;
  styleOptions: StyleOption[];
  tpo: TPO | null;
  bodyConcerns: BodyConcern[];
  onReset: () => void;
}

export function ResultDashboard({
  result,
  bodyInfo,
  styleOptions,
  tpo,
  bodyConcerns,
  onReset,
}: ResultDashboardProps) {
  const { t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // 추천 코디 이미지 생성
  const handleGenerateCoordinate = async () => {
    if (!bodyInfo || !tpo) {
      alert('필수 정보가 누락되었습니다.');
      return;
    }

    setIsGenerating(true);

    try {
      console.log('===== 이미지 생성 요청 시작 =====');
      console.log('bodyInfo:', bodyInfo);
      console.log('styleOptions:', styleOptions);
      console.log('tpo:', tpo);
      console.log('stylingTips:', result.stylingTips);
      console.log('accessories:', result.accessories);
      console.log('colorPalette:', result.colorPalette);

      const requestBody = {
        bodyInfo,
        styleOptions,
        tpo,
        bodyConcerns,
        stylingTips: result.stylingTips,
        accessories: result.accessories,
        colorPalette: result.colorPalette,
      };

      console.log('요청 body:', requestBody);

      // API 호출
      const response = await fetch('/api/generate-coordinate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('응답 상태:', response.status, response.statusText);

      const responseText = await response.text();
      console.log('API 응답:', responseText);

      let apiResult: GenerateCoordinateImageResponse;
      try {
        apiResult = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        console.error('응답 내용:', responseText.substring(0, 500));
        throw new Error('서버에서 잘못된 응답을 반환했습니다. 콘솔을 확인하세요.');
      }

      if (!apiResult.success || !apiResult.data) {
        throw new Error(apiResult.error?.message || '이미지 생성에 실패했습니다.');
      }

      setGeneratedImageUrl(apiResult.data.imageUrl);
    } catch (error) {
      console.error('이미지 생성 오류:', error);
      alert(
        error instanceof Error
          ? error.message
          : '이미지 생성 중 오류가 발생했습니다.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // 생성된 이미지 다운로드
  const handleDownloadGenerated = () => {
    if (generatedImageUrl) {
      const base64 = generatedImageUrl.split(',')[1];
      downloadImage(base64, 'autofit-coordinate.png');
    }
  };

  // 공유하기
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '오토핏 코디 결과',
          text: `${result.overallComment}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('공유 실패:', error);
      }
    } else {
      // Web Share API 미지원 시 URL 복사
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t.result.title}
        </h1>
        <p className="text-gray-600">
          {t.result.subtitle}
        </p>
      </div>

      {/* 추천 코디 생성 버튼 - 최상단에 강조 */}
      {!generatedImageUrl && (
        <div className="flex justify-center mb-8">
          <button
            onClick={handleGenerateCoordinate}
            disabled={isGenerating}
            className={`
              relative px-12 py-5 rounded-2xl font-bold text-xl
              bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
              text-white shadow-2xl hover:shadow-3xl
              transform transition-all duration-300
              hover:scale-110 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              flex items-center gap-4
              animate-pulse hover:animate-none
            `}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                <span>{t.result.generating}</span>
              </>
            ) : (
              <>
                <Sparkles size={24} className="animate-bounce" />
                <span>{t.result.generateButton}</span>
                <Sparkles size={24} className="animate-bounce" />
              </>
            )}
          </button>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex justify-center gap-4">
        {generatedImageUrl && (
          <Button onClick={handleDownloadGenerated} variant="default" size="sm">
            <Download size={16} className="mr-2" />
            {t.result.downloadImage}
          </Button>
        )}
        <Button onClick={handleShare} variant="outline" size="sm">
          <Share2 size={16} className="mr-2" />
          {t.result.share}
        </Button>
        <Button onClick={onReset} variant="ghost" size="sm">
          <RotateCcw size={16} className="mr-2" />
          {t.result.reset}
        </Button>
      </div>

      {/* 생성된 코디 이미지 - 전체 너비로 강조 */}
      {generatedImageUrl && (
        <Card className="mb-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-center gap-3">
              <Sparkles size={24} className="text-purple-600 animate-pulse" />
              {t.result.generatedTitle}
              <Sparkles size={24} className="text-purple-600 animate-pulse" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <img
                src={generatedImageUrl}
                alt="AI Generated Outfits"
                className="w-full h-auto rounded-xl shadow-xl"
                style={{ minWidth: '1000px', maxHeight: '600px', objectFit: 'contain' }}
              />
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              {t.result.generatedSubtitle}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 메인 콘텐츠 */}
      <div className="space-y-6">
        {/* 전체 코멘트 */}
        <Card>
          <CardHeader>
            <CardTitle>{t.result.overallComment}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {result.overallComment}
            </p>
          </CardContent>
        </Card>

        {/* 스타일링 팁 */}
        <StylingTipsCard tips={result.stylingTips} />

        {/* 추천 액세서리 */}
        {result.accessories.length > 0 && (
          <AccessoriesCard accessories={result.accessories} />
        )}

        {/* 컬러 팔레트 */}
        {result.colorPalette.length > 0 && (
          <ColorPaletteCard colors={result.colorPalette} />
        )}
      </div>
    </div>
  );
}
