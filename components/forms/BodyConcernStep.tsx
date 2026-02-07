'use client';

import React, { useState } from 'react';
import { Check, Sparkles, Image } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useLanguage } from '@/contexts/LanguageContext';
import type { BodyConcern } from '@/types/coordinate';
import { cn } from '@/lib/utils';

interface BodyConcernStepProps {
  onNext: (concerns: BodyConcern[]) => void;
  onPrev: () => void;
  onSubmit: () => void;
  initialData?: BodyConcern[];
  isLoading?: boolean;
}

export function BodyConcernStep({
  onNext,
  onPrev,
  onSubmit,
  initialData = [],
  isLoading = false,
}: BodyConcernStepProps) {
  const { t } = useLanguage();
  const [selectedConcerns, setSelectedConcerns] = useState<BodyConcern[]>(initialData);

  const BODY_CONCERNS: Array<{ value: BodyConcern; label: string; description: string }> = [
    { value: '키가 작음', label: t.bodyConcern.concerns.shortHeight.title, description: t.bodyConcern.concerns.shortHeight.description },
    { value: '다리가 짧음', label: t.bodyConcern.concerns.shortLegs.title, description: t.bodyConcern.concerns.shortLegs.description },
    { value: '어깨가 넓음', label: t.bodyConcern.concerns.broadShoulders.title, description: t.bodyConcern.concerns.broadShoulders.description },
    { value: '상체 비만', label: t.bodyConcern.concerns.upperBody.title, description: t.bodyConcern.concerns.upperBody.description },
    { value: '하체 비만', label: t.bodyConcern.concerns.lowerBody.title, description: t.bodyConcern.concerns.lowerBody.description },
    { value: '팔이 짧음', label: t.bodyConcern.concerns.shortArms.title, description: t.bodyConcern.concerns.shortArms.description },
    { value: '없음', label: t.bodyConcern.concerns.none.title, description: t.bodyConcern.concerns.none.description },
  ];

  // 옵션 토글
  const toggleConcern = (concern: BodyConcern) => {
    setSelectedConcerns((prev) => {
      // '없음'을 선택하면 다른 선택 초기화
      if (concern === '없음') {
        return prev.includes('없음') ? [] : ['없음'];
      }

      // 다른 옵션 선택 시 '없음' 제거
      const filtered = prev.filter((item) => item !== '없음');

      if (filtered.includes(concern)) {
        return filtered.filter((item) => item !== concern);
      } else {
        return [...filtered, concern];
      }
    });
  };

  // 제출 핸들러
  const handleSubmit = async () => {
    onNext(selectedConcerns);
    // 마지막 단계이므로 폼 제출
    onSubmit();
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t.bodyConcern.title}
        </h2>
        <p className="text-gray-600">
          {t.bodyConcern.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {BODY_CONCERNS.map((concern) => {
          const isSelected = selectedConcerns.includes(concern.value);
          const isDisabled =
            selectedConcerns.includes('없음') && concern.value !== '없음';

          return (
            <button
              key={concern.value}
              type="button"
              onClick={() => toggleConcern(concern.value)}
              disabled={isDisabled}
              className={cn(
                'relative p-6 rounded-lg border-2 transition-all text-left',
                'hover:shadow-md',
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300',
                isDisabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {concern.label}
                  </h3>
                  <p className="text-sm text-gray-600">{concern.description}</p>
                </div>
                {isSelected && (
                  <div className="flex-shrink-0 ml-4">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check size={16} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          {t.bodyConcern.tip}
        </p>
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <Button type="button" onClick={onPrev} variant="ghost" disabled={isLoading}>
          {t.common.prev}
        </Button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className={cn(
            "relative px-8 py-4 rounded-xl font-bold text-lg",
            "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600",
            "text-white shadow-lg hover:shadow-xl",
            "transform transition-all duration-200",
            "hover:scale-105 active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
            "flex items-center gap-3"
          )}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>{t.bodyConcern.submitting}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span>{t.bodyConcern.submit}</span>
              <Image className="w-6 h-6" />
            </>
          )}
        </button>
      </div>
    </Card>
  );
}
