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
 * POST /api/generate-coordinate-image
 * 분석 결과를 기반으로 코디네이션 이미지 생성
 */
export async function POST(request: NextRequest) {
  try {
    // FormData 파싱
    const formData = await request.formData();

    // 사용자 이미지 파일 추출
    const userImage = formData.get('userImage') as File;
    if (!userImage) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_FILE',
            message: '사용자 이미지가 필요합니다.',
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
    const stylingTipsStr = formData.get('stylingTips') as string;
    const accessoriesStr = formData.get('accessories') as string;
    const colorPaletteStr = formData.get('colorPalette') as string;
    const includeFaceStr = formData.get('includeFace') as string;

    if (
      !bodyInfoStr ||
      !styleOptionsStr ||
      !tpoStr ||
      !stylingTipsStr ||
      !colorPaletteStr
    ) {
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
    const stylingTips: string[] = JSON.parse(stylingTipsStr);
    const accessories: Accessory[] = accessoriesStr
      ? JSON.parse(accessoriesStr)
      : [];
    const colorPalette: string[] = JSON.parse(colorPaletteStr);
    const includeFace: boolean = includeFaceStr ? JSON.parse(includeFaceStr) : true;

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
    const arrayBuffer = await userImage.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // 이미지 생성 API 호출
    const result = await generateCoordinateImageFromAnalysis({
      userImageBuffer: imageBuffer,
      userImageMimeType: userImage.type,
      bodyInfo,
      styleOptions,
      tpo,
      bodyConcerns,
      stylingTips,
      accessories,
      colorPalette,
      includeFace,
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

    // 에러 응답
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '이미지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
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
