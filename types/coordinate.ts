// 신체 정보 타입
export interface BodyInfo {
  gender: '남성' | '여성';
  height: number; // cm
  weight: number; // kg
  bodyType: '슬림' | '표준' | '통통' | '건장함';
  skinTone: '쿨톤' | '웜톤' | '중성';
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

// 코디네이션 요청 타입 (클라이언트)
export interface CoordinateRequest {
  userPhoto: File;
  bodyInfo: BodyInfo;
  styleOptions: StyleOption[];
  tpo: TPO;
  bodyConcerns: BodyConcern[];
  includeFace: boolean; // 얼굴 포함 여부
}

// 코디네이션 요청 타입 (서버)
export interface CoordinateRequestServer {
  imageBuffer: Buffer;
  mimeType: string;
  bodyInfo: BodyInfo;
  styleOptions: StyleOption[];
  tpo: TPO;
  bodyConcerns: BodyConcern[];
  includeFace: boolean; // 얼굴 포함 여부
}

// 코디네이션 응답 타입
export interface CoordinateResponse {
  success: boolean;
  data?: {
    score: number; // 0-100점
    stylingTips: string[]; // 스타일링 팁 (최대 5개)
    accessories: Accessory[]; // 추천 액세서리 (최대 3개)
    colorPalette: string[]; // 추천 컬러 (Hex 코드, 최대 5개)
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
  colorPalette: string[];
  includeFace: boolean; // 얼굴 포함 여부
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
  | 'photo'
  | 'bodyInfo'
  | 'styleOption'
  | 'tpo'
  | 'bodyConcern'
  | 'result';

// 폼 상태 타입
export interface FormState {
  currentStep: FormStep;
  userPhoto: File | null;
  previewUrl: string | null;
  includeFace: boolean; // 얼굴 포함 여부
  bodyInfo: BodyInfo | null;
  styleOptions: StyleOption[];
  tpo: TPO | null;
  bodyConcerns: BodyConcern[];
  isLoading: boolean;
  result: CoordinateResponse['data'] | null;
  error: string | null;
}
