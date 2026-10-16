"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";
import { HELP_TOPICS } from "@/data/help";
import { CS_WA } from "@/lib/format";

export function HelpClient() {
  const [topic, setTopic] = useState("all");
  const [q, setQ] = useState("");
  const titleRef = useRef<HTMLHeadingElement>(null);

  const all = useMemo(
    () => [["all", "Semua"], ...HELP_TOPICS.map((f) => [f[0], f[1]] as [string, string])],
    []
  );

  const query = q.trim().toLowerCase();

  const items = useMemo(() => {
    let list: [string, string, string][] = [];
    HELP_TOPICS.forEach((f) => {
      if (query || topic === "all" || topic === f[0]) {
        f[2].forEach((x) => list.push([f[1], x[0], x[1]]));
      }
    });
    if (query) {
      list = list.filter((i) => (i[1] + " " + i[2]).toLowerCase().includes(query));
    }
    return list;
  }, [query, topic]);

  const label = all.find((t) => t[0] === topic)?.[1] ?? "Semua";
  const title = query ? `Hasil untuk "${q.trim()}"` : label === "Semua" ? "Semua pertanyaan" : label;

  const jumpTo = (t: string) => {
    setTopic(t);
    setQ("");
    requestAnimationFrame(() =>
      titleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    );
  };

  return (
    <main className="max-w-6xl mx-auto px-5 py-10">
      <section className="grid lg:grid-cols-[1fr_340px] gap-6 items-stretch">
        <div className="rounded-[28px] bg-[#fff0f6] p-7 md:p-10">
          <div className="text-xs font-bold tracking-[.2em] text-[#e0337a]">PUSAT BANTUAN</div>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-3 leading-tight">
            Halo, ada kendala
            <br />
            apa hari ini?
          </h1>
          <div className="mt-7 bg-white rounded-full p-1.5 pl-5 flex items-center gap-2 border border-[#f9d4e3]">
            <span className="w-5 h-5 text-[#ad9aa7] shrink-0">
              <Icon name="search" className="w-full h-full" />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="flex-1 py-2.5 outline-none min-w-0 bg-transparent"
              placeholder="Cari: refund, voucher, QRIS, token…"
              aria-label="Cari pertanyaan"
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <button
              onClick={() => jumpTo("refund")}
              className="rounded-full bg-white border border-[#f9d4e3] px-4 py-2 font-semibold"
            >
              Transaksi gagal
            </button>
            <button
              onClick={() => jumpTo("bayar")}
              className="rounded-full bg-white border border-[#f9d4e3] px-4 py-2 font-semibold"
            >
              Pembayaran QRIS
            </button>
            <button
              onClick={() => jumpTo("akun")}
              className="rounded-full bg-white border border-[#f9d4e3] px-4 py-2 font-semibold"
            >
              Keamanan
            </button>
            <Link
              href="/cek"
              className="rounded-full bg-[#1f1630] text-white px-4 py-2 font-semibold"
            >
              Cek transaksi →
            </Link>
          </div>
        </div>

        <aside
          className="rounded-[28px] p-7 text-white flex flex-col"
          style={{ background: "#2a1526" }}
        >
          <div className="text-xs font-bold tracking-[.2em] text-[#ff7aa8]">CS ONLINE</div>
          <h2 className="text-2xl font-extrabold mt-2">Ngobrol langsung sama tim kami</h2>
          <p className="text-white/60 text-sm mt-2">
            Siapkan kode referensi transaksi supaya dibantu lebih cepat.
          </p>
          <div className="mt-auto pt-6">
            <div className="font-extrabold text-xl">0857-1117-2317</div>
            <a
              href={`https://wa.me/${CS_WA}?text=${encodeURIComponent("Halo CS Ludexa Store, saya butuh bantuan.")}`}
              target="_blank"
              rel="noopener"
              className="mt-3 block text-center rounded-full bg-[#25a35a] hover:bg-[#1f8f4e] font-bold py-3"
            >
              Chat WhatsApp
            </a>
          </div>
        </aside>
      </section>

      <section className="mt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 ref={titleRef} className="text-2xl md:text-3xl font-extrabold shrink-0">
            {title}
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {all.map(([id, name]) => (
              <button
                key={id}
                onClick={() => {
                  setTopic(id);
                  setQ("");
                }}
                className={
                  "topic rounded-full border border-[#f2dde6] bg-white py-2 px-4 text-sm font-semibold whitespace-nowrap " +
                  (id === topic && !query ? "active" : "")
                }
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-3 items-start">
          {items.map((i) => (
            <details key={i[1]} className="acc bg-white rounded-2xl border border-[#f4e8ee] px-5 py-4 group">
              <summary className="flex items-center justify-between gap-4 cursor-pointer">
                <span>
                  <span className="block text-xs font-bold text-[#e0337a] mb-1">{i[0]}</span>
                  <span className="font-bold">{i[1]}</span>
                </span>
                <span className="chev w-8 h-8 shrink-0 rounded-full bg-[#fff0f6] text-[#e0337a] grid place-items-center text-xl font-light">
                  +
                </span>
              </summary>
              <p className="text-[#5a4b58] leading-relaxed mt-3 pr-10">{i[2]}</p>
            </details>
          ))}
        </div>

        <div
          className={
            (items.length ? "hidden " : "") +
            "mt-6 rounded-2xl border-2 border-dashed border-[#f9c6da] p-8 text-center"
          }
        >
          <div className="font-bold">Belum ketemu jawabannya?</div>
          <p className="text-sm text-[#7a6b78] mt-1">Tanyakan langsung ke tim kami.</p>
          <a
            href={`https://wa.me/${CS_WA}`}
            target="_blank"
            rel="noopener"
            className="inline-block mt-4 rounded-full bg-[#25a35a] text-white font-bold px-6 py-3"
          >
            Chat WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
