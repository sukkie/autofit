'use client';

import React, { useState } from 'react';
import { Sparkles, Share2, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ScoreCard } from './ScoreCard';
import { StylingTipsCard } from './StylingTipsCard';
import { AccessoriesCard } from './AccessoriesCard';
import { ColorPaletteCard } from './ColorPaletteCard';
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
  previewUrl: string | null;
  userPhoto: File | null;
  bodyInfo: BodyInfo | null;
  styleOptions: StyleOption[];
  tpo: TPO | null;
  bodyConcerns: BodyConcern[];
  includeFace: boolean;
  onReset: () => void;
}

export function ResultDashboard({
  result,
  previewUrl,
  userPhoto,
  bodyInfo,
  styleOptions,
  tpo,
  bodyConcerns,
  includeFace,
  onReset,
}: ResultDashboardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // 추천 코디 이미지 생성
  const handleGenerateCoordinate = async () => {
    if (!userPhoto || !bodyInfo || !tpo) {
      alert('필수 정보가 누락되었습니다.');
      return;
    }

    setIsGenerating(true);

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('userImage', userPhoto);
      formData.append('bodyInfo', JSON.stringify(bodyInfo));
      formData.append('styleOptions', JSON.stringify(styleOptions));
      formData.append('tpo', JSON.stringify(tpo));
      formData.append('bodyConcerns', JSON.stringify(bodyConcerns));
      formData.append('stylingTips', JSON.stringify(result.stylingTips));
      formData.append('accessories', JSON.stringify(result.accessories));
      formData.append('colorPalette', JSON.stringify(result.colorPalette));
      formData.append('includeFace', JSON.stringify(includeFace));

      // API 호출
      const response = await fetch('/api/generate-coordinate-image', {
        method: 'POST',
        body: formData,
      });

      const apiResult: GenerateCoordinateImageResponse = await response.json();

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
          text: `AI 코디 점수: ${result.score}점\n\n${result.overallComment}`,
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
          AI 코디 분석 결과
        </h1>
        <p className="text-gray-600">
          당신을 위한 맞춤 스타일링 가이드입니다
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleGenerateCoordinate}
          variant="default"
          size="sm"
          disabled={isGenerating}
        >
          <Sparkles size={16} className="mr-2" />
          {isGenerating ? 'AI 생성 중...' : '추천 코디 생성'}
        </Button>
        {generatedImageUrl && (
          <Button onClick={handleDownloadGenerated} variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            코디 이미지 저장
          </Button>
        )}
        <Button onClick={handleShare} variant="outline" size="sm">
          <Share2 size={16} className="mr-2" />
          공유하기
        </Button>
        <Button onClick={onReset} variant="ghost" size="sm">
          <RotateCcw size={16} className="mr-2" />
          새로 분석하기
        </Button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽: 이미지 & 점수 */}
        <div className="space-y-6">
          {/* 사진 */}
          {previewUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">원본 사진</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <img
                  src={previewUrl}
                  alt="사용자 사진"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* 생성된 코디 이미지 */}
          {generatedImageUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-600" />
                  AI 추천 코디
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <img
                  src={generatedImageUrl}
                  alt="AI 생성 코디"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* 점수 */}
          <ScoreCard score={result.score} />
        </div>

        {/* 오른쪽: 분석 결과 */}
        <div className="space-y-6">
          {/* 전체 코멘트 */}
          <Card>
            <CardHeader>
              <CardTitle>종합 평가</CardTitle>
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
    </div>
  );
}
