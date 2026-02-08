// 남성 체형 비율 타입
export type MaleBodyShape = '역삼각형' | '직사각형' | '사다리꼴' | '원형';

// 여성 체형 비율 타입
export type FemaleBodyShape = '모래시계' | '삼각형' | '역삼각형' | '직사각형' | '원형';

// 신체 정보 타입
export interface BodyInfo {
  gender: '남성' | '여성';
  height: number; // cm
  weight: number; // kg
  bodyType: '마른' | '보통' | '통통' | '근육질'; // 체격
  skinTone: '쿨톤' | '웜톤' | '중성';
  // 상세 체형 정보
  shoulderWidth: '좁음' | '보통' | '넓음';
  bodyShape: MaleBodyShape | FemaleBodyShape; // 체형 비율 (성별에 따라 다름)
}

// 스타일 옵션 타입
export type StyleOption =
  | '캐주얼'
  | '비즈니스'
  | '스트리트'
  | '미니멀'
  | '빈티지'
  | '스포티';

// TPO (Time, Place, Occasion) 타입
export interface TPO {
  time: '아침' | '점심' | '저녁' | '밤';
  place: '실내' | '실외' | '사무실' | '카페' | '클럽' | '레스토랑';
  occasion: '데이트' | '회의' | '파티' | '운동' | '쇼핑' | '일상';
}

// 신체 고민 사항 타입
export type BodyConcern =
  | '키가 작음'
  | '다리가 짧음'
  | '어깨가 넓음'
  | '상체 비만'
  | '하체 비만'
  | '팔이 짧음'
  | '없음';

// 액세서리 추천 타입
export interface Accessory {
  name: string;
  description: string;
  reason: string;
}

// 컬러 추천 타입
export interface Color {
  name: string; // 색상 이름 (예: "네이비 블루")
  hex: string; // Hex 코드 (예: "#4A4E69")
  usage: string; // 활용 방법 (예: "메인 컬러로 추천")
}

// 코디네이션 요청 타입 (클라이언트)
export interface CoordinateRequest {
  bodyInfo: BodyInfo;
  styleOptions: StyleOption[];
  tpo: TPO;
  bodyConcerns: BodyConcern[];
}

// 코디네이션 요청 타입 (서버)
export interface CoordinateRequestServer {
  bodyInfo: BodyInfo;
  styleOptions: StyleOption[];
  tpo: TPO;
  bodyConcerns: BodyConcern[];
}

// 코디네이션 응답 타입
export interface CoordinateResponse {
  success: boolean;
  data?: {
    stylingTips: string[]; // 스타일링 팁 (최대 5개)
    accessories: Accessory[]; // 추천 액세서리 (최대 3개)
    colorPalette: Color[]; // 추천 컬러 (최대 5개)
    overallComment: string; // 전체 코멘트
  };
  error?: {
    code: string;
    message: string;
  };
}

// 코디 이미지 생성 요청 타입
export interface GenerateCoordinateImageRequest {
  bodyInfo: BodyInfo;
  styleOptions: StyleOption[];
  tpo: TPO;
  bodyConcerns: BodyConcern[];
  stylingTips: string[];
  accessories: Accessory[];
  colorPalette: Color[];
  locale?: string; // 언어 설정 (ko, ja, en 등)
}

// 코디 이미지 생성 응답 타입
export interface GenerateCoordinateImageResponse {
  success: boolean;
  data?: {
    imageUrl: string; // 생성된 이미지 URL 또는 Base64
  };
  error?: {
    code: string;
    message: string;
  };
}

// 폼 단계 타입
export type FormStep =
  | 'bodyInfo'
  | 'styleOption'
  | 'tpo'
  | 'bodyConcern'
  | 'result';

// 폼 상태 타입
export interface FormState {
  currentStep: FormStep;
  bodyInfo: BodyInfo | null;
  styleOptions: StyleOption[];
  tpo: TPO | null;
  bodyConcerns: BodyConcern[];
  isLoading: boolean;
  result: CoordinateResponse['data'] | null;
  error: string | null;
}
