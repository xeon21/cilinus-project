#!/bin/bash

echo "==========================================="
echo " 사이니지 디스플레이 로컬 서버 시작"
echo "==========================================="
echo ""

# Python이 설치되어 있는지 확인
if command -v python3 &> /dev/null; then
    echo "Python3가 감지되었습니다. 서버를 시작합니다..."
    echo ""
    echo "서버가 시작되면 브라우저에서 다음 주소로 접속하세요:"
    echo "http://localhost:8000/webview_two.html"
    echo ""
    echo "종료하려면 Ctrl+C를 누르세요."
    echo "==========================================="
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "Python이 감지되었습니다. 서버를 시작합니다..."
    echo ""
    echo "서버가 시작되면 브라우저에서 다음 주소로 접속하세요:"
    echo "http://localhost:8000/webview_two.html"
    echo ""
    echo "종료하려면 Ctrl+C를 누르세요."
    echo "==========================================="
    python -m http.server 8000
else
    echo "Python이 설치되어 있지 않습니다."
    echo "Python을 설치하거나 다른 방법을 사용하세요."
    echo ""
    echo "Node.js가 설치되어 있다면:"
    echo "npm install -g http-server"
    echo "http-server -p 8000"
    echo ""
fi