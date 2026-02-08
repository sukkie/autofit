'use client';

import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useLanguage } from '@/contexts/LanguageContext';

interface PhotoUploadStepProps {
  onNext: (file: File, previewUrl: string, includeFace: boolean) => void;
  onPrev?: () => void;
}

export function PhotoUploadStep({ onNext, onPrev }: PhotoUploadStepProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { file, previewUrl, error, isUploading, uploadImage, clearImage } =
    useImageUpload();
  const [includeFace, setIncludeFace] = React.useState(true);
  const [showExamples, setShowExamples] = React.useState(false);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      uploadImage(selectedFile);
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      uploadImage(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 다음 단계로
  const handleNext = () => {
    if (file && previewUrl) {
      onNext(file, previewUrl, includeFace);
    }
  };

  return (
    <>
      {/* 예시 이미지 모달 */}
      {showExamples && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowExamples(false)}>
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {t.photoUpload.exampleTitle}
            </h3>
            <p className="text-gray-600 mb-6">
              {t.photoUpload.exampleSubtitle}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 좋은 예시 */}
              <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">✅</span>
                  <h4 className="font-bold text-green-800">{t.photoUpload.goodExample}</h4>
                </div>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-3">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🧍</div>
                    <p className="text-sm text-gray-600">{t.photoUpload.fullBody}</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>✓ {t.photoUpload.tip1}</li>
                  <li>✓ {t.photoUpload.tip2}</li>
                  <li>✓ {t.photoUpload.tip3}</li>
                  <li>✓ {t.photoUpload.tip4}</li>
                </ul>
              </div>

              {/* 나쁜 예시 */}
              <div className="border-2 border-red-300 rounded-lg p-4 bg-red-50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">❌</span>
                  <h4 className="font-bold text-red-800">{t.photoUpload.badExample}</h4>
                </div>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-3">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🙅</div>
                    <p className="text-sm text-gray-600">{t.photoUpload.avoid}</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-red-800">
                  <li>✗ {t.photoUpload.bad1}</li>
                  <li>✗ {t.photoUpload.bad2}</li>
                  <li>✗ {t.photoUpload.bad3}</li>
                  <li>✗ {t.photoUpload.bad4}</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowExamples(false)}
              className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              {t.photoUpload.understood}
            </button>
          </div>
        </div>
      )}

      <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t.photoUpload.title}
        </h2>
        <p className="text-gray-600">
          {t.photoUpload.subtitle}
        </p>
      </div>

      {/* 얼굴 포함 여부 선택 */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="includeFace"
            checked={includeFace}
            onChange={(e) => setIncludeFace(e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div className="flex-1">
            <label htmlFor="includeFace" className="font-medium text-gray-900 cursor-pointer">
              {t.photoUpload.includeFace}
            </label>
            <div className="mt-1 text-sm text-gray-600">
              <p className="mb-1">
                {t.photoUpload.faceIncluded}
              </p>
              <p>
                {t.photoUpload.faceExcluded}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-colors
          ${
            previewUrl
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-blue-500 bg-gray-50'
          }
        `}
      >
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="미리보기"
              className="max-h-96 mx-auto rounded-lg"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              aria-label="이미지 제거"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-700 mb-2">
              {t.photoUpload.dragDrop}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {t.photoUpload.fileTypes}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="primary"
                disabled={isUploading}
              >
                {t.photoUpload.selectFile}
              </Button>
              <Button
                type="button"
                onClick={() => setShowExamples(true)}
                variant="outline"
                disabled={isUploading}
              >
                📸 {t.photoUpload.viewExamples}
              </Button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="mt-6 flex justify-between gap-4">
        {onPrev && (
          <Button type="button" onClick={onPrev} variant="ghost">
            {t.common.prev}
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!file || isUploading}
          variant="primary"
          size="lg"
          className={!onPrev ? 'ml-auto' : ''}
        >
          {t.common.next}
        </Button>
      </div>
    </Card>
    </>
  );
}
