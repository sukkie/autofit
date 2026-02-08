import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateCoordinateImageFromAnalysis } from '@/lib/image-generation';
import type {
  BodyInfo,
  TPO,
  StyleOption,
  BodyConcern,
  Accessory,
} from '@/types/coordinate';

// 요청 데이터 검증 스키마
const bodyInfoSchema = z.object({
  gender: z.enum(['남성', '여성']),
  height: z.number().min(100).max(250),
  weight: z.number().min(30).max(200),
  bodyType: z.enum(['마른', '보통', '통통', '근육질']),
  skinTone: z.enum(['쿨톤', '웜톤', '중성']),
  shoulderWidth: z.enum(['좁음', '보통', '넓음']),
  bodyShape: z.enum(['역삼각형', '삼각형', '직사각형', '모래시계', '원형', '사다리꼴']),
});

const tpoSchema = z.object({
  time: z.enum(['아침', '점심', '저녁', '밤']),
  place: z.enum(['실내', '실외', '사무실', '카페', '클럽', '레스토랑']),
  occasion: z.enum(['데이트', '회의', '파티', '운동', '쇼핑', '일상']),
});

/**
 * POST /api/generate-coordinate-image
 * 분석 결과를 기반으로 코디네이션 이미지 생성
 */
export async function POST(request: NextRequest) {
  console.log('===== 이미지 생성 API 호출됨 =====');

  try {
    // 로케일 감지 (헤더 또는 쿠키에서)
    const acceptLanguage = request.headers.get('accept-language') || '';
    const locale = acceptLanguage.toLowerCase().includes('ko') ? 'ko'
                  : acceptLanguage.toLowerCase().includes('ja') ? 'ja'
                  : 'en';
    console.log('감지된 로케일:', locale);

    // JSON 데이터 파싱
    console.log('1. JSON 파싱 시작...');
    const body = await request.json();
    console.log('2. JSON 파싱 완료:', Object.keys(body));

    const {
      bodyInfo,
      styleOptions,
      tpo,
      bodyConcerns = [],
      stylingTips,
      accessories = [],
      colorPalette,
    }: {
      bodyInfo: BodyInfo;
      styleOptions: StyleOption[];
      tpo: TPO;
      bodyConcerns?: BodyConcern[];
      stylingTips: string[];
      accessories?: Accessory[];
      colorPalette: string[];
    } = body;

    if (!bodyInfo || !styleOptions || !tpo || !stylingTips || !colorPalette) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: '필수 필드가 누락되었습니다.',
          },
        },
        { status: 400 }
      );
    }

    // 데이터 검증
    try {
      bodyInfoSchema.parse(bodyInfo);
      tpoSchema.parse(tpo);
    } catch (validationError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '입력 데이터가 유효하지 않습니다.',
          },
        },
        { status: 400 }
      );
    }

    // 이미지 생성 API 호출 (사진 없이)
    const result = await generateCoordinateImageFromAnalysis({
      bodyInfo,
      styleOptions,
      tpo,
      bodyConcerns,
      stylingTips,
      accessories,
      colorPalette,
      locale,
    });

    // 성공 응답
    return NextResponse.json({
      success: true,
      data: {
        imageUrl: result.imageUrl,
      },
    });
  } catch (error) {
    console.error('이미지 생성 API 오류:', error);
    console.error('에러 상세:', error instanceof Error ? error.message : String(error));
    console.error('스택 트레이스:', error instanceof Error ? error.stack : 'N/A');

    // 에러 응답
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : '이미지 생성 중 오류가 발생했습니다.',
          details: error instanceof Error ? error.stack : String(error),
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generate-coordinate-image
 * 헬스체크
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Generate Coordinate Image API is running',
  });
}
