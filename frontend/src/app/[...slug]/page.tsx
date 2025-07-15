// frontend/src/app/[...slug]/page.tsx
'use client';

import { use } from 'react';

export default function DynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = use(params);
  return (
    // 페이지 제목(h1)은 layout.tsx에서 관리하므로 여기서 제거합니다.
    <div className="text-gray-700">
      <p>
        동적 페이지 콘텐츠가 여기에 표시됩니다.
      </p>
      <p className="mt-4 text-sm text-gray-500">
        요청된 경로: / {resolvedParams.slug.join(' / ')}
      </p>
    </div>
  );
}