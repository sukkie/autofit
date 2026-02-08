# Vercel 배포 가이드

## 준비사항

### 1. Google Cloud 인증 정보

Google Cloud Console에서 서비스 계정 키(JSON)를 다운로드하세요:

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. "IAM 및 관리자" > "서비스 계정" 이동
3. 서비스 계정 선택 또는 생성
4. "키 추가" > "새 키 만들기" > "JSON" 선택
5. 다운로드된 JSON 파일 내용 복사

필요한 권한:
- Vertex AI User
- Vertex AI Service Agent

### 2. 환경 변수 준비

다음 정보를 준비하세요:
- `GOOGLE_CLOUD_PROJECT`: Google Cloud 프로젝트 ID
- `GOOGLE_CLOUD_LOCATION`: 리전 (예: asia-northeast3)
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`: 서비스 계정 JSON 키 전체 내용

## Vercel CLI로 배포

### 1단계: Vercel CLI 설치

```bash
npm install -g vercel
```

### 2단계: 로그인

```bash
vercel login
```

### 3단계: 배포

프로젝트 루트에서 실행:

```bash
vercel
```

첫 배포 시 프로젝트 설정 질문에 답변:
- Set up and deploy? → Y
- Which scope? → 본인 계정 선택
- Link to existing project? → N
- Project name? → 원하는 이름 (예: autofit)
- In which directory is your code located? → ./
- Override settings? → N

### 4단계: 환경 변수 설정

Vercel 대시보드에서:

1. 배포된 프로젝트 선택
2. Settings > Environment Variables 이동
3. 다음 환경 변수 추가:

| 변수명 | 값 | 환경 |
|--------|-----|------|
| `GOOGLE_CLOUD_PROJECT` | 프로젝트 ID | Production, Preview, Development |
| `GOOGLE_CLOUD_LOCATION` | asia-northeast3 | Production, Preview, Development |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | JSON 키 전체 내용 | Production, Preview, Development |

**중요**: `GOOGLE_APPLICATION_CREDENTIALS_JSON`는 서비스 계정 JSON 파일의 전체 내용을 그대로 붙여넣으세요.

### 5단계: 재배포

환경 변수 설정 후 재배포:

```bash
vercel --prod
```

## Vercel 웹 대시보드로 배포 (권장)

### 1단계: GitHub 연동

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. "Add New" > "Project" 클릭
3. GitHub 저장소 가져오기 (https://github.com/sukkie/autofit)

### 2단계: 프로젝트 설정

- Framework Preset: **Next.js** (자동 감지됨)
- Root Directory: `./`
- Build Command: `next build` (기본값)
- Output Directory: `.next` (기본값)

### 3단계: 환경 변수 추가

배포 전 Environment Variables 섹션에서:

1. `GOOGLE_CLOUD_PROJECT` 추가
2. `GOOGLE_CLOUD_LOCATION` 추가
3. `GOOGLE_APPLICATION_CREDENTIALS_JSON` 추가 (JSON 전체)

### 4단계: Deploy 클릭

몇 분 후 배포 완료!

## 배포 확인

배포 완료 후:

1. Vercel이 제공하는 URL 접속 (예: https://autofit.vercel.app)
2. 각 단계 테스트:
   - 신체 정보 입력
   - TPO 선택
   - 스타일 선택
   - 고민 사항 선택
   - AI 분석 결과 확인

## 문제 해결

### Vertex AI 오류

환경 변수가 올바르게 설정되었는지 확인:
- Vercel 대시보드 > Settings > Environment Variables
- Production, Preview, Development 모두 체크되어 있는지 확인

### 빌드 오류

로그 확인:
- Vercel 대시보드 > Deployments > 최근 배포 선택 > View Build Logs

### API 타임아웃

Vertex AI 응답이 느릴 경우:
- Vercel Pro 플랜은 Serverless Function 타임아웃이 60초
- 무료 플랜은 10초 제한

## 커스텀 도메인 설정 (선택사항)

1. Vercel 대시보드 > 프로젝트 선택
2. Settings > Domains
3. "Add" 버튼으로 도메인 추가
4. DNS 설정 안내에 따라 CNAME 레코드 추가

## 지속적 배포 (CD)

GitHub 저장소에 푸시할 때마다 자동 배포:

```bash
git add .
git commit -m "Update features"
git push origin main
```

Vercel이 자동으로 감지하고 배포합니다.

## 비용

- **Hobby 플랜** (무료):
  - 100GB 대역폭/월
  - 무제한 배포
  - Serverless Function 10초 타임아웃

- **Pro 플랜** ($20/월):
  - 1TB 대역폭/월
  - Serverless Function 60초 타임아웃
  - 우선 지원

AI 분석 시간이 길면 Pro 플랜 권장합니다.

## 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vertex AI 문서](https://cloud.google.com/vertex-ai/docs)
