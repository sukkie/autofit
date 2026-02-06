'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { StyleOption } from '@/types/coordinate';
import { cn } from '@/lib/utils';

interface StyleOptionStepProps {
  onNext: (options: StyleOption[]) => void;
  onPrev: () => void;
  initialData?: StyleOption[];
}

const STYLE_OPTIONS: Array<{ value: StyleOption; label: string; description: string }> = [
  { value: '캐주얼', label: '캐주얼', description: '편안하고 자연스러운 스타일' },
  { value: '비즈니스', label: '비즈니스', description: '세련되고 전문적인 스타일' },
  { value: '스트리트', label: '스트리트', description: '힙하고 개성있는 스타일' },
  { value: '미니멀', label: '미니멀', description: '심플하고 깔끔한 스타일' },
  { value: '빈티지', label: '빈티지', description: '레트로하고 클래식한 스타일' },
  { value: '스포티', label: '스포티', description: '활동적이고 역동적인 스타일' },
];

export function StyleOptionStep({ onNext, onPrev, initialData = [] }: StyleOptionStepProps) {
  const [selectedOptions, setSelectedOptions] = useState<StyleOption[]>(initialData);
  const [error, setError] = useState<string>('');

  // 옵션 토글
  const toggleOption = (option: StyleOption) => {
    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        // 최대 3개까지 선택 가능
        if (prev.length >= 3) {
          setError('최대 3개까지 선택 가능합니다.');
          return prev;
        }
        setError('');
        return [...prev, option];
      }
    });
  };

  // 제출 핸들러
  const handleSubmit = () => {
    if (selectedOptions.length === 0) {
      setError('최소 1개 이상 선택해주세요.');
      return;
    }
    onNext(selectedOptions);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          선호 스타일 선택
        </h2>
        <p className="text-gray-600">
          원하는 스타일을 최대 3개까지 선택해주세요. (현재: {selectedOptions.length}/3)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {STYLE_OPTIONS.map((option) => {
          const isSelected = selectedOptions.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              className={cn(
                'relative p-6 rounded-lg border-2 transition-all text-left',
                'hover:shadow-md',
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {option.label}
                  </h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
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

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-between gap-4 pt-4">
        <Button type="button" onClick={onPrev} variant="ghost">
          이전
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          variant="primary"
          size="lg"
          disabled={selectedOptions.length === 0}
        >
          다음 단계
        </Button>
      </div>
    </Card>
  );
}
