'use client';

import { useState, useCallback } from 'react';
import type {
  FormStep,
  FormState,
  BodyInfo,
  StyleOption,
  TPO,
  BodyConcern,
  CoordinateResponse,
} from '@/types/coordinate';

interface UseCoordinateFormReturn extends FormState {
  setUserPhoto: (file: File, previewUrl: string, includeFace: boolean) => void;
  setBodyInfo: (info: BodyInfo) => void;
  setStyleOptions: (options: StyleOption[]) => void;
  setTPO: (tpo: TPO) => void;
  setBodyConcerns: (concerns: BodyConcern[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: FormStep) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
}

const STEP_ORDER: FormStep[] = [
  'bodyInfo',
  'tpo',
  'photo',
  'styleOption',
  'bodyConcern',
  'result',
];

const initialState: FormState = {
  currentStep: 'bodyInfo',
  userPhoto: null,
  previewUrl: null,
  includeFace: true, // 기본값: 얼굴 포함
  bodyInfo: null,
  styleOptions: [],
  tpo: null,
  bodyConcerns: [],
  isLoading: false,
  result: null,
  error: null,
};

/**
 * 코디네이션 폼 상태 관리 훅
 */
export function useCoordinateForm(): UseCoordinateFormReturn {
  const [state, setState] = useState<FormState>(initialState);

  // 사용자 사진 설정
  const setUserPhoto = useCallback((file: File, previewUrl: string, includeFace: boolean) => {
    setState((prev) => ({
      ...prev,
      userPhoto: file,
      previewUrl,
      includeFace,
      error: null,
    }));
  }, []);

  // 신체 정보 설정
  const setBodyInfo = useCallback((info: BodyInfo) => {
    setState((prev) => ({
      ...prev,
      bodyInfo: info,
      error: null,
    }));
  }, []);

  // 스타일 옵션 설정
  const setStyleOptions = useCallback((options: StyleOption[]) => {
    setState((prev) => ({
      ...prev,
      styleOptions: options,
      error: null,
    }));
  }, []);

  // TPO 설정
  const setTPO = useCallback((tpo: TPO) => {
    setState((prev) => ({
      ...prev,
      tpo,
      error: null,
    }));
  }, []);

  // 신체 고민 설정
  const setBodyConcerns = useCallback((concerns: BodyConcern[]) => {
    setState((prev) => ({
      ...prev,
      bodyConcerns: concerns,
      error: null,
    }));
  }, []);

  // 다음 단계로 이동
  const nextStep = useCallback(() => {
    setState((prev) => {
      const currentIndex = STEP_ORDER.indexOf(prev.currentStep);
      if (currentIndex < STEP_ORDER.length - 1) {
        return {
          ...prev,
          currentStep: STEP_ORDER[currentIndex + 1],
        };
      }
      return prev;
    });
  }, []);

  // 이전 단계로 이동
  const prevStep = useCallback(() => {
    setState((prev) => {
      const currentIndex = STEP_ORDER.indexOf(prev.currentStep);
      if (currentIndex > 0) {
        return {
          ...prev,
          currentStep: STEP_ORDER[currentIndex - 1],
        };
      }
      return prev;
    });
  }, []);

  // 특정 단계로 이동
  const goToStep = useCallback((step: FormStep) => {
    setState((prev) => ({
      ...prev,
      currentStep: step,
    }));
  }, []);

  // 폼 제출
  const submitForm = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // 필수 필드 검증
      if (
        !state.userPhoto ||
        !state.bodyInfo ||
        state.styleOptions.length === 0 ||
        !state.tpo
      ) {
        throw new Error('모든 필수 정보를 입력해주세요.');
      }

      // FormData 생성
      const formData = new FormData();
      formData.append('userPhoto', state.userPhoto);
      formData.append('bodyInfo', JSON.stringify(state.bodyInfo));
      formData.append('styleOptions', JSON.stringify(state.styleOptions));
      formData.append('tpo', JSON.stringify(state.tpo));
      formData.append('bodyConcerns', JSON.stringify(state.bodyConcerns));
      formData.append('includeFace', JSON.stringify(state.includeFace));

      // API 호출
      const response = await fetch('/api/coordinate', {
        method: 'POST',
        body: formData,
      });

      const result: CoordinateResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'API 호출에 실패했습니다.');
      }

      // 성공 시 결과 저장 및 결과 페이지로 이동
      setState((prev) => ({
        ...prev,
        isLoading: false,
        result: result.data!,
        currentStep: 'result',
      }));
    } catch (error) {
      console.error('폼 제출 오류:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      }));
    }
  }, [state]);

  // 폼 초기화
  const resetForm = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    setUserPhoto,
    setBodyInfo,
    setStyleOptions,
    setTPO,
    setBodyConcerns,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    resetForm,
  };
}
