# 로컬 웹 서버 실행 방법

JSON 파일의 변경사항이 웹 페이지에 반영되도록 하려면 로컬 웹 서버를 실행해야 합니다.

## 방법 1: Python 사용 (추천)

Python이 설치되어 있다면:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

그리고 브라우저에서 `http://localhost:8000/webview_two.html` 열기

## 방법 2: Node.js 사용

Node.js가 설치되어 있다면:

```bash
# http-server 설치
npm install -g http-server

# 서버 실행
http-server -p 8000 -c-1
```

`-c-1` 옵션은 캐시를 비활성화합니다.

## 방법 3: Visual Studio Code 사용

VS Code의 "Live Server" 확장 프로그램 설치 후:
1. webview_two.html 파일 열기
2. 우클릭 → "Open with Live Server"

## 방법 4: Chrome 브라우저 플래그 사용 (보안 위험)

**주의: 보안상 권장하지 않습니다**

Windows:
```bash
chrome.exe --allow-file-access-from-files
```

Mac:
```bash
open -a "Google Chrome" --args --allow-file-access-from-files
```

## 사용법

1. 위 방법 중 하나로 로컬 서버 실행
2. `sample-data2.json` 파일 수정
3. 브라우저에서 F5 또는 새로고침 버튼 클릭
4. 변경사항이 즉시 반영됨