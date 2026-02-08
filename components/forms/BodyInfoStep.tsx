'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useLanguage } from '@/contexts/LanguageContext';
import type { BodyInfo } from '@/types/coordinate';

interface BodyInfoStepProps {
  onNext: (info: BodyInfo) => void;
  onPrev: () => void;
  initialData?: BodyInfo | null;
}

export function BodyInfoStep({ onNext, onPrev, initialData }: BodyInfoStepProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<BodyInfo>(
    initialData || {
      gender: '남성',
      height: 170,
      weight: 65,
      bodyType: '보통',
      skinTone: '중성',
      shoulderWidth: '보통',
      bodyShape: '직사각형',
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof BodyInfo, string>>>({});

  // 숫자 입력 변경 핸들러
  const handleNumberChange = (field: 'height' | 'weight', value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setFormData((prev) => ({ ...prev, [field]: numValue }));
    // 에러 초기화
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // 일반 입력 변경 핸들러
  const handleChange = (field: keyof BodyInfo, value: string | number) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // 성별이 변경되면 체형을 기본값으로 리셋
      if (field === 'gender') {
        updated.bodyShape = value === '남성' ? '직사각형' : '직사각형';
      }
      return updated;
    });
    // 에러 초기화
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // 성별에 따른 체형 옵션
  const getBodyShapeOptions = () => {
    if (formData.gender === '남성') {
      return [
        { value: '역삼각형', label: t.bodyInfo.bodyShapes.male.invertedTriangle },
        { value: '직사각형', label: t.bodyInfo.bodyShapes.male.rectangle },
        { value: '사다리꼴', label: t.bodyInfo.bodyShapes.male.trapezoid },
        { value: '원형', label: t.bodyInfo.bodyShapes.male.round },
      ];
    } else {
      return [
        { value: '모래시계', label: t.bodyInfo.bodyShapes.female.hourglass },
        { value: '삼각형', label: t.bodyInfo.bodyShapes.female.triangle },
        { value: '역삼각형', label: t.bodyInfo.bodyShapes.female.invertedTriangle },
        { value: '직사각형', label: t.bodyInfo.bodyShapes.female.rectangle },
        { value: '원형', label: t.bodyInfo.bodyShapes.female.round },
      ];
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
          {t.bodyInfo.title}
        </h2>
        <p className="text-gray-600">
          {t.bodyInfo.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Select
          label={t.bodyInfo.gender}
          value={formData.gender}
          onChange={(e) => handleChange('gender', e.target.value as BodyInfo['gender'])}
          options={[
            { value: '남성', label: t.bodyInfo.genders.male },
            { value: '여성', label: t.bodyInfo.genders.female },
          ]}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t.bodyInfo.height}
            type="number"
            value={formData.height || ''}
            onChange={(e) => handleNumberChange('height', e.target.value)}
            error={errors.height}
            required
            min={100}
            max={250}
            step={1}
          />

          <Input
            label={t.bodyInfo.weight}
            type="number"
            value={formData.weight || ''}
            onChange={(e) => handleNumberChange('weight', e.target.value)}
            error={errors.weight}
            required
            min={30}
            max={200}
            step={1}
          />
        </div>

        <Select
          label={t.bodyInfo.bodyType}
          value={formData.bodyType}
          onChange={(e) => handleChange('bodyType', e.target.value as BodyInfo['bodyType'])}
          options={[
            { value: '마른', label: t.bodyInfo.bodyTypes.slim },
            { value: '보통', label: t.bodyInfo.bodyTypes.normal },
            { value: '통통', label: t.bodyInfo.bodyTypes.chubby },
            { value: '근육질', label: t.bodyInfo.bodyTypes.muscular },
          ]}
          required
        />

        <div>
          <Select
            label={t.bodyInfo.skinTone}
            value={formData.skinTone}
            onChange={(e) => handleChange('skinTone', e.target.value as BodyInfo['skinTone'])}
            options={[
              { value: '쿨톤', label: t.bodyInfo.skinTones.cool },
              { value: '웜톤', label: t.bodyInfo.skinTones.warm },
              { value: '중성', label: t.bodyInfo.skinTones.neutral },
            ]}
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            {t.bodyInfo.skinToneTip}
          </p>
        </div>

        <Select
          label={t.bodyInfo.shoulderWidth}
          value={formData.shoulderWidth}
          onChange={(e) => handleChange('shoulderWidth', e.target.value as BodyInfo['shoulderWidth'])}
          options={[
            { value: '좁음', label: t.bodyInfo.shoulderWidths.narrow },
            { value: '보통', label: t.bodyInfo.shoulderWidths.normal },
            { value: '넓음', label: t.bodyInfo.shoulderWidths.wide },
          ]}
          required
        />

        <div>
          <Select
            label={t.bodyInfo.bodyShape}
            value={formData.bodyShape}
            onChange={(e) => handleChange('bodyShape', e.target.value as BodyInfo['bodyShape'])}
            options={getBodyShapeOptions()}
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            {t.bodyInfo.bodyShapeTip}
          </p>
        </div>

        <div className="flex justify-between gap-4 pt-4">
          <Button type="button" onClick={onPrev} variant="ghost">
            {t.common.prev}
          </Button>
          <Button type="submit" variant="primary" size="lg">
            {t.common.next}
          </Button>
        </div>
      </form>
    </Card>
  );
}
