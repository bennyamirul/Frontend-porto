"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getProfile, type Profile } from "@/lib/api";

const navItems = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/projects", label: "Projects", icon: "▣" },
  { href: "/experience", label: "Experience", icon: "◫" },
  { href: "/certificates", label: "Certificates", icon: "◌" },
  { href: "/contact", label: "Contact", icon: "✉" },
];

/**
 * Sidebar utama untuk layout desktop dan menu sederhana untuk mobile.
 * Dipasang di RootLayout untuk menggantikan top nav dan menjaga tata letak yang lebih padat.
 */
export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: 0,
    name: "Benny Amirul",
    email: "bennyamirul@gmail.com",
    avatarUrl: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const currentProfile = await getProfile();
        setProfile(currentProfile);
      } catch {
        setProfile({
          id: 0,
          name: "Benny Amirul",
          email: "bennyamirul@gmail.com",
          avatarUrl: "",
        });
      }
    }

    loadProfile();
  }, []);

  const isActive = (href: string) => pathname === href;
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div className="border-b border-black/10 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.2em] text-black"
          >
            Benny.dev
          </Link>
          <button
            aria-label="Toggle navigation"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-lg text-black"
            onClick={() => setMobileOpen((value) => !value)}
            type="button"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>

        {mobileOpen ? (
          <nav className="mx-auto flex max-w-4xl flex-col gap-2 px-4 pb-4">
            {navItems.map((item) => (
              <Link
                className={`flex items-center gap-3 rounded-full border px-3 py-2 text-sm transition ${
                  isActive(item.href)
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white text-gray-700 hover:border-black/20 hover:bg-gray-50"
                }`}
                href={item.href}
                key={item.href}
                onClick={() => setMobileOpen(false)}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>

      <aside className="hidden md:flex md:fixed md:left-0 md:top-0 md:h-screen md:w-[260px] md:flex-col md:justify-between md:border-r md:border-black/10 md:bg-white md:px-6 md:py-8 md:shadow-[0_0_30px_rgba(0,0,0,0.04)]">
        <div>
          <div className="mb-8 flex flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-black text-lg font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              {profile.avatarUrl ? (
                <img
                  alt={profile.name}
                  className="h-full w-full object-cover"
                  src={profile.avatarUrl}
                />
              ) : (
                initials
              )}
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-black">{profile.name}</p>
              <p className="mt-1 text-sm text-gray-400">{profile.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition ${
                  isActive(item.href)
                    ? "border-black bg-black text-white shadow-[0_10px_25px_rgba(0,0,0,0.12)]"
                    : "border-transparent text-gray-600 hover:border-black/10 hover:bg-gray-50 hover:text-black"
                }`}
                href={item.href}
                key={item.href}
              >
                <span aria-hidden="true" className="text-base">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="rounded-2xl border border-black/10 bg-gray-50 p-3 text-xs text-gray-500">
          Available for product & frontend work
        </div>
      </aside>
    </>
  );
}
