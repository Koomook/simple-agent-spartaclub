import { Toaster } from 'sonner';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Link from 'next/link';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: '스파르타 강의 검색',
  description:
    'AI 기반 강의 추천 시스템으로 스파르타코딩클럽의 다양한 강의를 찾아보세요',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <div className="fixed right-0 left-0 w-full top-0 bg-white dark:bg-sparta-dark">
          <div className="flex justify-between items-center p-4">
            <Link className="flex flex-row items-center gap-3" href="/">
              <div className="text-lg font-bold text-sparta-red">
                스파르타 강의 검색
              </div>
            </Link>
          </div>
        </div>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
