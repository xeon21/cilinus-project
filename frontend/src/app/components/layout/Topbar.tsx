// frontend/src/app/components/layout/Topbar.tsx
'use client';

interface TopbarProps {
  activeTitle: string;
}

export default function Topbar({ activeTitle }: TopbarProps) {
  return (
    <header className="h-16 w-full bg-white border-b border-gray-200 flex items-center px-8 flex-shrink-0">
      <h1 className="text-xl font-semibold text-gray-800">{activeTitle}</h1>
    </header>
  );
}