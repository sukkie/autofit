#!/bin/bash

# 로컬 개발 환경 설정 스크립트
# vertex-ai-key.json을 .env.local에 자동 설정

echo "🔧 로컬 환경 변수 설정 중..."

# vertex-ai-key.json 파일 확인
if [ ! -f "vertex-ai-key.json" ]; then
    echo "❌ vertex-ai-key.json 파일이 없습니다."
    echo "Google Cloud Console에서 서비스 어카운트 키를 다운로드하고"
    echo "프로젝트 루트에 'vertex-ai-key.json' 이름으로 저장하세요."
    exit 1
fi

# JSON 파일 읽기
CREDENTIALS_JSON=$(cat vertex-ai-key.json | tr -d '\n')

# .env.local 파일 생성
cat > .env.local << ENVEOF
# Google Cloud 프로젝트 설정 (자동 생성됨)
GOOGLE_CLOUD_PROJECT=$(echo $CREDENTIALS_JSON | grep -o '"project_id":"[^"]*"' | cut -d'"' -f4)
GOOGLE_CLOUD_LOCATION=asia-northeast3

# 서비스 어카운트 인증 정보
GOOGLE_APPLICATION_CREDENTIALS_JSON=${CREDENTIALS_JSON}
ENVEOF

echo "✅ .env.local 파일이 생성되었습니다!"
echo ""
echo "이제 다음 명령어로 개발 서버를 실행하세요:"
echo "  npm run dev"
