"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { SERVICES, svcById, svcByName } from "@/data/services";
import { fmtDate, rp } from "@/lib/format";
import { TX, type Tx } from "@/lib/store";

function tone(svcName: string) {
  return (svcByName(svcName) ?? SERVICES[0]).t;
}
function iconKey(svcName: string) {
  return (svcByName(svcName) ?? SERVICES[0]).id;
}

function Card({ t, onPick }: { t: Tx; onPick: (ref: string) => void }) {
  return (
    <button
      onClick={() => onPick(t.ref)}
      className="card w-full p-4 flex items-center gap-4 text-left hover:border-[#f5b3cd] transition"
    >
      <span className={`t-${tone(t.svc)} rounded-xl p-2.5 w-11 h-11 shrink-0`}>
        <Icon name={iconKey(t.svc)} className="w-full h-full" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-bold truncate">{t.prod}</div>
        <div className="text-xs text-[#7a6b78] truncate">
          {t.no} · {fmtDate(t.time)}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-extrabold text-sm">{rp(t.total)}</div>
        <span className={`badge ${t.status === "Sukses" ? "b-ok" : "b-wait"} mt-1`}>
          {t.status === "Sukses" ? "Sukses" : "Sedang dicek"}
        </span>
      </div>
    </button>
  );
}

const STEPS = [
  "Pesanan dibuat",
  "Pembayaran dikonfirmasi pelanggan",
  "Verifikasi pembayaran",
  "Transaksi sukses",
];

function Detail({ t }: { t: Tx }) {
  const done = t.status === "Sukses" ? 4 : 2;
  const rows: [string, string][] = [
    ["Layanan", t.svc],
    ["Produk", t.prod],
    ["Nomor tujuan", t.no],
    ["Metode", t.method],
    [/PLN/.test(t.svc) ? "Token" : "Serial number", t.sn ?? ""],
    ["Total", rp(t.total)],
  ];

  return (
    <div className="card overflow-hidden">
      <div className="p-6 flex flex-wrap justify-between gap-3 items-start border-b border-[#f4e8ee]">
        <div>
          <div className="text-xs text-[#7a6b78]">Kode referensi</div>
          <div className="font-mono font-extrabold text-lg">{t.ref}</div>
        </div>
        <span className={`badge ${t.status === "Sukses" ? "b-ok" : "b-wait"}`}>
          ● {t.status === "Sukses" ? "Sukses" : "Sedang dicek"}
        </span>
      </div>
      <div className="p-6 grid md:grid-cols-2 gap-8">
        <div className="space-y-3 text-sm">
          {rows.map((r) => (
            <div key={r[0]} className="flex justify-between gap-3">
              <span className="text-[#7a6b78]">{r[0]}</span>
              <b className="text-right">{r[1]}</b>
            </div>
          ))}
        </div>
        <ol className="relative border-l-2 border-[#f3dbe5] ml-2 space-y-5">
          {STEPS.map((s, i) => (
            <li key={s} className="pl-5 relative">
              <span
                className={
                  "absolute -left-[9px] top-0.5 w-4 h-4 rounded-full " +
                  (i < done
                    ? "bg-[#e0337a] ring-4 ring-[#ffe3ee]"
                    : i === done
                      ? "bg-[#f5a623] ring-4 ring-[#fff3dc] animate-pulse"
                      : "bg-[#f3dbe5]")
                }
              />
              <div className={"font-semibold text-sm " + (i > done ? "text-[#ad9aa7]" : "")}>{s}</div>
              <div className="text-xs text-[#7a6b78]">
                {i < done
                  ? fmtDate(new Date(t.time).getTime() + i * 15000)
                  : i === done
                    ? "Sedang berlangsung…"
                    : "Menunggu"}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// Transaksi contoh untuk kode referensi / nomor yang belum ada di perangkat
function demoTx(k: string): Tx {
  let h = 0;
  for (const c of k) h = (h * 31 + c.charCodeAt(0)) % 1e9;
  const S = SERVICES[h % SERVICES.length];
  const it: [string, number] = S.items
    ? S.items[h % S.items.length]
    : ["Tagihan " + S.n, (h % 40 + 8) * 5000];
  const isRef = k.startsWith("REF");
  return {
    ref: isRef
      ? k.includes("-")
        ? k
        : k.replace("REF", "REF-")
      : "REF-LDX" + String(h).padStart(8, "0").slice(-8),
    svc: S.n,
    prod: it[0],
    no: isRef ? "0812****" + String(h).slice(-4) : k,
    method: ["QRIS", "DANA", "OVO", "GoPay"][h % 4],
    total: it[1],
    time: new Date(Date.now() - (h % 720) * 60000).toISOString(),
    status: "Sukses",
    sn: /PLN/.test(S.n)
      ? String(h)
          .padStart(20, "7")
          .slice(0, 20)
          .replace(/(\d{4})(?=\d)/g, "$1-")
      : "SN" + String(h).padStart(10, "0"),
  };
}

export function CekClient() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<{ hits: Tx[] } | null>(null);
  const [hist, setHist] = useState<Tx[]>([]);

  function search(value: string) {
    const v = (value || "").trim();
    if (!v) {
      setRes(null);
      return;
    }
    const k = v.replace(/\s/g, "").toUpperCase();
    let hits = TX.all().filter((t) => t.ref.toUpperCase() === k || t.no.replace(/\s/g, "") === k);
    if (
      !hits.length &&
      (/^REF-?LDX\d{6,}$/.test(k) || /^(\+?62|0)8\d{7,12}$/.test(k) || /^\d{8,16}$/.test(k))
    ) {
      hits = [demoTx(k)];
    }
    setRes({ hits });
  }

  function pick(ref: string) {
    setQ(ref);
    search(ref);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    setHist(TX.all());
    let q0 = new URLSearchParams(window.location.search).get("q");
    try {
      q0 = q0 || localStorage.getItem("ldx_q");
      localStorage.removeItem("ldx_q");
    } catch {
      /* abaikan */
    }
    if (q0) {
      setQ(q0);
      search(q0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hits = res?.hits ?? [];

  return (
    <main className="max-w-6xl mx-auto px-5 py-10 min-h-[50vh]">
      <section className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="rounded-[28px] bg-[#fff0f6] p-7 md:p-10">
          <div className="text-xs font-bold tracking-[.2em] text-[#e0337a]">LACAK PESANAN</div>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-3 leading-tight">
            Pesananmu sampai
            <br />
            mana, ya?
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              search(q);
            }}
            className="mt-7 bg-white rounded-2xl p-2 border border-[#f9d4e3] flex flex-col sm:flex-row gap-2"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              name="q"
              className="flex-1 px-4 py-3 outline-none min-w-0"
              placeholder="REF-LDX12345678 atau 0812…"
              aria-label="Kode referensi atau nomor tujuan"
            />
            <button className="rounded-xl bg-[#1f1630] hover:bg-black text-white font-bold px-6 py-3">
              Cek Status
            </button>
          </form>
          <div className="mt-6">
            {res &&
              (hits.length === 0 ? (
                <div className="card p-8 text-center">
                  <div className="text-4xl">🔍</div>
                  <div className="font-bold mt-2">Transaksi tidak ditemukan</div>
                  <p className="text-sm text-[#7a6b78] mt-1">
                    Periksa lagi kode referensi atau nomor tujuan. Butuh bantuan? Hubungi CS 24 jam.
                  </p>
                </div>
              ) : hits.length === 1 ? (
                <Detail t={hits[0]} />
              ) : (
                <div>
                  <div className="font-bold mb-3">{hits.length} transaksi ditemukan</div>
                  <div className="space-y-3">
                    {hits.map((t, i) => (
                      <Card key={t.ref + i} t={t} onPick={pick} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <aside className="rounded-[28px] p-6 text-white" style={{ background: "#2a1526" }}>
          <div className="flex justify-between items-center">
            <h2 className="font-extrabold text-lg">Riwayat di perangkat ini</h2>
          </div>
          <div className="mt-4 space-y-3 [&_.card]:!bg-white [&_.card]:!text-[#1f1630]">
            {hist.length ? (
              hist.map((t, i) => <Card key={t.ref + i} t={t} onPick={pick} />)
            ) : (
              <div className="card p-8 text-center text-[#7a6b78]">
                Belum ada transaksi di perangkat ini.
                <br />
                <Link href="/bayar" className="btn mt-4">
                  Mulai Transaksi
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/bayar"
            className="mt-5 block text-center rounded-full bg-[#e0337a] hover:bg-[#c41d65] font-bold py-3"
          >
            + Transaksi baru
          </Link>
        </aside>
      </section>
    </main>
  );
}
