'use client';

import { useState, useCallback } from 'react';
import { validateFileSize, validateFileType } from '@/lib/utils';

interface UseImageUploadReturn {
  file: File | null;
  previewUrl: string | null;
  error: string | null;
  isUploading: boolean;
  uploadImage: (file: File) => void;
  clearImage: () => void;
}

const MAX_FILE_SIZE = parseInt(
  process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760'
); // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * 이미지 업로드 훅
 */
export function useImageUpload(): UseImageUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 이미지 업로드 핸들러
  const uploadImage = useCallback((uploadedFile: File) => {
    setIsUploading(true);
    setError(null);

    // 파일 타입 검증
    if (!validateFileType(uploadedFile, ALLOWED_TYPES)) {
      setError('JPEG, PNG, WEBP 형식만 지원됩니다.');
      setIsUploading(false);
      return;
    }

    // 파일 크기 검증
    if (!validateFileSize(uploadedFile, MAX_FILE_SIZE)) {
      setError('파일 크기는 10MB 이하여야 합니다.');
      setIsUploading(false);
      return;
    }

    // 미리보기 URL 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setFile(uploadedFile);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setError('파일을 읽을 수 없습니다.');
      setIsUploading(false);
    };
    reader.readAsDataURL(uploadedFile);
  }, []);

  // 이미지 초기화
  const clearImage = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    setIsUploading(false);
  }, []);

  return {
    file,
    previewUrl,
    error,
    isUploading,
    uploadImage,
    clearImage,
  };
}
