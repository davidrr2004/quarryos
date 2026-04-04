"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { name: "Jobs", path: "/jobs", icon: "briefcase" },
  { name: "Work Status", path: "/work-status", icon: "clock" },
  { name: "Workers", path: "/workers", icon: "users" },
  { name: "Finance", path: "/finance", icon: "dollar" },
  { name: "Fleet", path: "/fleet", icon: "truck" },
  { name: "Reports", path: "/reports", icon: "chart" },
];

function NavIcon({ icon }: { icon: string }) {
  const iconMap: Record<string, React.ReactElement> = {
    briefcase: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.5a2.5 2.5 0 00-5 0H6.5a2.5 2.5 0 00-5 0H2" />
      </svg>
    ),
    clock: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    users: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m4 0a4 4 0 01-4 4H7m8-4a4 4 0 001-7.854M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    dollar: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    truck: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    chart: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  };
  return iconMap[icon] || <div />;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* ── Sticky Top Bar ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backgroundColor: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border-soft)",
          padding: "1rem 1rem 0.75rem",
          fontFamily: "var(--font-sans, sans-serif)",
        }}
      >
        <p style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground)", margin: 0 }}>
          <span style={{ color: "var(--color-primary)" }}>QUARRY</span> OS
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Bottom Navbar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-soft border-t"
        style={{
          fontFamily: "var(--font-sans)",
          borderTopColor: "var(--color-border-soft)",
          borderRadius: "var(--radius-box) var(--radius-box) 0 0",
        }}
      >
        <div className="grid grid-cols-6 gap-1 px-3 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} className="flex justify-center">
                <button
                  className="flex items-center justify-center p-3 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? "var(--color-primary)" : "transparent",
                    color: isActive ? "white" : "var(--color-primary)",
                  }}
                  title={item.name}
                >
                  <NavIcon icon={item.icon} />
                </button>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}