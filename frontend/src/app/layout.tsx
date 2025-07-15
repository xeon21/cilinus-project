// frontend/src/app/layout.tsx
import type { Metadata } from 'next';
import StyledComponentsRegistry from '@/lib/registry';
import AuthWrapper from './components/AuthWrapper'; // AuthWrapper import
import './globals.css';

export const metadata: Metadata = {
  title: "My CMS",
  description: "CMS built with NestJS and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <StyledComponentsRegistry>
          {/* 이제 AuthWrapper가 로그인 상태에 따라 
              레이아웃을 보여주거나, 로그인 페이지만 보여주는 모든 것을 결정합니다. */}
          <AuthWrapper>{children}</AuthWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}