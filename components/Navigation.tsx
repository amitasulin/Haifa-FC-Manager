'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'דשבורד' },
    { href: '/players', label: 'שחקנים' },
    { href: '/schedule', label: 'לוח אימונים ומשחקים' },
    { href: '/statistics', label: 'סטטיסטיקות' },
  ];

  return (
    <nav className="bg-haifa-green text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <h1 className="text-2xl font-bold">מכבי חיפה - מנהל קבוצה</h1>
          </div>
          <div className="flex gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-haifa-dark-green font-semibold'
                    : 'hover:bg-haifa-dark-green/80'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

