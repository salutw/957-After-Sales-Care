'use client';

import { usePathname } from 'next/navigation';

const navItems = [
  { label: '首頁', href: '/' },
  { label: '訂單管理', href: '/orders' },
  { label: '健康記錄', href: '/health' },
  { label: '顧問諮詢', href: '/advisor' },
  { label: '個人資料', href: '/profile' },
  { label: '管理後台', href: '/admin' },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-[#d9e7e5]">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-center gap-8 px-5 md:px-8 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm font-semibold transition ${
                isActive
                  ? 'text-[#008f7a]'
                  : 'text-[#637082] hover:text-[#008f7a]'
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
