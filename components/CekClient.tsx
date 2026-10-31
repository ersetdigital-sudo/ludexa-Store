"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { serviceMeta, type Service } from "@/lib/catalog";
import { checkOrder, getPayment } from "@/lib/db/client";
import { toPublicError } from "@/lib/db/errors";
import { PUBLIC_STATUS } from "@/lib/db/status";
import type { OrderLookup, PaymentInfo } from "@/lib/db/types";
import { fmtDate, rp } from "@/lib/format";
import { readRefs } from "@/lib/refs";

type Result = { order: OrderLookup; payment: PaymentInfo | null };

function serviceFor(name: string, services: Service[]) {
  return (
    services.find((service) => service.n === name) ??
    services.find((service) =>
      name.toLowerCase().includes(service.n.toLowerCase()),
    ) ??
    null
  );
}

function statusLabel(status: OrderLookup["status"]) {
  return PUBLIC_STATUS[status].label;
}

function totalText(value: number | null) {
  return value !== null && value !== undefined ? rp(value) : "Menunggu";
}

function Card({
  item,
  services,
  onPick,
}: {
  item: Result;
  services: Service[];
  onPick: (ref: string) => void;
}) {
  const service = serviceFor(item.order.layanan, services);
  const meta = service ? serviceMeta(service.id) : null;
  const status = PUBLIC_STATUS[item.order.status];

  return (
    <button
      onClick={() => onPick(item.order.ref)}
      className="card w-full p-4 flex items-center gap-4 text-left hover:border-[#f5b3cd] transition"
    >
      <span
        className={`${service ? `t-${service.t}` : "t-purple"} rounded-xl p-2.5 w-11 h-11 shrink-0`}
      >
        <Icon name={meta?.icon ?? "wallet"} className="w-full h-full" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-bold truncate">
          {item.order.produk ?? item.order.layanan}
        </div>
        <div className="text-xs text-[#7a6b78] truncate">
          {item.order.nomor_tujuan} · {fmtDate(item.order.created_at)}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-extrabold text-sm">
          {totalText(item.order.total)}
        </div>
        <span className={`${status.badgeClass} mt-1`}>
          {statusLabel(item.order.status)}
        </span>
      </div>
    </button>
  );
}

const STEPS = [
  "Pesanan dibuat",
  "Pembayaran dikonfirmasi",
  "Verifikasi pembayaran",
  "Transaksi sukses",
];

function detailDate(order: OrderLookup, index: number) {
  if (index === 0) return fmtDate(order.created_at);
  if (index === 1) return order.paid_at ? fmtDate(order.paid_at) : "Menunggu";
  if (index === 2)
    return order.completed_at
      ? fmtDate(order.completed_at)
      : order.paid_at
        ? fmtDate(order.paid_at)
        : "Menunggu";
  return order.completed_at ? fmtDate(order.completed_at) : "Menunggu";
}

function Detail({
  item,
  services,
}: {
  item: Result;
  services: Service[];
}) {
  const { order, payment } = item;
  const status = PUBLIC_STATUS[order.status];
  const done =
    order.status === "sukses"
      ? 4
      : order.status === "sudah_bayar"
        ? 3
        : 1;
  const rows: [string, string][] = [
    ["Layanan", order.layanan],
    ["Produk", order.produk ?? "-"],
    ["Nomor tujuan", order.nomor_tujuan],
    ["Metode", payment?.metode_bayar ?? "-"],
    [
      /PLN/i.test(order.layanan) ? "Token" : "Serial number",
      order.sn ?? "Akan dikirim setelah verifikasi",
    ],
    ["Total", totalText(order.total)],
  ];
  const service = serviceFor(order.layanan, services);
  const meta = service ? serviceMeta(service.id) : null;

  return (
    <div className="card overflow-hidden">
      <div className="p-6 flex flex-wrap justify-between gap-3 items-start border-b border-[#f4e8ee]">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`${service ? `t-${service.t}` : "t-purple"} rounded-xl p-2.5 w-11 h-11 shrink-0`}
          >
            <Icon name={meta?.icon ?? "wallet"} className="w-full h-full" />
          </span>
          <div className="min-w-0">
            <div className="text-xs text-[#7a6b78]">Kode referensi</div>
            <div className="font-mono font-extrabold text-lg truncate">
              {order.ref}
            </div>
          </div>
        </div>
        <span className={status.badgeClass}>● {status.label}</span>
      </div>
      <div className="p-6 grid md:grid-cols-2 gap-8">
        <div className="space-y-3 text-sm">
          {rows.map((row) => (
            <div key={row[0]} className="flex justify-between gap-3">
              <span className="text-[#7a6b78]">{row[0]}</span>
              <b className="text-right">{row[1]}</b>
            </div>
          ))}
          {payment?.expires_at && order.status === "menunggu_bayar" ? (
            <div className="flex justify-between gap-3">
              <span className="text-[#7a6b78]">Batas bayar</span>
              <b className="text-right">{fmtDate(payment.expires_at)}</b>
            </div>
          ) : null}
        </div>
        <ol className="relative border-l-2 border-[#f3dbe5] ml-2 space-y-5">
          {STEPS.map((label, index) => {
            const canceled = order.status === "dibatalkan";
            const active = canceled ? index === 0 : index === done;
            const passed = canceled ? index === 0 : index < done;
            return (
              <li key={label} className="pl-5 relative">
                <span
                  className={
                    "absolute -left-[9px] top-0.5 w-4 h-4 rounded-full " +
                    (passed
                      ? "bg-[#e0337a] ring-4 ring-[#ffe3ee]"
                      : active
                        ? "bg-[#f5a623] ring-4 ring-[#fff3dc]"
                        : "bg-[#f3dbe5]")
                  }
                />
                <div
                  className={
                    "font-semibold text-sm " +
                    (index > done && !canceled ? "text-[#ad9aa7]" : "")
                  }
                >
                  {canceled && index === 0 ? "Transaksi dibatalkan" : label}
                </div>
                <div className="text-xs text-[#7a6b78]">
                  {canceled
                    ? index === 0
                      ? fmtDate(order.created_at)
                      : ""
                    : detailDate(order, index)}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      {order.status === "sukses" && order.sn ? (
        <div className="px-6 pb-6">
          <div className="rounded-xl bg-[#dcf5ec] text-[#16835e] text-sm p-3">
            Transaksi sukses. Simpan kode referensi dan bukti transaksi ini.
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function CekClient({
  services,
  brandSlug,
}: {
  services: Service[];
  brandSlug: string;
}) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Result[] | null>(null);
  const [hist, setHist] = useState<Result[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup(value: string) {
    const query = value.trim();
    if (!query) {
      setItems(null);
      setError(null);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const isRef = /[A-Z]/i.test(query);
      const orders = await checkOrder({
        brandSlug,
        ref: isRef ? query.replace(/\s/g, "").toUpperCase() : null,
        nomorTujuan: isRef
          ? null
          : query.replace(/\D/g, ""),
      });
      const results = await Promise.all(
        orders.map(async (order) => {
          try {
            const payment = await getPayment(order.ref);
            return { order, payment };
          } catch {
            return { order, payment: null };
          }
        }),
      );
      setItems(results);
    } catch (err) {
      setItems([]);
      setError(toPublicError(err).message);
    } finally {
      setBusy(false);
    }
  }

  function search(value: string) {
    void lookup(value);
  }

  function pick(ref: string) {
    setQ(ref);
    search(ref);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    let active = true;
    const refs = readRefs();
    void (async () => {
      const results = await Promise.all(
        refs.map(async (ref) => {
          try {
            const orders = await checkOrder({ brandSlug, ref });
            if (!orders[0]) return null;
            let payment: PaymentInfo | null = null;
            try {
              payment = await getPayment(orders[0].ref);
            } catch {
              payment = null;
            }
            return { order: orders[0], payment } satisfies Result;
          } catch {
            return null;
          }
        }),
      );
      if (active) {
        setHist(results.filter((item): item is Result => item !== null));
      }
    })();

    let initial = new URLSearchParams(window.location.search).get("q");
    try {
      initial = initial || localStorage.getItem("ldx_q");
      localStorage.removeItem("ldx_q");
    } catch {
      /* abaikan */
    }
    if (initial) {
      setQ(initial);
      search(initial);
    }
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandSlug]);

  const hits = items ?? [];

  return (
    <main className="max-w-6xl mx-auto px-5 py-10 min-h-[50vh]">
      <section className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="rounded-[28px] bg-[#fff0f6] p-7 md:p-10">
          <div className="text-xs font-bold tracking-[.2em] text-[#e0337a]">
            LACAK PESANAN
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-3 leading-tight">
            Pesananmu sampai
            <br />
            mana, ya?
          </h1>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              search(q);
            }}
            className="mt-7 bg-white rounded-2xl p-2 border border-[#f9d4e3] flex flex-col sm:flex-row gap-2"
          >
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              name="q"
              className="flex-1 px-4 py-3 outline-none min-w-0"
              placeholder="LDS-261031-XXXXXX atau 0812…"
              aria-label="Kode referensi atau nomor tujuan"
            />
            <button
              className="rounded-xl bg-[#1f1630] hover:bg-black text-white font-bold px-6 py-3"
              disabled={busy}
            >
              {busy ? "Mencari…" : "Cek Status"}
            </button>
          </form>
          <div className="mt-6">
            {items !== null &&
              (hits.length === 0 ? (
                <div className="card p-8 text-center">
                  <div className="text-4xl">🔍</div>
                  <div className="font-bold mt-2">
                    {error ?? "Transaksi tidak ditemukan"}
                  </div>
                  <p className="text-sm text-[#7a6b78] mt-1">
                    Periksa lagi kode referensi atau nomor tujuan. Butuh
                    bantuan? Hubungi CS 24 jam.
                  </p>
                </div>
              ) : hits.length === 1 ? (
                <Detail item={hits[0]} services={services} />
              ) : (
                <div>
                  <div className="font-bold mb-3">
                    {hits.length} transaksi ditemukan
                  </div>
                  <div className="space-y-3">
                    {hits.map((item) => (
                      <Card
                        key={item.order.ref}
                        item={item}
                        services={services}
                        onPick={pick}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <aside
          className="rounded-[28px] p-6 text-white"
          style={{ background: "#2a1526" }}
        >
          <div className="flex justify-between items-center">
            <h2 className="font-extrabold text-lg">Riwayat di perangkat ini</h2>
          </div>
          <div className="mt-4 space-y-3 [&_.card]:!bg-white [&_.card]:!text-[#1f1630]">
            {hist.length ? (
              hist.map((item) => (
                <Card
                  key={item.order.ref}
                  item={item}
                  services={services}
                  onPick={pick}
                />
              ))
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
