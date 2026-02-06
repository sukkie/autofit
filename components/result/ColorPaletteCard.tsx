'use client';

import React from 'react';
import { Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface ColorPaletteCardProps {
  colors: string[];
}

export function ColorPaletteCard({ colors }: ColorPaletteCardProps) {
  if (colors.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="text-pink-500" size={20} />
          추천 컬러 팔레트
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 flex-wrap">
          {colors.map((color, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div
                className="w-16 h-16 rounded-lg shadow-md border-2 border-gray-200"
                style={{ backgroundColor: color }}
                title={color}
              />
              <span className="text-xs font-mono text-gray-600">{color}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-600">
          이 색상들을 메인 컬러나 포인트 컬러로 활용해보세요.
        </p>
      </CardContent>
    </Card>
  );
}
