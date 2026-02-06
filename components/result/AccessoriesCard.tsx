'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { Accessory } from '@/types/coordinate';

interface AccessoriesCardProps {
  accessories: Accessory[];
}

export function AccessoriesCard({ accessories }: AccessoriesCardProps) {
  if (accessories.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="text-purple-500" size={20} />
          추천 액세서리
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accessories.map((accessory, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <h4 className="font-semibold text-gray-900 mb-1">
                {accessory.name}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {accessory.description}
              </p>
              <p className="text-xs text-blue-600 italic">
                💡 {accessory.reason}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
