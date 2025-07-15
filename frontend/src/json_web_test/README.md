# WebView JSON Display

안드로이드용 웹 뷰어 - JSON 데이터를 읽어 이미지, 텍스트, 바코드를 표시합니다.

## 사용 방법

1. `webview.html` 파일을 브라우저에서 엽니다
2. "JSON 파일 선택" 버튼을 클릭하여 JSON 파일을 업로드합니다
3. 또는 `sample-data.json` 파일을 선택하여 샘플 데이터를 확인할 수 있습니다

## JSON 파일 형식

```json
{
  "items": [
    {
      "type": "image",
      "zIndex": 1,
      "src": "data:image/png;base64,...",
      "x": 0,
      "y": 0,
      "width": 1920,
      "height": 158
    },
    {
      "type": "text",
      "zIndex": 2,
      "content": "텍스트 내용",
      "x": 100,
      "y": 50,
      "fontSize": 24,
      "color": "#ffffff"
    },
    {
      "type": "barcode",
      "zIndex": 10,
      "data": "1234567890",
      "width": 150,
      "height": 50
    }
  ]
}
```

## 기능

- 1920x158 고정 크기 뷰포트
- z-index 기반 레이어링
- Base64 인코딩된 이미지 지원
- 텍스트 렌더링 (위치, 크기, 색상 지정 가능)
- CODE128 형식 바코드 생성 (우측 10% 영역)
- 오프라인 환경 지원

## 오프라인 사용

인터넷 연결 없이 사용하려면:
1. JsBarcode 라이브러리를 로컬에 다운로드
2. HTML 파일의 script src를 로컬 경로로 변경

## 테스트

```bash
npm test -- src/json_web_test/webview.test.ts
```

모든 테스트가 통과되었습니다 ✓