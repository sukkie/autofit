import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateCoordinateImage } from '@/lib/vertex-ai';
import type { BodyInfo, TPO, StyleOption, BodyConcern } from '@/types/coordinate';

// 요청 데이터 검증 스키마
const bodyInfoSchema = z.object({
  height: z.number().min(100).max(250),
  weight: z.number().min(30).max(200),
  bodyType: z.enum(['슬림', '표준', '통통', '건장함']),
  skinTone: z.enum(['쿨톤', '웜톤', '중성']),
});

const tpoSchema = z.object({
  time: z.enum(['아침', '점심', '저녁', '밤']),
  place: z.enum(['실내', '실외', '사무실', '카페', '클럽', '레스토랑']),
  occasion: z.enum(['데이트', '회의', '파티', '운동', '쇼핑', '일상']),
});

/**
 * POST /api/coordinate
 * 코디네이션 요청 처리
 */
export async function POST(request: NextRequest) {
  try {
    // FormData 파싱
    const formData = await request.formData();

    // 파일 추출
    const file = formData.get('userPhoto') as File;
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_FILE',
            message: '사용자 사진이 필요합니다.',
          },
        },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (10MB)
    const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760');
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: '파일 크기는 10MB 이하여야 합니다.',
          },
        },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_FILE_TYPE',
            message: 'JPEG, PNG, WEBP 형식만 지원됩니다.',
          },
        },
        { status: 400 }
      );
    }

    // JSON 데이터 파싱
    const bodyInfoStr = formData.get('bodyInfo') as string;
    const styleOptionsStr = formData.get('styleOptions') as string;
    const tpoStr = formData.get('tpo') as string;
    const bodyConcernsStr = formData.get('bodyConcerns') as string;

    if (!bodyInfoStr || !styleOptionsStr || !tpoStr) {
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

    // 데이터 파싱
    const bodyInfo: BodyInfo = JSON.parse(bodyInfoStr);
    const styleOptions: StyleOption[] = JSON.parse(styleOptionsStr);
    const tpo: TPO = JSON.parse(tpoStr);
    const bodyConcerns: BodyConcern[] = bodyConcernsStr
      ? JSON.parse(bodyConcernsStr)
      : [];

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

    // File을 Buffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Vertex AI 호출
    const result = await generateCoordinateImage({
      imageBuffer,
      mimeType: file.type,
      bodyInfo,
      styleOptions,
      tpo,
      bodyConcerns,
    });

    // 성공 응답
    return NextResponse.json({
      success: true,
      data: {
        // generatedImage는 실제로는 분석 결과만 반환 (이미지는 원본 사용)
        generatedImage: '', // 원본 이미지를 클라이언트에서 사용
        score: result.score,
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
