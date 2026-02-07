'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export function Header() {
  const { t } = useLanguage();
  const router = useRouter();

  // 로고 클릭 시 메인으로 이동
  const handleLogoClick = () => {
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">AF</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t.header.title}</h1>
              <p className="text-xs text-gray-500">{t.header.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <div className="text-sm text-gray-600 hidden md:block">
              {t.header.poweredBy}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
