'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getScoreGrade, getScoreColor } from '@/lib/utils';

interface ScoreCardProps {
  score: number;
}

export function ScoreCard({ score }: ScoreCardProps) {
  const grade = getScoreGrade(score);
  const colorClass = getScoreColor(score);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle>코디 점수</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-6xl font-bold ${colorClass}`}>{score}</div>
            <div className="text-gray-600 text-sm mt-1">/ 100점</div>
          </div>
          <div className={`text-5xl font-bold ${colorClass}`}>{grade}</div>
        </div>

        {/* 진행바 */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${
                score >= 80
                  ? 'bg-green-600'
                  : score >= 60
                  ? 'bg-blue-600'
                  : score >= 40
                  ? 'bg-yellow-600'
                  : 'bg-red-600'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* 등급 설명 */}
        <div className="mt-4 text-sm text-gray-600">
          {score >= 90 && '완벽한 코디네이션입니다! 👏'}
          {score >= 80 && score < 90 && '훌륭한 스타일입니다! ✨'}
          {score >= 70 && score < 80 && '좋은 코디입니다. 약간의 개선으로 더 완벽해집니다!'}
          {score >= 60 && score < 70 && '괜찮은 스타일입니다. 몇 가지 조정이 필요합니다.'}
          {score < 60 && '개선의 여지가 많습니다. 아래 팁을 참고해주세요!'}
        </div>
      </CardContent>
    </Card>
  );
}
