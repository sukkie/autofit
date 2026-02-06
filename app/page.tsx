'use client';

import React, { useState } from 'react';
import { useCoordinateForm } from '@/hooks/useCoordinateForm';
import { LandingPage } from '@/components/LandingPage';
import { PhotoUploadStep } from '@/components/forms/PhotoUploadStep';
import { BodyInfoStep } from '@/components/forms/BodyInfoStep';
import { StyleOptionStep } from '@/components/forms/StyleOptionStep';
import { TPOSelectionStep } from '@/components/forms/TPOSelectionStep';
import { BodyConcernStep } from '@/components/forms/BodyConcernStep';
import { ResultDashboard } from '@/components/result/ResultDashboard';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  const [showLanding, setShowLanding] = useState(true);
  const form = useCoordinateForm();

  // 시작하기 버튼 클릭
  const handleStart = () => {
    setShowLanding(false);
  };

  // 랜딩 페이지 표시
  if (showLanding) {
    return <LandingPage onStart={handleStart} />;
  }

  // 단계 인디케이터
  const StepIndicator = () => {
    const steps = [
      { id: 'bodyInfo', label: '신체정보' },
      { id: 'photo', label: '사진' },
      { id: 'styleOption', label: '스타일' },
      { id: 'tpo', label: 'TPO' },
      { id: 'bodyConcern', label: '고민사항' },
    ];

    const currentIndex = steps.findIndex((s) => s.id === form.currentStep);

    return (
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    transition-colors
                    ${
                      index <= currentIndex
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {index + 1}
                </div>
                <span className="text-xs mt-2 text-gray-600">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-1 mx-2 transition-colors
                    ${
                      index < currentIndex ? 'bg-blue-600' : 'bg-gray-200'
                    }
                  `}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // 로딩 상태
  if (form.isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            AI가 분석하고 있습니다...
          </h2>
          <p className="text-gray-600">
            최적의 코디네이션을 찾고 있습니다. 잠시만 기다려주세요.
          </p>
        </Card>
      </div>
    );
  }

  // 에러 상태
  if (form.error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-16 border-red-200 bg-red-50">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">오류 발생</h2>
          <p className="text-gray-600 mb-6">{form.error}</p>
          <button
            onClick={() => form.goToStep('bodyInfo')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            처음으로 돌아가기
          </button>
        </Card>
      </div>
    );
  }

  // 결과 페이지
  if (form.currentStep === 'result' && form.result) {
    return (
      <ResultDashboard
        result={form.result}
        previewUrl={form.previewUrl}
        onReset={() => {
          form.resetForm();
          setShowLanding(true);
        }}
      />
    );
  }

  // 폼 단계
  return (
    <div>
      {form.currentStep !== 'bodyInfo' && <StepIndicator />}

      {form.currentStep === 'bodyInfo' && (
        <BodyInfoStep
          onNext={(info) => {
            form.setBodyInfo(info);
            form.nextStep();
          }}
          onPrev={() => setShowLanding(true)}
          initialData={form.bodyInfo}
        />
      )}

      {form.currentStep === 'photo' && (
        <PhotoUploadStep
          onNext={(file, previewUrl) => {
            form.setUserPhoto(file, previewUrl);
            form.nextStep();
          }}
          onPrev={form.prevStep}
        />
      )}

      {form.currentStep === 'styleOption' && (
        <StyleOptionStep
          onNext={(options) => {
            form.setStyleOptions(options);
            form.nextStep();
          }}
          onPrev={form.prevStep}
          initialData={form.styleOptions}
        />
      )}

      {form.currentStep === 'tpo' && (
        <TPOSelectionStep
          onNext={(tpo) => {
            form.setTPO(tpo);
            form.nextStep();
          }}
          onPrev={form.prevStep}
          initialData={form.tpo}
        />
      )}

      {form.currentStep === 'bodyConcern' && (
        <BodyConcernStep
          onNext={(concerns) => {
            form.setBodyConcerns(concerns);
          }}
          onPrev={form.prevStep}
          onSubmit={form.submitForm}
          initialData={form.bodyConcerns}
        />
      )}
    </div>
  );
}
