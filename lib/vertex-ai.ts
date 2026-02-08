import type { CoordinateRequestServer } from '@/types/coordinate';

// Gemini 모델 이름
const MODEL = 'gemini-2.5-flash';

// 환경 감지: Node.js인지 Cloudflare Workers인지
const isNodeEnvironment = typeof process !== 'undefined' && process.versions?.node;

/**
 * Node.js 환경: SDK 사용
 */
async function generateWithSDK(request: CoordinateRequestServer) {
  const { VertexAI } = await import('@google-cloud/vertexai');

  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'asia-northeast3';

  if (!project) {
    throw new Error('GOOGLE_CLOUD_PROJECT 환경 변수가 설정되지 않았습니다.');
  }

  // VertexAI 설정 객체
  const vertexConfig: any = {
    project,
    location,
  };

  // JSON 형식의 credentials가 있으면 직접 전달
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    try {
      const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      vertexConfig.googleAuthOptions = {
        credentials,
      };
    } catch (error) {
      console.error('GOOGLE_APPLICATION_CREDENTIALS_JSON 파싱 오류:', error);
    }
  }

  const vertexAI = new VertexAI(vertexConfig);

  const generativeModel = vertexAI.preview.getGenerativeModel({
    model: MODEL,
  });

  const prompt = createPrompt(request);

  const result = await generativeModel.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  });

  const response = result.response;
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('AI 응답이 비어있습니다.');
  }

  return parseAIResponse(text);
}

/**
 * Cloudflare Workers 환경: REST API 사용
 */
async function generateWithRESTAPI(request: CoordinateRequestServer) {
  // REST API 구현은 나중에 Cloudflare에 배포할 때 추가
  // 지금은 에러를 던짐
  throw new Error('Cloudflare Workers 환경에서는 아직 지원되지 않습니다. Node.js 환경에서 실행하세요.');
}

/**
 * 사용자 체형 정보를 기반으로 코디네이션 가이드 생성
 */
export async function generateCoordinateImage(request: CoordinateRequestServer) {
  try {
    if (isNodeEnvironment) {
      // Node.js: SDK 사용 (로컬 개발, Vercel 등)
      return await generateWithSDK(request);
    } else {
      // Cloudflare Workers: REST API 사용 (배포 환경)
      return await generateWithRESTAPI(request);
    }
  } catch (error) {
    console.error('Vertex AI 오류:', error);
    throw error;
  }
}

/**
 * 프롬프트 생성
 */
function createPrompt(request: CoordinateRequestServer): string {
  const { bodyInfo, styleOptions, tpo, bodyConcerns } = request;

  const introText = '당신은 전문 패션 스타일리스트입니다. 제공된 사용자의 상세한 체형 정보를 분석하고, 최적의 코디네이션을 추천해주세요.';

  return introText + `

## 사용자 신체 정보
- 성별: ${bodyInfo.gender}
- 신장: ${bodyInfo.height}cm
- 체중: ${bodyInfo.weight}kg
- 전체 체형: ${bodyInfo.bodyType}
- 피부톤: ${bodyInfo.skinTone}
- 어깨 너비: ${bodyInfo.shoulderWidth}
- 체형 유형: ${bodyInfo.bodyShape}

## 선호 스타일
${styleOptions.join(', ')}

## 착용 상황 (TPO)
- 시간: ${tpo.time}
- 장소: ${tpo.place}
- 상황: ${tpo.occasion}

## 신체 고민 사항
${bodyConcerns.length > 0 ? bodyConcerns.join(', ') : '없음'}

## 요청사항
당신은 전문 스타일리스트입니다. 이 사용자를 위한 최적의 패션 가이드를 제공해주세요:

1. **체형 분석**: 사용자의 신체 특징(어깨 너비, 체형 유형 등)과 고민사항을 고려한 맞춤 가이드
2. **스타일 추천**: 선호 스타일과 TPO에 완벽하게 어울리는 코디 제안
3. **실용적 팁**: 바로 적용 가능한 구체적인 스타일링 조언
4. **컬러 가이드**: 피부톤에 어울리는 색상 팔레트

## 응답 형식 (반드시 JSON 형식으로 응답)
\`\`\`json
{
  "stylingTips": [
    "구체적인 아이템과 스타일링 방법 (예: 하이웨스트 팬츠로 다리 길이 보정)",
    "색상 조합 가이드 (예: 네이비 재킷 + 화이트 셔츠로 깔끔한 이미지)",
    "핏과 실루엣 추천 (예: 오버사이즈보다 슬림핏으로 체형 강조)",
    "레이어링 방법 (예: 얇은 카디건으로 입체감 추가)",
    "상황별 활용 팁 (예: 포멀한 자리엔 넥타이, 캐주얼엔 스카프)"
  ],
  "accessories": [
    {
      "name": "추천 액세서리 이름",
      "description": "어떤 스타일인지 설명",
      "reason": "왜 이 사용자에게 어울리는지"
    }
  ],
  "colorPalette": [
    {
      "name": "색상 이름 (예: 네이비 블루)",
      "hex": "#HEXCODE",
      "usage": "메인 컬러/포인트 컬러/액센트 등 활용 방법"
    }
  ],
  "overallComment": "이 사용자에게 어울리는 전체적인 스타일 방향성과 핵심 포인트를 친근하게 설명 (200자 이내)"
}
\`\`\`

**중요**: 평가나 비판이 아닌, 긍정적이고 실용적인 가이드를 제공하세요. "~하면 더 좋아요", "~을 추천해요" 같은 톤으로 작성하세요.`;
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
