# 사이니지 디스플레이 웹뷰 사용 가이드

## 🎯 용도
1920x158 해상도의 안드로이드 사이니지 디스플레이 기기에서 JSON 데이터를 표시하는 웹뷰 애플리케이션

## 🚀 빠른 시작

### Windows에서 실행
1. **start-server.bat** 더블클릭
2. 브라우저에서 http://localhost:8000/webview_two.html 열기
3. data.json 파일 수정
4. 브라우저 새로고침 (F5) → 변경사항 즉시 반영

### Mac/Linux에서 실행
```bash
chmod +x start-server.sh
./start-server.sh
```

## 📁 파일 구조
- `webview_two.html` - 메인 디스플레이 파일
- `data.json` - 표시할 데이터 (기본 파일)
- `start-server.bat` - Windows용 서버 실행 파일
- `start-server.sh` - Mac/Linux용 서버 실행 파일

## 🔄 JSON 변경사항 반영 방법

### 방법 1: 로컬 서버 사용 (권장) ✅
1. start-server.bat 실행
2. http://localhost:8000/webview_two.html 접속
3. JSON 파일 수정 시 자동으로 감지하여 화면 갱신

### 방법 2: 파일 직접 열기 (제한적)
1. webview_two.html을 브라우저에서 직접 열기
2. "JSON 파일 선택" 버튼으로 data.json 선택
3. **주의**: 파일 수정 후 다시 선택해야 함

## 🤖 안드로이드 사이니지에서 사용
- 자동으로 프로덕션 모드로 전환
- 5초마다 JSON 파일 변경 확인
- 백엔드 서버가 JSON 파일 업데이트 시 자동 반영
- 오프라인 환경에서도 정상 작동

## ⚙️ 설정 변경
webview_two.html 내부의 CONFIG 객체 수정:
```javascript
const CONFIG = {
    JSON_FILE_PATH: './data.json',  // JSON 파일 경로
    CHECK_INTERVAL: 5000,           // 확인 주기 (ms)
    DEBUG_MODE: false,              // 디버그 모드
};
```

## 📊 JSON 데이터 형식
```json
{
  "items": [
    {
      "type": "image",
      "src": "./image.png",
      "x": 0, "y": 0,
      "width": 200, "height": 100,
      "zIndex": 1
    },
    {
      "type": "text",
      "content": "텍스트 내용",
      "x": 300, "y": 50,
      "fontSize": 24,
      "color": "#ffffff",
      "zIndex": 2
    },
    {
      "type": "barcode",
      "data": "1234567890",
      "x": 600, "y": 30,
      "width": 180, "height": 100,
      "zIndex": 3
    }
  ]
}
```

## 🐛 문제 해결

### "CORS 정책" 오류
→ start-server.bat 실행하여 로컬 서버 사용

### JSON 변경이 반영되지 않음
→ 브라우저 캐시 강제 새로고침 (Ctrl+F5)

### Python이 없다는 오류
→ Python 설치 또는 Node.js의 http-server 사용

## 💡 팁
- 개발 시에는 "자동 새로고침" 체크박스 활용
- JSON 파일을 브라우저에 드래그 앤 드롭 가능
- 디버그 정보는 브라우저 콘솔(F12)에서 확인