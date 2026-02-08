'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useLanguage } from '@/contexts/LanguageContext';

interface ScoreCardProps {
  score: number;
}

export function ScoreCard({ score }: ScoreCardProps) {
  const { t } = useLanguage();

  // 점수를 스타일 매칭도로 표현
  const getMatchingLevel = (score: number) => {
    if (score >= 90) return { icon: '⭐⭐⭐', text: t.result.matching.perfect, color: 'text-yellow-600' };
    if (score >= 80) return { icon: '⭐⭐', text: t.result.matching.excellent, color: 'text-green-600' };
    if (score >= 70) return { icon: '⭐', text: t.result.matching.good, color: 'text-blue-600' };
    return { icon: '💡', text: t.result.matching.guide, color: 'text-purple-600' };
  };

  const matching = getMatchingLevel(score);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle>{t.result.styleMatch}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-5xl mb-3">{matching.icon}</div>
          <div className={`text-2xl font-bold ${matching.color} mb-2`}>
            {matching.text}
          </div>
          <div className="text-sm text-gray-600 mb-4">
            {t.result.styleMatchSubtitle}
          </div>
        </div>

        {/* 진행바 */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-500 to-purple-500`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{t.result.matching.start}</span>
            <span>{t.result.matching.perfect}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
