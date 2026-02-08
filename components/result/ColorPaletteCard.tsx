'use client';

import React from 'react';
import { Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Color } from '@/types/coordinate';

interface ColorPaletteCardProps {
  colors: Color[];
}

export function ColorPaletteCard({ colors }: ColorPaletteCardProps) {
  const { t } = useLanguage();

  if (colors.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="text-pink-500" size={20} />
          {t.result.colorPalette}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 flex-wrap justify-center">
          {colors.map((color, index) => (
            <div key={index} className="flex flex-col items-center gap-3 max-w-[120px]">
              <div
                className="w-20 h-20 rounded-xl shadow-lg border-2 border-gray-300 hover:scale-110 transition-transform cursor-pointer"
                style={{ backgroundColor: color.hex }}
                title={`${color.name} (${color.hex})`}
              />
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800">{color.name}</p>
                <p className="text-xs font-mono text-gray-600 mt-1">{color.hex}</p>
                <p className="text-xs text-gray-500 mt-1">{color.usage}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-gray-600 text-center">
          {t.result.colorHelp}
        </p>
      </CardContent>
    </Card>
  );
}
