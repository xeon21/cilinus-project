@echo off
chcp 65001 > nul
echo.
echo ============================================
echo   사이니지 디스플레이 로컬 서버 시작
echo ============================================
echo.

cd /d "%~dp0"
echo 현재 폴더: %cd%
echo.

echo Python 설치 확인 중...
where python >nul 2>&1
if %errorlevel% == 0 (
    echo Python을 찾았습니다!
    echo.
    echo 서버를 시작합니다... (포트: 8000)
    echo.
    echo 브라우저에서 다음 주소로 접속하세요:
    echo   http://localhost:8000/webview_two.html
    echo.
    echo 종료하려면 Ctrl+C를 누르세요.
    echo ============================================
    python -m http.server 8000
    goto end
)

where python3 >nul 2>&1
if %errorlevel% == 0 (
    echo Python3를 찾았습니다!
    echo.
    echo 서버를 시작합니다... (포트: 8000)
    echo.
    echo 브라우저에서 다음 주소로 접속하세요:
    echo   http://localhost:8000/webview_two.html
    echo.
    echo 종료하려면 Ctrl+C를 누르세요.
    echo ============================================
    python3 -m http.server 8000
    goto end
)

where py >nul 2>&1
if %errorlevel% == 0 (
    echo Python Launcher를 찾았습니다!
    echo.
    echo 서버를 시작합니다... (포트: 8000)
    echo.
    echo 브라우저에서 다음 주소로 접속하세요:
    echo   http://localhost:8000/webview_two.html
    echo.
    echo 종료하려면 Ctrl+C를 누르세요.
    echo ============================================
    py -m http.server 8000
    goto end
)

echo.
echo ❌ Python이 설치되어 있지 않습니다!
echo.
echo 다음 방법을 시도해보세요:
echo.
echo 1. Python 설치하기:
echo    https://www.python.org/downloads/
echo    (설치 시 "Add Python to PATH" 체크 필수!)
echo.
echo 2. 수동으로 서버 실행하기:
echo    - 명령 프롬프트에서 다음 명령 입력:
echo      python -m http.server 8000
echo.
echo 3. VSCode Live Server 사용하기:
echo    - VSCode에서 webview_two.html 열기
echo    - 우클릭 → "Open with Live Server"
echo.
pause

:end