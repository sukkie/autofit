'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { BodyConcern } from '@/types/coordinate';
import { cn } from '@/lib/utils';

interface BodyConcernStepProps {
  onNext: (concerns: BodyConcern[]) => void;
  onPrev: () => void;
  onSubmit: () => void;
  initialData?: BodyConcern[];
}

const BODY_CONCERNS: Array<{ value: BodyConcern; label: string; description: string }> = [
  { value: '키가 작음', label: '키가 작음', description: '키가 작아 보이는 것이 고민' },
  { value: '다리가 짧음', label: '다리가 짧음', description: '다리 길이가 짧아 보임' },
  { value: '어깨가 넓음', label: '어깨가 넓음', description: '어깨가 넓어 보이는 것이 고민' },
  { value: '상체 비만', label: '상체 비만', description: '상체가 통통해 보임' },
  { value: '하체 비만', label: '하체 비만', description: '하체가 통통해 보임' },
  { value: '팔이 짧음', label: '팔이 짧음', description: '팔 길이가 짧아 보임' },
  { value: '없음', label: '특별한 고민 없음', description: '신체 비율에 만족함' },
];

export function BodyConcernStep({
  onNext,
  onPrev,
  onSubmit,
  initialData = [],
}: BodyConcernStepProps) {
  const [selectedConcerns, setSelectedConcerns] = useState<BodyConcern[]>(initialData);

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
          신체 고민 사항
        </h2>
        <p className="text-gray-600">
          커버하고 싶은 신체적 특징이 있다면 선택해주세요. (선택사항)
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
          💡 선택하신 고민 사항을 바탕으로 체형을 보완하는 스타일링 팁을 제공합니다.
        </p>
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <Button type="button" onClick={onPrev} variant="ghost">
          이전
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          variant="primary"
          size="lg"
        >
          AI 코디 분석 시작
        </Button>
      </div>
    </Card>
  );
}
