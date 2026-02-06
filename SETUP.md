# 오토핏(AutoFit) 설정 가이드

이 문서는 오토핏 프로젝트를 로컬 환경에서 실행하기 위한 상세한 설정 가이드입니다.

## 📋 목차

1. [사전 요구사항](#사전-요구사항)
2. [Google Cloud 설정](#google-cloud-설정)
3. [프로젝트 설정](#프로젝트-설정)
4. [실행 및 테스트](#실행-및-테스트)
5. [문제 해결](#문제-해결)

---

## 사전 요구사항

### 필수 소프트웨어
- **Node.js**: v18.17 이상 (권장: v20.x)
- **npm**: v9.0 이상
- **Git**: 최신 버전

### 확인 방법
```bash
node --version    # v18.17.0 이상
npm --version     # v9.0.0 이상
git --version     # 2.0 이상
```

---

## Google Cloud 설정

### 1. Google Cloud 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 ID 기록 (예: `my-autofit-project`)

### 2. Vertex AI API 활성화

```bash
# gcloud CLI가 설치되어 있다면
gcloud services enable aiplatform.googleapis.com --project=YOUR_PROJECT_ID

# 또는 Cloud Console에서
# API 및 서비스 > 라이브러리 > "Vertex AI API" 검색 > 활성화
```

### 3. 서비스 어카운트 생성

1. **IAM 및 관리자 > 서비스 계정**으로 이동
2. **서비스 계정 만들기** 클릭
3. 이름 입력 (예: `autofit-service`)
4. 다음 권한 부여:
   - `Vertex AI User` (roles/aiplatform.user)
   - 또는 `Editor` (roles/editor)

### 4. 서비스 어카운트 키 생성

1. 생성한 서비스 계정 클릭
2. **키** 탭 선택
3. **키 추가 > 새 키 만들기**
4. **JSON** 형식 선택
5. 다운로드된 JSON 파일을 프로젝트 루트에 `vertex-ai-key.json`으로 저장

**⚠️ 중요**: 이 키 파일은 절대 Git에 커밋하지 마세요!

---

## 프로젝트 설정

### 1. 프로젝트 클론 (이미 완료됨)

```bash
cd /Users/oykwon/개발/vsc/style-guide
```

### 2. 의존성 설치 (이미 완료됨)

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local.example`을 `.env.local`로 복사:

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열어서 실제 값으로 수정:

```env
# Google Cloud 프로젝트 ID (필수)
GOOGLE_CLOUD_PROJECT=your-actual-project-id

# Vertex AI 리전 (기본값: asia-northeast3, 서울 리전 사용 권장)
GOOGLE_CLOUD_LOCATION=asia-northeast3

# 서비스 어카운트 키 경로
GOOGLE_APPLICATION_CREDENTIALS=./vertex-ai-key.json

# 파일 업로드 최대 크기 (10MB)
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

**설정 예시**:
```env
GOOGLE_CLOUD_PROJECT=my-autofit-project-123456
GOOGLE_CLOUD_LOCATION=asia-northeast3
GOOGLE_APPLICATION_CREDENTIALS=./vertex-ai-key.json
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

### 4. 파일 구조 확인

프로젝트 루트에 다음 파일들이 있는지 확인:
- ✅ `vertex-ai-key.json` (다운로드한 서비스 어카운트 키)
- ✅ `.env.local` (환경 변수 파일)
- ✅ `.gitignore` (vertex-ai-key.json이 포함되어 있는지 확인)

---

## 실행 및 테스트

### 1. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 2. 기능 테스트 체크리스트

#### 📸 사진 업로드
- [ ] 드래그 앤 드롭으로 이미지 업로드
- [ ] 파일 선택 버튼으로 이미지 업로드
- [ ] 미리보기 정상 표시
- [ ] 잘못된 파일 형식 시 에러 메시지
- [ ] 10MB 초과 시 에러 메시지

#### 📝 폼 작성
- [ ] 신체 정보 입력 (신장, 체중, 체형, 피부톤)
- [ ] 스타일 옵션 선택 (최대 3개)
- [ ] TPO 선택 (시간, 장소, 상황)
- [ ] 신체 고민 선택 (선택사항)
- [ ] 이전/다음 버튼 정상 작동

#### 🤖 AI 분석
- [ ] "AI 코디 분석 시작" 버튼 클릭
- [ ] 로딩 화면 표시
- [ ] 약 5-10초 후 결과 표시

#### 📊 결과 화면
- [ ] 코디 점수 표시 (0-100)
- [ ] 스타일링 팁 5개 표시
- [ ] 추천 액세서리 표시
- [ ] 컬러 팔레트 표시
- [ ] 종합 평가 코멘트 표시
- [ ] 이미지 저장 기능
- [ ] 공유 기능

### 3. API 헬스체크

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

### 4. 프로덕션 빌드 테스트

```bash
npm run build
npm start
```

---

## 문제 해결

### ❌ "Cannot find module 'autoprefixer'"

**증상**: 빌드 시 autoprefixer를 찾을 수 없다는 오류

**해결 방법**:
```bash
npm install autoprefixer --save-dev
```

---

### ❌ "Unable to infer your project"

**증상**: Vertex AI가 프로젝트를 찾을 수 없음

**해결 방법**:
1. `.env.local` 파일 확인
2. `GOOGLE_CLOUD_PROJECT` 값이 정확한지 확인
3. `vertex-ai-key.json` 파일이 프로젝트 루트에 있는지 확인
4. 개발 서버 재시작

---

### ❌ "Could not load the default credentials"

**증상**: 서비스 어카운트 인증 실패

**해결 방법**:
1. `vertex-ai-key.json` 파일 위치 확인
2. JSON 파일 내용이 유효한지 확인 (올바른 JSON 형식)
3. 환경 변수 재확인:
   ```bash
   cat .env.local
   ```
4. 서비스 어카운트에 필요한 권한이 있는지 확인

---

### ❌ "API not enabled"

**증상**: Vertex AI API가 활성화되지 않음

**해결 방법**:
```bash
gcloud services enable aiplatform.googleapis.com --project=YOUR_PROJECT_ID
```

또는 Cloud Console에서 수동으로 활성화

---

### ❌ 이미지 업로드 실패

**증상**: 이미지를 업로드해도 아무 반응이 없음

**해결 방법**:
1. 파일 형식 확인 (JPEG, PNG, WEBP만 지원)
2. 파일 크기 확인 (10MB 이하)
3. 브라우저 콘솔에서 에러 메시지 확인
4. 네트워크 탭에서 요청 상태 확인

---

### ❌ AI 응답이 느림

**증상**: AI 분석에 20초 이상 소요

**원인**:
- Gemini 1.5 Pro 모델은 이미지 분석 시 5-15초 정도 소요됩니다
- 네트워크 상태나 서버 부하에 따라 더 걸릴 수 있습니다

**해결 방법**:
- 정상적인 동작입니다
- 더 빠른 응답이 필요하다면 `lib/vertex-ai.ts`에서 모델을 `gemini-1.5-flash`로 변경 가능

---

### 💡 추가 도움말

**로그 확인**:
```bash
# 개발 서버 로그
# 터미널에서 실시간으로 확인 가능

# 브라우저 콘솔 로그
# F12 > Console 탭
```

**환경 변수 디버깅**:
```bash
# .env.local 내용 확인
cat .env.local

# 환경 변수가 로드되는지 확인
# app/api/coordinate/route.ts에 console.log 추가
console.log('PROJECT:', process.env.GOOGLE_CLOUD_PROJECT);
```

---

## 🚀 다음 단계

프로젝트가 정상적으로 실행되면:

1. **테스트 이미지 준비**: 전신 사진 준비 (JPEG/PNG)
2. **5단계 폼 작성**: 각 단계를 순차적으로 진행
3. **결과 확인**: AI 분석 결과 및 스타일링 팁 확인
4. **기능 탐색**: 이미지 저장, 공유 등의 기능 테스트

---

## 📞 추가 문의

문제가 해결되지 않으면 다음 정보와 함께 문의해주세요:
- Node.js 버전
- 에러 메시지 전문
- 브라우저 콘솔 로그
- 네트워크 요청/응답 내용

Happy Coding! 🎨👔
