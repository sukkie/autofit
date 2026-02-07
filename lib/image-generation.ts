import { VertexAI } from '@google-cloud/vertexai';
import type { GenerateCoordinateImageRequest } from '@/types/coordinate';

// 이미지 생성 모델 이름
const imageModel = 'gemini-2.5-flash-image';

/**
 * Vertex AI 클라이언트 가져오기 (이미지 생성용)
 * Gemini 2.5 Flash Image는 특정 리전에서만 지원됨
 */
function getVertexAI(): VertexAI {
  if (!process.env.GOOGLE_CLOUD_PROJECT) {
    throw new Error('GOOGLE_CLOUD_PROJECT 환경 변수가 설정되지 않았습니다.');
  }

  // Google Cloud 인증 설정
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = JSON.stringify(credentials);
  }

  // 이미지 생성 모델은 us-central1 또는 global 리전 사용
  const imageGenerationLocation = process.env.GOOGLE_CLOUD_IMAGE_LOCATION || 'us-central1';

  return new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: imageGenerationLocation,
  });
}

/**
 * 코디네이션 이미지 생성 요청을 위한 서버 타입
 */
interface GenerateImageRequestServer extends GenerateCoordinateImageRequest {
  userImageBuffer: Buffer;
  userImageMimeType: string;
}

/**
 * 분석 결과를 기반으로 코디네이션 이미지 생성
 */
export async function generateCoordinateImageFromAnalysis(
  request: GenerateImageRequestServer
) {
  try {
    const vertex_ai = getVertexAI();
    const generativeModel = vertex_ai.preview.getGenerativeModel({
      model: imageModel,
    });

    // 사용자 이미지를 Base64로 변환
    const userImageBase64 = request.userImageBuffer.toString('base64');

    // 이미지 생성을 위한 프롬프트 생성
    const prompt = createImageGenerationPrompt(request);

    // Gemini API 호출 (이미지 생성)
    const result = await generativeModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: request.userImageMimeType,
                data: userImageBase64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 8192,
        candidateCount: 1, // 이미지 1장만 생성
      },
    });

    const response = result.response;

    // 생성된 이미지가 있는지 확인
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error('이미지 생성 실패: 응답이 없습니다.');
    }

    // 이미지 데이터 추출
    const parts = candidates[0]?.content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error('이미지 생성 실패: 이미지 데이터가 없습니다.');
    }

    // inlineData에서 이미지 추출
    let imageData = null;
    for (const part of parts) {
      if (part.inlineData) {
        imageData = part.inlineData.data;
        break;
      }
    }

    if (!imageData) {
      throw new Error('이미지 생성 실패: 이미지를 찾을 수 없습니다.');
    }

    // Base64 이미지 URL 생성
    const imageUrl = `data:image/png;base64,${imageData}`;

    return {
      imageUrl,
    };
  } catch (error) {
    console.error('이미지 생성 오류:', error);
    throw error;
  }
}

/**
 * 이미지 생성을 위한 프롬프트 생성
 */
function createImageGenerationPrompt(
  request: GenerateCoordinateImageRequest
): string {
  const { bodyInfo, styleOptions, tpo, bodyConcerns, stylingTips, colorPalette, includeFace } = request;

  // 액세서리 리스트 생성
  const accessoriesText = request.accessories.length > 0
    ? request.accessories.map(acc => acc.name).join(', ')
    : '없음';

  // 얼굴 포함 여부에 따른 인물 설명
  const personDescription = includeFace
    ? '위 사진 속 인물과 동일한 얼굴, 체형, 피부톤으로 생성'
    : '위 사진 속 인물과 동일한 체형, 피부톤의 모델로 생성 (얼굴은 가상의 모델 얼굴 사용)';

  return `이 사람을 위한 3가지 다른 패션 코디 옵션을 나란히 보여주는 이미지 1장을 생성해주세요.

## 인물 정보
- 신장: ${bodyInfo.height}cm, 체중: ${bodyInfo.weight}kg
- 체형: ${bodyInfo.bodyType}
- 피부톤: ${bodyInfo.skinTone}
- 신체 고민: ${bodyConcerns.length > 0 ? bodyConcerns.join(', ') : '없음'}

## 착용 상황 (TPO)
${tpo.time}, ${tpo.place}에서 ${tpo.occasion} 상황

## 코디 스타일
스타일: ${styleOptions.join(', ')}

## 구체적인 스타일링 가이드
${stylingTips.map((tip, idx) => `${idx + 1}. ${tip}`).join('\n')}

## 추천 컬러
${colorPalette.join(', ')}

## 추천 액세서리
${accessoriesText}

---

**이미지 생성 요구사항:**
1. ${personDescription}
2. 같은 인물이 서로 다른 3가지 코디를 입은 모습을 가로로 나란히 배치
3. 각 코디는 전신 샷(머리부터 발끝까지)
4. 3가지 코디 모두 위 스타일링 가이드를 기반으로 하되, 각각 다른 조합으로 구성:
   - 첫 번째: 가장 포멀하고 정통적인 스타일
   - 두 번째: 캐주얼하면서도 세련된 스타일
   - 세 번째: 액세서리와 컬러를 강조한 대담한 스타일
5. TPO에 적합한 코디네이션
6. 추천 컬러 팔레트 색상 활용
7. 깔끔하고 전문적인 패션 룩북 스타일
8. 고화질, 자연스러운 조명
9. 3개의 코디가 한 장의 이미지에 균등하게 배치

이미지 1장만 생성하세요.`;
}
