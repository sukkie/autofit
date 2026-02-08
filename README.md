# 오토핏 (AutoFit) - AI 가상 코디네이션

패션 초보자를 위한 AI 기반 가상 코디네이션 서비스입니다. 상세한 체형 정보 입력만으로 맞춤형 스타일링 조언을 받을 수 있습니다.

## 🎯 주요 기능

- **상세 체형 분석**: 어깨 너비, 체형 유형 등 7가지 신체 정보 입력
- **맞춤형 추천**: 신체 정보, 선호 스타일, TPO를 고려한 코디 제안
- **스타일링 가이드**: 구체적인 스타일링 팁 5가지 제공
- **액세서리 추천**: 스타일을 완성할 액세서리 제안
- **컬러 팔레트**: 피부톤에 맞는 추천 컬러
- **점수 평가**: 0-100점 스케일의 코디 점수

## 🛠 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Vertex AI (Gemini 2.5 Flash)
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

### 3. Vertex AI 서비스 어카운트 키 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. Vertex AI API 활성화
3. 서비스 어카운트 생성 및 키 다운로드
4. 다운로드한 JSON 키를 `vertex-ai-key.json`으로 프로젝트 루트에 저장

**주의**: `vertex-ai-key.json`은 절대 Git에 커밋하지 마세요! (`.gitignore`에 포함되어 있음)

### 4. 환경 변수 자동 설정 (권장)

```bash
# 자동 설정 스크립트 실행
./setup-local-env.sh
```

이 스크립트가 자동으로:
- `vertex-ai-key.json` 파일을 읽어서
- `.env.local` 파일을 생성하고
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` 환경 변수를 설정합니다

### 또는 수동 설정

`.env.local` 파일 생성:

```env
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=asia-northeast3
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"...전체내용..."}
```

**Tip**: JSON 파일 내용을 한 줄로 변환:
```bash
export GOOGLE_APPLICATION_CREDENTIALS_JSON=$(cat vertex-ai-key.json | tr -d '\n')
```

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
│   ├── page.tsx             # 메인 페이지 (4단계 폼)
│   └── globals.css          # 전역 스타일
├── components/
│   ├── ui/                  # 기본 UI 컴포넌트
│   ├── forms/               # 4단계 폼 컴포넌트
│   │   ├── BodyInfoStep.tsx    # 신체 정보 입력
│   │   ├── TPOSelectionStep.tsx # TPO 선택
│   │   ├── StyleOptionStep.tsx  # 스타일 선택
│   │   └── BodyConcernStep.tsx  # 고민 사항
│   ├── result/              # 결과 대시보드
│   └── LandingPage.tsx      # 랜딩 페이지
├── contexts/                # React Context (언어 설정)
├── hooks/                   # 커스텀 훅
├── lib/                     # 유틸리티 & Vertex AI 클라이언트
├── locales/                 # 다국어 지원 (ko, en, ja)
├── types/                   # TypeScript 타입 정의
└── public/                  # 정적 파일
```

## 🔧 주요 파일 설명

### `lib/vertex-ai.ts`
- Vertex AI SDK 초기화
- 텍스트 기반 프롬프트로 스타일 분석 수행
- Gemini 2.5 Flash 모델 사용

### `app/api/coordinate/route.ts`
- JSON 요청 파싱 및 유효성 검사 (Zod)
- 체형 정보 검증 (7가지 필드)
- Vertex AI 호출 및 결과 반환

### `hooks/useCoordinateForm.ts`
- 4단계 폼 상태 관리
- 단계 네비게이션 로직
- API 제출 및 로딩/에러 상태 처리

### `types/coordinate.ts`
- BodyInfo: 상세 체형 정보 타입
- TPO: 시간/장소/상황 타입
- StyleOption, BodyConcern 등 전체 타입 정의

## 📝 사용 방법

1. **신체 정보 입력** (Step 1)
   - 성별
   - 신장 (cm)
   - 체중 (kg)
   - 체격 (마른/보통/통통/근육질)
   - 피부톤 (쿨톤/웜톤/중성)
   - 어깨 너비 (좁음/보통/넓음)
   - 체형 비율 (성별에 따라 다름)
     - 남성: 역삼각형/직사각형/사다리꼴/원형
     - 여성: 모래시계/삼각형/역삼각형/직사각형/원형

2. **착용 상황 선택** (Step 2 - TPO)
   - 시간대: 언제 입을지
   - 장소: 어디서 입을지
   - 상황: 어떤 목적으로 입을지

3. **스타일 선택** (Step 3)
   - 선호하는 스타일 최대 3개 선택
   - 캐주얼, 비즈니스, 스트리트, 미니멀, 빈티지, 스포티

4. **고민 사항 선택** (Step 4)
   - 커버하고 싶은 신체적 특징 선택 (선택사항)
   - 키, 다리 길이, 어깨, 상/하체 비만 등

5. **결과 확인** (Step 5)
   - AI 분석 결과 및 스타일링 팁 확인
   - 추천 액세서리 및 컬러 팔레트 확인

## 🚀 배포

### Cloudflare Pages 배포 (권장 ⭐)

이 프로젝트는 **Cloudflare Pages와 완벽하게 호환**됩니다!

#### 방법 1: Dashboard 배포

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 접속
2. Workers & Pages → Create → Connect to Git
3. 빌드 설정:
   ```
   Build command: npx @cloudflare/next-on-pages
   Build output: .vercel/output/static
   ```
4. 환경 변수 설정:
   - `GOOGLE_CLOUD_PROJECT`
   - `GOOGLE_CLOUD_LOCATION`
   - `GOOGLE_APPLICATION_CREDENTIALS_JSON` (JSON 전체 내용)

#### 방법 2: CLI 배포

```bash
# Wrangler 로그인
npx wrangler login

# 빌드 & 배포
npm run pages:deploy
```

자세한 내용은 [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) 참조

### Vercel 배포 (대안)

Vercel도 지원됩니다:

```bash
npm i -g vercel
vercel
```

환경 변수 설정:
- `GOOGLE_CLOUD_PROJECT`
- `GOOGLE_CLOUD_LOCATION`
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`

자세한 내용은 [DEPLOYMENT.md](./DEPLOYMENT.md) 참조

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

- [ ] 4단계 폼 네비게이션 (신체정보 → TPO → 스타일 → 고민사항)
- [ ] 체형 정보 유효성 검사 (키 100-250cm, 체중 30-200kg)
- [ ] API 호출 및 로딩 상태
- [ ] 결과 대시보드 렌더링
- [ ] 스타일링 팁, 액세서리, 컬러 팔레트 표시
- [ ] 공유 기능
- [ ] 에러 핸들링
- [ ] 다국어 지원 (한국어/영어/일본어)

## 🔒 보안 고려사항

- 서비스 어카운트 키는 절대 공개 저장소에 업로드하지 마세요
- 프로덕션 환경에서는 환경 변수를 안전하게 관리하세요
- 입력 데이터 검증 (Zod 스키마)
- XSS 방지를 위한 입력 sanitization

## 🐛 문제 해결

### Vertex AI 인증 오류
```
Error: Could not load the default credentials
```

**해결 방법**:
1. `vertex-ai-key.json` 파일이 프로젝트 루트에 있는지 확인
2. `.env.local`의 `GOOGLE_APPLICATION_CREDENTIALS` 경로 확인
3. 서비스 어카운트에 Vertex AI 권한이 있는지 확인

### API 타임아웃
```
Error: Request timeout
```

**해결 방법**:
- Vercel Pro 플랜 사용 (Serverless Function 60초 타임아웃)
- Gemini Flash 모델 사용 중이므로 응답 속도는 빠른 편
- 네트워크 연결 상태 확인

## 📄 라이선스

MIT License

## 👥 기여

이슈 및 풀 리퀘스트를 환영합니다!

## 📞 문의

프로젝트 관련 문의사항은 이슈를 통해 남겨주세요.
