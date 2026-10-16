import type { Metadata } from "next";
import Link from "next/link";
import { svcUrl } from "@/data/services";
import { CS_WA } from "@/lib/format";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Ludexa Store adalah layanan PPOB untuk beli pulsa, paket data, token listrik, top up e-wallet, dan bayar tagihan bulanan. Pilih, isi nomor, bayar, beres.",
  alternates: { canonical: "/tentang" },
  openGraph: {
    title: "Tentang Kami — Ludexa Store",
    description: "Belanja digital semudah jajan: cepat, aman, dan dibantu CS.",
    url: "/tentang",
  },
};

const VALUES = [
  ["A", "Cepat", "Proses praktis dari HP, kapan saja.", "border-b md:border-b-0 md:border-r border-[#f4e8ee]"],
  ["B", "Aman", "Pembayaran via QRIS resmi, setiap transaksi diverifikasi.", "border-b md:border-b-0 md:border-r border-[#f4e8ee]"],
  ["C", "Dibantu CS", "Tim kami siap membantu lewat WhatsApp.", ""],
];

const PRODUCTS: [string, string][] = [
  ["pulsa", "Pulsa"],
  ["data", "Paket Data"],
  ["pln", "Token PLN"],
  ["wallet", "E-Wallet"],
  ["pdam", "PDAM"],
  ["bpjs", "BPJS"],
  ["inet", "Internet & TV"],
  ["fin", "Multifinance"],
];

export default function TentangPage() {
  return (
    <main className="max-w-6xl mx-auto px-5 py-10">
      <section className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="text-xs font-bold tracking-[.2em] text-[#e0337a]">TENTANG LUDEXA</div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] mt-3">
            Belanja digital,
            <br />
            semudah <span className="text-[#e0337a]">jajan.</span>
          </h1>
          <p className="text-[#5a4b58] mt-5 text-lg max-w-lg">
            Ludexa Store adalah layanan PPOB untuk beli pulsa, paket data, token listrik, top up
            e-wallet, dan bayar tagihan bulanan. Pilih, isi nomor, bayar, beres.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/bayar"
              className="rounded-full bg-[#e0337a] hover:bg-[#c41d65] text-white font-bold px-6 py-3"
            >
              Mulai belanja
            </Link>
            <a
              href={`https://wa.me/${CS_WA}`}
              target="_blank"
              rel="noopener"
              className="rounded-full border-2 border-[#1f1630] font-bold px-6 py-2.5"
            >
              Chat CS
            </a>
          </div>
        </div>
        <div
          className="rounded-[28px] p-8 text-white relative overflow-hidden"
          style={{ background: "#2a1526" }}
        >
          <div
            className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full"
            style={{ background: "radial-gradient(#e0337a66,transparent 70%)" }}
          />
          <p className="relative text-2xl md:text-3xl font-extrabold leading-snug">
            “Transaksi sehari-hari seharusnya sederhana. Tanpa antre, tanpa ribet, harga
            bersahabat.”
          </p>
          <div className="relative mt-6 text-sm text-[#ffb3cf] font-bold tracking-[.2em]">
            PRINSIP KAMI
          </div>
        </div>
      </section>

      <section className="mt-14 grid md:grid-cols-3 gap-0 rounded-[28px] overflow-hidden border border-[#f4e8ee] bg-white">
        {VALUES.map(([k, title, desc, border]) => (
          <div key={k} className={"p-7 " + border}>
            <div className="text-5xl font-extrabold text-[#ffd1e2]">{k}</div>
            <h3 className="font-extrabold text-xl mt-2">{title}</h3>
            <p className="text-sm text-[#7a6b78] mt-1">{desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="text-2xl md:text-3xl font-extrabold">Yang bisa kamu beli di sini</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {PRODUCTS.map(([id, label]) => (
            <Link
              key={id}
              href={svcUrl(id)}
              className="rounded-full bg-[#fff0f6] border border-[#f9d4e3] px-5 py-3 font-semibold"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 mb-6 rounded-[28px] bg-[#ffe3ee] p-7 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h2 className="text-2xl font-extrabold">Ada pertanyaan?</h2>
          <p className="text-[#5a4b58]">WhatsApp CS: 0857-1117-2317</p>
        </div>
        <a
          href={`https://wa.me/${CS_WA}`}
          target="_blank"
          rel="noopener"
          className="self-start rounded-full bg-[#25a35a] text-white font-bold px-6 py-3"
        >
          Hubungi Kami
        </a>
      </section>
    </main>
  );
}
