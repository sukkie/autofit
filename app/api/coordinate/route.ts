import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateCoordinateImage } from '@/lib/vertex-ai';
import type { BodyInfo, TPO, StyleOption, BodyConcern } from '@/types/coordinate';

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
 * POST /api/coordinate
 * 코디네이션 요청 처리 (이미지 없이 체형 정보만으로)
 */
export async function POST(request: NextRequest) {
  try {
    // JSON 데이터 파싱
    const body = await request.json();

    const {
      bodyInfo,
      styleOptions,
      tpo,
      bodyConcerns = [],
    }: {
      bodyInfo: BodyInfo;
      styleOptions: StyleOption[];
      tpo: TPO;
      bodyConcerns?: BodyConcern[];
    } = body;

    if (!bodyInfo || !styleOptions || !tpo) {
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

    // Vertex AI 호출 (체형 정보만 전송)
    const result = await generateCoordinateImage({
      bodyInfo,
      styleOptions,
      tpo,
      bodyConcerns,
    });

    // 성공 응답
    return NextResponse.json({
      success: true,
      data: {
        stylingTips: result.stylingTips,
        accessories: result.accessories,
        colorPalette: result.colorPalette,
        overallComment: result.overallComment,
      },
    });
  } catch (error) {
    console.error('API 오류:', error);

    // 에러 응답
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/coordinate
 * 헬스체크
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Coordinate API is running',
  });
}
