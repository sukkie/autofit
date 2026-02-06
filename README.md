# 오토핏 (AutoFit) - AI 가상 코디네이션

패션 초보자를 위한 AI 기반 가상 코디네이션 서비스입니다. 사진 한 장과 간단한 정보 입력으로 맞춤형 스타일링 조언을 받을 수 있습니다.

## 🎯 주요 기능

- **사진 분석**: 전신 사진을 업로드하면 AI가 현재 스타일 분석
- **맞춤형 추천**: 신체 정보, 선호 스타일, TPO를 고려한 코디 제안
- **스타일링 가이드**: 구체적인 스타일링 팁 5가지 제공
- **액세서리 추천**: 스타일을 완성할 액세서리 제안
- **컬러 팔레트**: 피부톤에 맞는 추천 컬러
- **점수 평가**: 0-100점 스케일의 코디 점수

## 🛠 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Vertex AI (Gemini 1.5 Pro)
- **Form**: React Hook Form
- **Validation**: Zod
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 📋 사전 요구사항

1. **Node.js**: v18.17 이상
2. **Google Cloud 프로젝트**: Vertex AI API 활성화 필요
3. **서비스 어카운트 키**: Vertex AI 접근 권한이 있는 JSON 키

## 🚀 설치 및 실행

### 1. 저장소 클론

```bash
git clone <repository-url>
cd autofit
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local.example` 파일을 복사하여 `.env.local` 생성:

```bash
cp .env.local.example .env.local
```

`.env.local` 파일 수정:

```env
GOOGLE_CLOUD_PROJECT=your-actual-project-id
GOOGLE_CLOUD_LOCATION=asia-northeast3
GOOGLE_APPLICATION_CREDENTIALS=./vertex-ai-key.json
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

### 4. Vertex AI 서비스 어카운트 키 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. Vertex AI API 활성화
3. 서비스 어카운트 생성 및 키 다운로드
4. 다운로드한 JSON 키를 `vertex-ai-key.json`으로 프로젝트 루트에 저장

**주의**: `vertex-ai-key.json`은 절대 Git에 커밋하지 마세요! (`.gitignore`에 포함되어 있음)

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📁 프로젝트 구조

```
autofit/
├── app/
│   ├── api/coordinate/      # API 엔드포인트
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 메인 페이지
│   └── globals.css          # 전역 스타일
├── components/
│   ├── ui/                  # 기본 UI 컴포넌트
│   ├── forms/               # 5단계 폼 컴포넌트
│   └── result/              # 결과 대시보드
├── hooks/                   # 커스텀 훅
├── lib/                     # 유틸리티 & API 클라이언트
├── types/                   # TypeScript 타입 정의
└── public/                  # 정적 파일
```

## 🔧 주요 파일 설명

### `lib/vertex-ai.ts`
- Vertex AI SDK 초기화 및 이미지 생성 함수
- Gemini 모델과 통신하여 코디 분석 수행

### `app/api/coordinate/route.ts`
- FormData 파싱 및 유효성 검사
- Vertex AI 호출 및 결과 반환

### `hooks/useCoordinateForm.ts`
- 5단계 폼 상태 관리
- API 제출 로직

### `types/coordinate.ts`
- 전체 서비스에서 사용하는 타입 정의

## 📝 사용 방법

1. **사진 업로드**: 전신 사진을 업로드 (JPEG, PNG, WEBP, 최대 10MB)
2. **신체 정보**: 신장, 체중, 체형, 피부톤 입력
3. **스타일 선택**: 선호하는 스타일 최대 3개 선택
4. **TPO 설정**: 시간대, 장소, 상황 선택
5. **고민 사항**: 커버하고 싶은 신체적 특징 선택 (선택사항)
6. **결과 확인**: AI 분석 결과 및 스타일링 팁 확인

## 🧪 테스트

### API 헬스체크

```bash
curl http://localhost:3000/api/coordinate
```

예상 응답:
```json
{
  "status": "ok",
  "message": "Coordinate API is running"
}
```

### 주요 테스트 항목

- [ ] 이미지 업로드 및 미리보기
- [ ] 5단계 폼 네비게이션
- [ ] API 호출 및 로딩 상태
- [ ] 결과 대시보드 렌더링
- [ ] 이미지 저장/공유 기능
- [ ] 에러 핸들링

## 🔒 보안 고려사항

- 서비스 어카운트 키는 절대 공개 저장소에 업로드하지 마세요
- 프로덕션 환경에서는 환경 변수를 안전하게 관리하세요
- 파일 업로드 크기 제한 (10MB)
- 허용된 파일 타입만 업로드 가능 (JPEG, PNG, WEBP)

## 🐛 문제 해결

### Vertex AI 인증 오류
```
Error: Could not load the default credentials
```

**해결 방법**:
1. `vertex-ai-key.json` 파일이 프로젝트 루트에 있는지 확인
2. `.env.local`의 `GOOGLE_APPLICATION_CREDENTIALS` 경로 확인
3. 서비스 어카운트에 Vertex AI 권한이 있는지 확인

### 이미지 업로드 실패
```
Error: File too large
```

**해결 방법**:
- 이미지를 10MB 이하로 압축
- 지원되는 형식(JPEG, PNG, WEBP) 사용

## 📄 라이선스

MIT License

## 👥 기여

이슈 및 풀 리퀘스트를 환영합니다!

## 📞 문의

프로젝트 관련 문의사항은 이슈를 통해 남겨주세요.
