import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI 바이브 코딩 마스터클래스',
  description: '코딩 없이 AI로 업무 도구를 만드는 법',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="bg-neutral-950">
      <body className="bg-neutral-950 text-white">{children}</body>
    </html>
  );
}
