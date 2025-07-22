#!/bin/bash

# ESL Device 브로드캐스트 테스트 스크립트 (새로운 인증 시스템)

# 서버 URL 설정
SERVER_URL="http://localhost:3002"

# 색상 설정
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}ESL Device 브로드캐스트 테스트 시작...${NC}"

# 1. 로그인하여 JWT 토큰 획득 (새로운 인증 시스템)
echo -e "\n${GREEN}1. 로그인 중... (auth/login 사용)${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$SERVER_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "superadmin@cjfreshway.com", "password": "password123"}')

echo "로그인 응답: $LOGIN_RESPONSE"

# JWT 토큰 추출
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# access_token이 없으면 accessToken으로 다시 시도
if [ -z "$TOKEN" ]; then
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
  echo -e "${RED}로그인 실패! 응답을 확인하세요.${NC}"
  echo "받은 응답: $LOGIN_RESPONSE"
  echo ""
  echo "가능한 원인:"
  echo "1. 서버가 3002 포트에서 실행 중인지 확인"
  echo "2. update-password-hash.sql을 실행했는지 확인"
  echo "3. auth/login 엔드포인트가 올바른지 확인"
  exit 1
fi

echo -e "${GREEN}로그인 성공! 토큰 획득됨${NC}"
echo "토큰 (처음 20자): ${TOKEN:0:20}..."

# 2. 시스템 메시지 브로드캐스트
echo -e "\n${GREEN}2. 시스템 메시지 브로드캐스트...${NC}"
RESPONSE=$(curl -s -X POST "$SERVER_URL/api/esl-device/broadcast/system-message" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "System Reboot Ten minitues later",
    "level": "warning"
  }')
echo "응답: $RESPONSE"

sleep 2

# 3. 매장별 브로드캐스트
echo -e "\n${GREEN}3. 매장 A 디바이스에 브로드캐스트...${NC}"
RESPONSE=$(curl -s -X POST "$SERVER_URL/api/esl-device/broadcast/store/store-A" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "price-update",
    "data": {
      "message": "가격 정보가 업데이트되었습니다.",
      "updateTime": "'$(date -Iseconds)'"
    }
  }')
echo "응답: $RESPONSE"

sleep 2

# 4. 긴급 알림
echo -e "\n${GREEN}4. 긴급 알림 브로드캐스트...${NC}"
RESPONSE=$(curl -s -X POST "$SERVER_URL/api/esl-device/broadcast/emergency" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "emergency",
    "message": "emergency!!. check all device",
    "severity": "critical"
  }')
echo "응답: $RESPONSE"

echo -e "\n${YELLOW}브로드캐스트 테스트 완료!${NC}"
echo -e "${GREEN}WebSocket 클라이언트에서 메시지를 확인하세요.${NC}"