'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Sparkles, TrendingUp, Palette, Shirt } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto">
      {/* 히어로 섹션 */}
      <div className="text-center mb-16 animate-fade-in">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
            <Sparkles className="text-white" size={40} />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          {t.landing.hero.title1}
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            {t.landing.hero.title2}
          </span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t.landing.hero.subtitle1}
          <br />
          {t.landing.hero.subtitle2}
        </p>

        <Button onClick={onStart} size="lg" className="px-12 py-4 text-lg">
          {t.landing.hero.cta}
        </Button>

        <p className="text-sm text-gray-500 mt-4">
          {t.landing.hero.features}
        </p>
      </div>

      {/* 기능 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="text-blue-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {t.landing.features.analysis.title}
          </h3>
          <p className="text-gray-600">
            {t.landing.features.analysis.description}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Palette className="text-purple-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {t.landing.features.color.title}
          </h3>
          <p className="text-gray-600">
            {t.landing.features.color.description}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
            <Shirt className="text-pink-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {t.landing.features.guide.title}
          </h3>
          <p className="text-gray-600">
            {t.landing.features.guide.description}
          </p>
        </div>
      </div>

      {/* 작동 방식 */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {t.landing.howItWorks.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{t.landing.howItWorks.step1.title}</h4>
            <p className="text-sm text-gray-600">{t.landing.howItWorks.step1.description}</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{t.landing.howItWorks.step2.title}</h4>
            <p className="text-sm text-gray-600">{t.landing.howItWorks.step2.description}</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{t.landing.howItWorks.step3.title}</h4>
            <p className="text-sm text-gray-600">{t.landing.howItWorks.step3.description}</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{t.landing.howItWorks.step4.title}</h4>
            <p className="text-sm text-gray-600">{t.landing.howItWorks.step4.description}</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              ✓
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{t.landing.howItWorks.step5.title}</h4>
            <p className="text-sm text-gray-600">{t.landing.howItWorks.step5.description}</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t.landing.cta.title}
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          {t.landing.cta.subtitle}
        </p>
        <Button onClick={onStart} size="lg" className="px-12 py-4 text-lg">
          {t.landing.cta.button}
        </Button>
      </div>
    </div>
  );
}
