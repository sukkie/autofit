'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { BodyInfo } from '@/types/coordinate';

interface BodyInfoStepProps {
  onNext: (info: BodyInfo) => void;
  onPrev: () => void;
  initialData?: BodyInfo | null;
}

export function BodyInfoStep({ onNext, onPrev, initialData }: BodyInfoStepProps) {
  const [formData, setFormData] = useState<BodyInfo>(
    initialData || {
      height: 170,
      weight: 65,
      bodyType: '표준',
      skinTone: '중성',
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof BodyInfo, string>>>({});

  // 입력 변경 핸들러
  const handleChange = (field: keyof BodyInfo, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 에러 초기화
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // 유효성 검사
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BodyInfo, string>> = {};

    if (formData.height < 100 || formData.height > 250) {
      newErrors.height = '신장은 100cm에서 250cm 사이여야 합니다.';
    }

    if (formData.weight < 30 || formData.weight > 200) {
      newErrors.weight = '체중은 30kg에서 200kg 사이여야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          신체 정보 입력
        </h2>
        <p className="text-gray-600">
          정확한 코디네이션을 위해 신체 정보를 입력해주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="신장 (cm)"
            type="number"
            value={formData.height}
            onChange={(e) => handleChange('height', parseInt(e.target.value) || 0)}
            error={errors.height}
            required
            min={100}
            max={250}
          />

          <Input
            label="체중 (kg)"
            type="number"
            value={formData.weight}
            onChange={(e) => handleChange('weight', parseInt(e.target.value) || 0)}
            error={errors.weight}
            required
            min={30}
            max={200}
          />
        </div>

        <Select
          label="체형"
          value={formData.bodyType}
          onChange={(e) => handleChange('bodyType', e.target.value as BodyInfo['bodyType'])}
          options={[
            { value: '슬림', label: '슬림 - 마른 체형' },
            { value: '표준', label: '표준 - 보통 체형' },
            { value: '통통', label: '통통 - 풍만한 체형' },
            { value: '건장함', label: '건장함 - 근육질 체형' },
          ]}
          required
        />

        <Select
          label="피부톤"
          value={formData.skinTone}
          onChange={(e) => handleChange('skinTone', e.target.value as BodyInfo['skinTone'])}
          options={[
            { value: '쿨톤', label: '쿨톤 - 차가운 톤' },
            { value: '웜톤', label: '웜톤 - 따뜻한 톤' },
            { value: '중성', label: '중성 - 중간 톤' },
          ]}
          required
        />

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
