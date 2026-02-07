# 배포 가이드

## 🚨 중요: Cloudflare Pages 호환성 문제

현재 이 프로젝트는 **Cloudflare Pages와 호환되지 않습니다**:

- ❌ `@google-cloud/vertexai` - Node.js 런타임 필요
- ❌ `sharp` - 네이티브 바이너리, Workers에서 작동 안 함
- ❌ Google Cloud 인증 키 파일 처리 제한

## ✅ 권장: Vercel 배포

Vercel은 Next.js, Vertex AI, sharp를 모두 완벽히 지원합니다.

### 1. 환경 변수 준비

`.env.local` 파일 생성:

```bash
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=asia-northeast3
GOOGLE_CLOUD_IMAGE_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
```

`GOOGLE_APPLICATION_CREDENTIALS_JSON`에는 `vertex-ai-key.json` 파일의 전체 내용을 한 줄로 복사해서 붙여넣으세요.

### 2. Vercel에 배포

```bash
# Vercel CLI 설치 (없으면)
npm i -g vercel

# 배포
vercel
```

또는 GitHub 연동:
1. https://vercel.com 에서 프로젝트 import
2. 환경 변수 설정
3. Deploy

### 3. Vercel 환경 변수 설정

Vercel Dashboard > Settings > Environment Variables에서:

- `GOOGLE_CLOUD_PROJECT` = `프로젝트-ID`
- `GOOGLE_CLOUD_LOCATION` = `asia-northeast3`
- `GOOGLE_CLOUD_IMAGE_LOCATION` = `us-central1`
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` = `{vertex-ai-key.json의 내용}`

**주의**: JSON 키를 복사할 때 줄바꿈 없이 한 줄로 만들어야 합니다.

```bash
# JSON을 한 줄로 변환하는 방법 (macOS/Linux)
cat vertex-ai-key.json | jq -c .
```

### 4. 리전 설정

`vercel.json`에서 서울 리전 사용:
```json
{
  "regions": ["icn1"]
}
```

## 대안: Railway / Render

Vercel 외에도 다음 플랫폼에서 배포 가능:
- Railway (https://railway.app)
- Render (https://render.com)
- Google Cloud Run

## Cloudflare로 배포하려면?

전체 아키텍처를 변경해야 합니다:
1. Vertex AI → Cloudflare Workers AI
2. sharp → 브라우저 기반 이미지 처리
3. 전체 코드 재작성 필요

**권장하지 않음** - Vercel 사용을 권장합니다.

## 로컬 개발

```bash
# .env.local 파일 생성 후
npm run dev
```

로컬에서는 `vertex-ai-key.json` 파일을 사용하거나 환경 변수를 사용할 수 있습니다.
