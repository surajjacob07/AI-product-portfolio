import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'AAGP — Agentic AI Gift Platform',
  description: 'Enterprise e-gift card gifting platform powered by Agentic AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
        <div className="flex h-screen overflow-hidden bg-slate-50">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="min-h-full p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
