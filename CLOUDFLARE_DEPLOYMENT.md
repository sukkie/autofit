# Cloudflare Pages 배포 가이드

## 주요 변경사항

이 프로젝트는 **Cloudflare Pages와 호환되도록** Vertex AI SDK 대신 REST API를 사용합니다.

### 변경된 내용
- ❌ `@google-cloud/vertexai` SDK 제거
- ✅ Vertex AI REST API 직접 호출
- ✅ Web Crypto API 사용 (JWT 서명)
- ✅ 100% Cloudflare Workers 호환

## 1. 사전 준비

### Google Cloud 설정

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 생성 또는 선택
3. Vertex AI API 활성화
4. 서비스 계정 생성:
   - IAM 및 관리자 > 서비스 계정
   - "서비스 계정 만들기"
   - 역할: **Vertex AI User**
5. 키 생성:
   - 서비스 계정 선택 > "키" 탭
   - "키 추가" > "새 키 만들기" > JSON
   - 다운로드된 JSON 파일 내용 복사

## 2. Cloudflare Pages 배포

### 방법 1: Cloudflare Dashboard (권장)

#### 1단계: GitHub 연동

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 로그인
2. "Workers & Pages" 선택
3. "Create Application" > "Pages" > "Connect to Git"
4. GitHub 저장소 선택: `sukkie/autofit`

#### 2단계: 빌드 설정

```
Framework preset: Next.js
Build command: npx @cloudflare/next-on-pages
Build output directory: .vercel/output/static
```

#### 3단계: 환경 변수 설정

"Environment variables" 섹션에서 다음 변수 추가:

| 변수명 | 값 | 환경 |
|--------|-----|------|
| `GOOGLE_CLOUD_PROJECT` | 프로젝트 ID | Production, Preview |
| `GOOGLE_CLOUD_LOCATION` | asia-northeast3 | Production, Preview |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | 서비스 계정 JSON 전체 | Production, Preview |

**중요**: `GOOGLE_APPLICATION_CREDENTIALS_JSON`는 다운로드한 JSON 파일의 **전체 내용**을 복사-붙여넣기 하세요.

예시:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-sa@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/..."
}
```

#### 4단계: 배포

"Save and Deploy" 클릭! 🚀

### 방법 2: Wrangler CLI

```bash
# 1. Wrangler 설치
npm install -g wrangler

# 2. Cloudflare 로그인
wrangler login

# 3. 프로젝트 빌드
npm install
npm run build

# 4. 배포
wrangler pages deploy .vercel/output/static --project-name=autofit
```

## 3. 배포 후 환경 변수 설정

CLI로 배포한 경우 환경 변수를 추가해야 합니다:

```bash
# Production 환경 변수 설정
wrangler pages secret put GOOGLE_CLOUD_PROJECT
# 프롬프트에서 값 입력: your-project-id

wrangler pages secret put GOOGLE_CLOUD_LOCATION
# 프롬프트에서 값 입력: asia-northeast3

wrangler pages secret put GOOGLE_APPLICATION_CREDENTIALS_JSON
# 프롬프트에서 JSON 전체 내용 붙여넣기
```

## 4. 배포 확인

배포 완료 후:

1. Cloudflare가 제공하는 URL 접속 (예: `https://autofit.pages.dev`)
2. 각 단계 테스트:
   - 신체 정보 입력
   - TPO 선택
   - 스타일 선택
   - 고민 사항 선택
   - **AI 분석 결과 확인** ⭐

## 5. 커스텀 도메인 설정 (선택사항)

1. Cloudflare Dashboard > Pages > autofit
2. "Custom domains" 탭
3. "Set up a custom domain" 클릭
4. 도메인 입력 (예: autofit.example.com)
5. DNS 레코드 자동 추가 (Cloudflare DNS 사용 시)

## 6. 지속적 배포 (CI/CD)

GitHub에 푸시할 때마다 자동 배포:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Cloudflare Pages가 자동으로 감지하고 빌드/배포합니다!

## 7. 로컬 개발

Cloudflare 환경에서 로컬 테스트:

```bash
# 개발 서버 실행
npm run dev

# 또는 Wrangler를 사용한 로컬 테스트
npx wrangler pages dev .vercel/output/static
```

## 문제 해결

### 빌드 오류

```
Error: Module not found
```

**해결**: Next.js 13+ 버전 사용 확인
```bash
npm install next@latest
```

### API 오류: 403 Forbidden

```
Vertex AI API 오류: 403
```

**해결**:
1. 서비스 계정에 **Vertex AI User** 역할이 있는지 확인
2. Vertex AI API가 활성화되어 있는지 확인
3. 환경 변수 `GOOGLE_APPLICATION_CREDENTIALS_JSON`이 올바른지 확인

### JWT 서명 오류

```
Error: 액세스 토큰 가져오기 실패
```

**해결**:
- `private_key`에 `\n` (줄바꿈)이 포함되어 있는지 확인
- JSON 포맷이 올바른지 확인 (JSONLint로 검증)

### 타임아웃 오류

Cloudflare Pages Functions는 **무료 플랜에서 10초 제한**이 있습니다.

**해결**:
- Paid 플랜 사용 (30초 타임아웃)
- 또는 Gemini 2.0 Flash 모델 사용 (현재 설정됨 - 빠른 응답)

## 비용

### Cloudflare Pages
- **Free 플랜**:
  - 500 빌드/월
  - 무제한 요청
  - 100,000 Function 호출/일

- **Pages Functions**: 무료
  - 10초 타임아웃 (Free)
  - 30초 타임아웃 (Paid: $5/월)

### Google Cloud Vertex AI
- **Gemini 2.0 Flash**:
  - 입력: $0.075 / 1M 토큰
  - 출력: $0.30 / 1M 토큰
  - 매우 저렴! (월 100회 사용 시 ~$0.01)

## 장점

✅ **완전 무료** 시작 (Cloudflare Free + Vertex AI)
✅ **글로벌 CDN** (300+ 도시)
✅ **자동 HTTPS**
✅ **무제한 대역폭**
✅ **빠른 배포** (~1분)
✅ **자동 미리보기** (PR마다)

## 참고 자료

- [Cloudflare Pages 문서](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Vertex AI REST API](https://cloud.google.com/vertex-ai/docs/reference/rest)
