import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-slate-900">
            Reel Route
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Dashboard</span>
            <Button variant="ghost" size="sm">
              Profile
            </Button>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}
