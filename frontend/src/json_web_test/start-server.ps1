# PowerShell 실행 정책 확인
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  사이니지 디스플레이 로컬 서버 시작" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 현재 디렉토리로 이동
Set-Location -Path $PSScriptRoot
Write-Host "현재 폴더: $PWD" -ForegroundColor Yellow
Write-Host ""

# Python 찾기
$pythonCmd = $null

if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    $pythonCmd = "python3"
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $pythonCmd = "py"
}

if ($pythonCmd) {
    Write-Host "✓ Python을 찾았습니다: $pythonCmd" -ForegroundColor Green
    Write-Host ""
    Write-Host "서버를 시작합니다... (포트: 8000)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "브라우저에서 다음 주소로 접속하세요:" -ForegroundColor Cyan
    Write-Host "  http://localhost:8000/webview_two.html" -ForegroundColor White
    Write-Host ""
    Write-Host "종료하려면 Ctrl+C를 누르세요." -ForegroundColor Yellow
    Write-Host "============================================" -ForegroundColor Cyan
    
    # 서버 실행
    & $pythonCmd -m http.server 8000
} else {
    Write-Host "❌ Python이 설치되어 있지 않습니다!" -ForegroundColor Red
    Write-Host ""
    Write-Host "다음 방법을 시도해보세요:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Python 설치하기:" -ForegroundColor Cyan
    Write-Host "   https://www.python.org/downloads/" -ForegroundColor White
    Write-Host "   (설치 시 'Add Python to PATH' 체크 필수!)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Microsoft Store에서 Python 설치:" -ForegroundColor Cyan
    Write-Host "   Windows 10/11의 경우 Microsoft Store에서" -ForegroundColor White
    Write-Host "   'Python 3.x' 검색하여 설치" -ForegroundColor White
    Write-Host ""
    Read-Host "계속하려면 Enter 키를 누르세요"
}