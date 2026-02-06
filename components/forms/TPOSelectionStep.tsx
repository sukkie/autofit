'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import type { TPO } from '@/types/coordinate';

interface TPOSelectionStepProps {
  onNext: (tpo: TPO) => void;
  onPrev: () => void;
  initialData?: TPO | null;
}

export function TPOSelectionStep({ onNext, onPrev, initialData }: TPOSelectionStepProps) {
  const [formData, setFormData] = useState<TPO>(
    initialData || {
      time: '점심',
      place: '실내',
      occasion: '일상',
    }
  );

  // 입력 변경 핸들러
  const handleChange = (field: keyof TPO, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value as TPO[typeof field],
    }));
  };

  // 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          착용 상황 선택 (TPO)
        </h2>
        <p className="text-gray-600">
          언제, 어디서, 어떤 상황에 착용할지 선택해주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Select
            label="시간대 (Time)"
            value={formData.time}
            onChange={(e) => handleChange('time', e.target.value)}
            options={[
              { value: '아침', label: '아침 (06:00 - 12:00)' },
              { value: '점심', label: '점심 (12:00 - 18:00)' },
              { value: '저녁', label: '저녁 (18:00 - 22:00)' },
              { value: '밤', label: '밤 (22:00 - 06:00)' },
            ]}
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            시간대에 따라 적절한 컬러와 스타일을 추천합니다.
          </p>
        </div>

        <div>
          <Select
            label="장소 (Place)"
            value={formData.place}
            onChange={(e) => handleChange('place', e.target.value)}
            options={[
              { value: '실내', label: '실내 - 일반적인 실내 공간' },
              { value: '실외', label: '실외 - 야외 공간' },
              { value: '사무실', label: '사무실 - 업무 공간' },
              { value: '카페', label: '카페 - 카페/레스토랑' },
              { value: '클럽', label: '클럽 - 나이트클럽/바' },
              { value: '레스토랑', label: '레스토랑 - 고급 레스토랑' },
            ]}
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            장소에 맞는 복장 격식을 고려합니다.
          </p>
        </div>

        <div>
          <Select
            label="상황 (Occasion)"
            value={formData.occasion}
            onChange={(e) => handleChange('occasion', e.target.value)}
            options={[
              { value: '데이트', label: '데이트 - 연인과의 만남' },
              { value: '회의', label: '회의 - 비즈니스 미팅' },
              { value: '파티', label: '파티 - 파티/행사' },
              { value: '운동', label: '운동 - 운동/액티비티' },
              { value: '쇼핑', label: '쇼핑 - 쇼핑/외출' },
              { value: '일상', label: '일상 - 평범한 일상' },
            ]}
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            상황에 어울리는 스타일을 제안합니다.
          </p>
        </div>

        <div className="flex justify-between gap-4 pt-4">
          <Button type="button" onClick={onPrev} variant="ghost">
            이전
          </Button>
          <Button type="submit" variant="primary" size="lg">
            다음 단계
          </Button>
        </div>
      </form>
    </Card>
  );
}
