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
          당신만을 위한
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            AI 패션 코디네이터
          </span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          단 5분이면 완성되는 맞춤형 스타일링 가이드
          <br />
          당신의 체형, 피부톤, 스타일을 분석하여 최적의 코디를 제안합니다
        </p>

        <Button onClick={onStart} size="lg" className="px-12 py-4 text-lg">
          무료로 시작하기
        </Button>

        <p className="text-sm text-gray-500 mt-4">
          ✨ 회원가입 불필요 · 100% 무료 · 개인정보 저장 안함
        </p>
      </div>

      {/* 기능 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="text-blue-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            정확한 분석
          </h3>
          <p className="text-gray-600">
            신체 비율과 피부톤을 고려한
            과학적인 스타일 분석
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Palette className="text-purple-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            컬러 매칭
          </h3>
          <p className="text-gray-600">
            당신에게 어울리는
            최적의 컬러 팔레트 추천
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
            <Shirt className="text-pink-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            스타일 가이드
          </h3>
          <p className="text-gray-600">
            TPO별 상황에 맞는
            구체적인 코디 조언
          </p>
        </div>
      </div>

      {/* 작동 방식 */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          어떻게 작동하나요?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">신체 정보</h4>
            <p className="text-sm text-gray-600">키, 체중, 체형 입력</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">사진 업로드</h4>
            <p className="text-sm text-gray-600">전신 사진 촬영</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">스타일 선택</h4>
            <p className="text-sm text-gray-600">선호 스타일 고르기</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">상황 설정</h4>
            <p className="text-sm text-gray-600">착용 상황 선택</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              ✓
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">결과 확인</h4>
            <p className="text-sm text-gray-600">맞춤 코디 가이드</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          지금 바로 시작하세요
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          AI가 분석하는 나만의 스타일링 가이드
        </p>
        <Button onClick={onStart} size="lg" className="px-12 py-4 text-lg">
          무료 분석 시작하기
        </Button>
      </div>
    </div>
  );
}
