"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { WaIcon } from "./WaIcon";
import { CS_WA } from "@/lib/format";
import { SEARCH_MAP } from "@/data/nav";

export function Header() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const s = q.toLowerCase();
    const key = Object.keys(SEARCH_MAP).find((k) => s.includes(k));
    router.push(key ? SEARCH_MAP[key] : "/bantuan");
  };

  return (
    <>
      <div className="bg-[#e0337a] text-white text-sm font-semibold">
        <Link
          href="/ewallet"
          className="max-w-6xl mx-auto px-5 h-10 flex items-center justify-center gap-2 relative"
        >
          🎁 Promo hari ini: cashback top up 5%
          <span className="absolute right-5 hidden sm:block">›</span>
        </Link>
      </div>
      <header className="bg-white sticky top-0 z-30 border-b border-[#f4e8ee]">
        <nav className="max-w-6xl mx-auto px-5 h-[72px] flex items-center gap-4 md:gap-8">
          <Link href="/" aria-label="Ludexa Store" className="shrink-0">
            <Logo />
          </Link>
          <form
            onSubmit={onSearch}
            className="hidden md:flex flex-1 items-center gap-2 bg-[#f6eff3] rounded-full px-4 h-11"
          >
            <span className="w-5 h-5 text-[#ad9aa7]">
              <Icon name="search" className="w-5 h-5" />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="bg-transparent flex-1 outline-none text-sm"
              placeholder="Cari produk, layanan, atau tagihan..."
              aria-label="Cari produk, layanan, atau tagihan"
            />
          </form>
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            <Link
              href="/cek"
              className="w-11 h-11 grid place-items-center rounded-full text-[#1f1630] hover:bg-[#fff0f6]"
              aria-label="Cek transaksi"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6" />
                <circle cx="9" cy="20" r="1.3" />
                <circle cx="17" cy="20" r="1.3" />
              </svg>
            </Link>
            <a
              href={`https://wa.me/${CS_WA}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-[#25a35a] hover:bg-[#1f8f4e] text-white font-bold text-sm px-4 sm:px-5 h-11"
            >
              <WaIcon />
              <span className="hidden sm:inline">Hubungi Kami</span>
            </a>
          </div>
        </nav>
      </header>
    </>
  );
}
