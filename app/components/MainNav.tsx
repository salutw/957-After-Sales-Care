'use client';

import { usePathname } from 'next/navigation';

const navItems = [
  { label: '儀表板', href: '/', activeClass: 'bg-[#087e74] text-white' },
  { label: '訂單管理', href: '/orders', activeClass: 'bg-[#087e74] text-white' },
  { label: '健康記錄', href: '/health', activeClass: 'bg-[#087e74] text-white' },
  { label: '顧問諮詢', href: '/advisor', activeClass: 'bg-[#087e74] text-white' },
  { label: '個人資料', href: '/profile', activeClass: 'bg-[#087e74] text-white' },
  { label: '管理後台', href: '/admin', activeClass: 'bg-[#087e74] text-white' },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white rounded-xl shadow-sm border border-[#d9e7e5] p-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <button
              key={item.href}
              onClick={() => window.location.href = item.href}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                isActive
                  ? item.activeClass
                  : 'hover:bg-[#f8fbfa] text-[#0f2240]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
