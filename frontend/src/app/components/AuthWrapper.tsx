// frontend/src/app/components/AuthWrapper.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const isLoginPage = pathname === '/login';

    if (!isAuthenticated && !isLoginPage) {
      router.push('/login');
    }
    if (isAuthenticated && isLoginPage) {
      router.push('/admin');
    }
  }, [isAuthenticated, pathname, router, isClient]);

 // [수정] /admin 경로도 전체 화면을 사용하도록 조건 추가
  const isFullbleedPage = pathname.startsWith('/dashboard') || pathname === '/admin';


  if (!isClient) {
    return null;
  }

   if (isAuthenticated) {
    if (pathname === '/login') return null;

    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1c2833' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header />
          {/* --- [핵심 수정] --- */}
          {/* main 태그에 직접 padding을 적용하여 모든 페이지의 기본 여백을 통일합니다. */}
          <main style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.5rem', // 모든 페이지에 일관된 여백 적용
          }}>
            {children}
          </main>
        </div>
      </div>
    );
  }

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return null;
}