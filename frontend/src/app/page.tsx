// frontend/src/app/page.tsx
export default function DashboardPage() {
  return (
    // 페이지 제목(h1)은 layout.tsx에서 관리하므로 여기서 제거합니다.
    <div className="text-gray-700">
      <p>CMS에 오신 것을 환영합니다! 사이드바에서 메뉴를 선택해주세요.</p>
      <p className="mt-4">이곳에 대시보드 관련 컴포넌트나 데이터를 표시할 수 있습니다.</p>
    </div>
  );
}