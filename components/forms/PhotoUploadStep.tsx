'use client';

import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useImageUpload } from '@/hooks/useImageUpload';

interface PhotoUploadStepProps {
  onNext: (file: File, previewUrl: string) => void;
  onPrev?: () => void;
}

export function PhotoUploadStep({ onNext, onPrev }: PhotoUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { file, previewUrl, error, isUploading, uploadImage, clearImage } =
    useImageUpload();

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
      onNext(file, previewUrl);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          사진 업로드
        </h2>
        <p className="text-gray-600">
          전신 사진을 업로드해주세요. AI가 더 정확한 분석을 제공합니다.
        </p>
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
              클릭하거나 파일을 드래그하여 업로드
            </p>
            <p className="text-sm text-gray-500 mb-4">
              JPEG, PNG, WEBP (최대 10MB)
            </p>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="primary"
              disabled={isUploading}
            >
              파일 선택
            </Button>
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
            이전
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!file || isUploading}
          variant="primary"
          size="lg"
          className={!onPrev ? 'ml-auto' : ''}
        >
          다음 단계
        </Button>
      </div>
    </Card>
  );
}
