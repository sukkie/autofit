import { VertexAI } from '@google-cloud/vertexai';
import type { CoordinateRequestServer } from '@/types/coordinate';
import { compressImage } from './image-compression';

// Gemini 모델 이름
const model = 'gemini-2.5-flash';

/**
 * Vertex AI 클라이언트 가져오기 (지연 초기화)
 */
function getVertexAI(): VertexAI {
  if (!process.env.GOOGLE_CLOUD_PROJECT) {
    throw new Error('GOOGLE_CLOUD_PROJECT 환경 변수가 설정되지 않았습니다.');
  }

  // Google Cloud 인증 설정
  // 환경 변수에 JSON 키가 있으면 사용, 없으면 파일 경로 사용
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    // Vercel/Cloudflare 등 서버리스 환경: JSON 문자열로 인증
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = JSON.stringify(credentials);
  }
  // 로컬 개발 환경에서는 vertex-ai-key.json 파일 사용

  return new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: process.env.GOOGLE_CLOUD_LOCATION || 'asia-northeast3',
  });
}

/**
 * 사용자 사진과 정보를 기반으로 코디네이션 이미지 생성
 */
export async function generateCoordinateImage(request: CoordinateRequestServer) {
  try {
    const vertex_ai = getVertexAI();
    const generativeModel = vertex_ai.preview.getGenerativeModel({
      model: model,
    });

    // 이미지 압축 (1MB 이상인 경우 0.5MB로 압축)
    const compressed = await compressImage(request.imageBuffer, request.mimeType);

    // Buffer를 Base64로 변환
    const imageBase64 = compressed.buffer.toString('base64');

    // 프롬프트 생성
    const prompt = createPrompt(request);

    // Gemini API 호출
    const result = await generativeModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: compressed.mimeType,
                data: imageBase64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('AI 응답이 비어있습니다.');
    }

    // JSON 파싱
    return parseAIResponse(text);
  } catch (error) {
    console.error('Vertex AI 오류:', error);
    throw error;
  }
}

/**
 * 프롬프트 생성
 */
function createPrompt(request: CoordinateRequestServer): string {
  const { bodyInfo, styleOptions, tpo, bodyConcerns, includeFace } = request;

  const introText = includeFace
    ? '당신은 전문 패션 스타일리스트입니다. 제공된 사용자 전신 사진(얼굴 포함)을 분석하고, 다음 정보를 바탕으로 최적의 코디네이션을 추천해주세요.'
    : '당신은 전문 패션 스타일리스트입니다. 제공된 사용자 전신 사진(목 아래부터)을 분석하고, 다음 정보를 바탕으로 최적의 코디네이션을 추천해주세요. 피부톤은 사용자가 입력한 정보를 기준으로 분석하세요.';

  return introText + `

## 사용자 정보
- 신장: ${bodyInfo.height}cm
- 체중: ${bodyInfo.weight}kg
- 체형: ${bodyInfo.bodyType}
- 피부톤: ${bodyInfo.skinTone}

## 선호 스타일
${styleOptions.join(', ')}

## 착용 상황 (TPO)
- 시간: ${tpo.time}
- 장소: ${tpo.place}
- 상황: ${tpo.occasion}

## 신체 고민 사항
${bodyConcerns.length > 0 ? bodyConcerns.join(', ') : '없음'}

## 요청사항
1. 사용자의 현재 스타일을 분석하고 개선점을 찾아주세요
2. 신체 비율을 보완할 수 있는 코디네이션을 추천해주세요
3. TPO에 적합한 스타일을 제안해주세요
4. 구체적이고 실용적인 스타일링 팁을 제공해주세요

## 응답 형식 (반드시 JSON 형식으로 응답)
\`\`\`json
{
  "score": 85,
  "stylingTips": [
    "팁1: 구체적인 스타일링 조언",
    "팁2: 색상 매칭 조언",
    "팁3: 아이템 선택 조언",
    "팁4: 핏과 실루엣 조언",
    "팁5: 액세서리 활용 조언"
  ],
  "accessories": [
    {
      "name": "액세서리 이름",
      "description": "간단한 설명",
      "reason": "추천 이유"
    }
  ],
  "colorPalette": ["#HEXCODE1", "#HEXCODE2", "#HEXCODE3", "#HEXCODE4", "#HEXCODE5"],
  "overallComment": "전체적인 스타일 분석과 개선 방향을 200자 이내로 작성"
}
\`\`\`

점수는 0-100 사이로 매기며, 현재 스타일의 완성도, TPO 적합성, 체형 보완 정도를 종합적으로 평가합니다.`;
}

/**
 * AI 응답 파싱
 */
function parseAIResponse(text: string) {
  try {
    // JSON 부분만 추출 (```json ... ``` 형식 처리)
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonText = jsonMatch ? jsonMatch[1] : text;

    const parsed = JSON.parse(jsonText);

    return {
      score: parsed.score || 70,
      stylingTips: parsed.stylingTips || [],
      accessories: parsed.accessories || [],
      colorPalette: parsed.colorPalette || [],
      overallComment: parsed.overallComment || '',
    };
  } catch (error) {
    console.error('AI 응답 파싱 오류:', error);
    throw new Error('AI 응답을 파싱할 수 없습니다.');
  }
}
