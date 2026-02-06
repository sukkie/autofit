import type { BodyInfo, TPO, StyleOption, BodyConcern } from '@/types/coordinate';

/**
 * 코디네이션 프롬프트 템플릿 생성
 */
export function createCoordinationPrompt(
  bodyInfo: BodyInfo,
  styleOptions: StyleOption[],
  tpo: TPO,
  bodyConcerns: BodyConcern[]
): string {
  return `당신은 전문 패션 스타일리스트이자 이미지 컨설턴트입니다.
제공된 사용자 사진을 세밀하게 분석하고, 아래 정보를 종합하여 최적의 코디네이션을 추천해주세요.

## 📊 사용자 프로필
### 신체 정보
- **신장**: ${bodyInfo.height}cm
- **체중**: ${bodyInfo.weight}kg
- **체형**: ${bodyInfo.bodyType}
- **피부톤**: ${bodyInfo.skinTone}

### 선호 스타일
${styleOptions.map((style, idx) => `${idx + 1}. ${style}`).join('\n')}

### 착용 상황 (TPO)
- **시간대**: ${tpo.time}
- **장소**: ${tpo.place}
- **상황**: ${tpo.occasion}

### 신체 고민 사항
${bodyConcerns.length > 0 ? bodyConcerns.map((concern, idx) => `${idx + 1}. ${concern}`).join('\n') : '- 특별한 고민 없음'}

---

## 📝 분석 및 추천 요청사항

1. **현재 스타일 분석**
   - 사진 속 착용 의상의 핏, 색상, 스타일 평가
   - 체형과의 조화도 분석
   - TPO 적합성 평가

2. **개선 포인트**
   - 신체 비율을 보완할 수 있는 아이템 선택
   - 피부톤에 맞는 색상 팔레트
   - 체형 고민을 커버하는 실루엣 제안

3. **구체적 코디네이션 가이드**
   - 상의/하의/신발/아우터 조합
   - 레이어링 방법
   - 소재 및 패턴 선택

4. **스타일링 디테일**
   - 액세서리 활용법
   - 헤어스타일 제안
   - 메이크업 톤 (해당 시)

---

## 🎯 응답 형식

**반드시 아래 JSON 형식으로만 응답해주세요:**

\`\`\`json
{
  "score": 75,
  "stylingTips": [
    "구체적이고 실용적인 팁 1",
    "구체적이고 실용적인 팁 2",
    "구체적이고 실용적인 팁 3",
    "구체적이고 실용적인 팁 4",
    "구체적이고 실용적인 팁 5"
  ],
  "accessories": [
    {
      "name": "액세서리 이름",
      "description": "20자 이내 설명",
      "reason": "이 액세서리가 스타일을 완성시키는 이유"
    }
  ],
  "colorPalette": ["#HEXCODE1", "#HEXCODE2", "#HEXCODE3", "#HEXCODE4", "#HEXCODE5"],
  "overallComment": "전반적인 스타일 진단과 개선 방향을 150-200자로 요약"
}
\`\`\`

### 점수 기준 (0-100)
- **90-100**: 완벽한 조화, TPO 최적, 체형 보완 탁월
- **80-89**: 우수한 스타일링, 약간의 개선 여지
- **70-79**: 양호, 몇 가지 개선 필요
- **60-69**: 보통, 상당한 개선 필요
- **0-59**: 전반적인 재검토 필요

### 주의사항
- 모든 조언은 구체적이고 실행 가능해야 합니다
- 한국 패션 트렌드를 반영해주세요
- 색상 코드는 반드시 유효한 Hex 코드로 제공
- 액세서리는 실제 구매 가능한 일반적인 아이템으로`;
}

/**
 * 이미지 생성 프롬프트 (향후 확장용)
 */
export function createImageGenerationPrompt(
  bodyInfo: BodyInfo,
  styleOptions: StyleOption[],
  recommendations: string[]
): string {
  return `Generate a fashion coordination image with the following specifications:

Body Type: ${bodyInfo.bodyType}
Height: ${bodyInfo.height}cm
Skin Tone: ${bodyInfo.skinTone}

Style Preferences: ${styleOptions.join(', ')}

Recommendations:
${recommendations.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n')}

Create a realistic, well-coordinated outfit visualization that matches these specifications.`;
}

/**
 * 색상 분석 프롬프트
 */
export function createColorAnalysisPrompt(skinTone: string): string {
  return `다음 피부톤에 가장 잘 어울리는 색상 조합 5가지를 추천해주세요: ${skinTone}

응답 형식:
\`\`\`json
{
  "colors": ["#HEXCODE1", "#HEXCODE2", "#HEXCODE3", "#HEXCODE4", "#HEXCODE5"],
  "explanation": "이 색상들이 ${skinTone}에 어울리는 이유"
}
\`\`\``;
}
