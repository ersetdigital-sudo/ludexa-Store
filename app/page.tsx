import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { TrackForm } from "@/components/TrackForm";
import { PILLS } from "@/data/nav";
import { HOME_FAQ, POPULAR } from "@/data/home";
import { svcUrl } from "@/data/services";
import { CS_WA } from "@/lib/format";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const FEATURES = [
  { icon: "pln", title: "Proses Instan", desc: "Transaksi langsung diproses otomatis", pad: "" },
  { icon: "clock", title: "24 Jam Online", desc: "Bisa transaksi kapan saja", pad: "sm:pl-5" },
  { icon: "star", title: "Harga Bersaing", desc: "Selalu ada promo menarik", pad: "sm:pl-5" },
];

const STEPS = [
  ["01", "Pilih produk", "Pulsa, data, token, e-wallet, atau tagihan."],
  ["02", "Isi nomor tujuan", "Operator terdeteksi otomatis."],
  ["03", "Bayar", "QRIS, transfer bank, atau e-wallet."],
  ["04", "Beres!", "Produk masuk, struk tersimpan."],
];

const MASK = {
  WebkitMaskImage: "radial-gradient(circle at center,#000 45%,transparent 72%)",
  maskImage: "radial-gradient(circle at center,#000 45%,transparent 72%)",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomePage() {
  return (
    <main>
      <h1 className="sr-only">Ludexa Store — Semua pembayaran digital, satu tempat</h1>
      <div className="max-w-6xl mx-auto px-5">
        {/* Hero promo */}
        <section className="pt-6 grid md:grid-cols-2 gap-5">
          <Link
            href="/ewallet"
            className="relative overflow-hidden rounded-[24px] p-7 md:p-8 min-h-[220px] flex flex-col justify-center"
            style={{ background: "linear-gradient(120deg,#ffe3ee,#ffd0e2)" }}
          >
            <Image
              src="/images/73d6a3b3-ca72-4269-a6ec-f7d414db5362.png"
              alt="Ilustrasi top up e-wallet"
              width={1024}
              height={1024}
              priority
              sizes="(max-width: 768px) 52vw, 260px"
              className="absolute right-[-10px] bottom-[-10px] w-[52%] max-w-[260px] mix-blend-multiply"
              style={MASK}
            />
            <div className="relative max-w-[60%]">
              <div className="text-xs font-bold tracking-[.2em] text-[#c41d65]">TOP UP E-WALLET</div>
              <div className="text-4xl md:text-5xl font-extrabold leading-[1.05] mt-2">
                Cashback
                <br />
                <span className="text-[#e0337a]">5%</span>
              </div>
              <p className="text-sm text-[#5a4b58] mt-2">Lebih hemat setiap transaksi</p>
              <span className="mt-5 inline-grid place-items-center w-9 h-9 rounded-full bg-white text-[#e0337a] shadow">
                →
              </span>
            </div>
          </Link>
          <Link
            href="/pln"
            className="relative overflow-hidden rounded-[24px] p-7 md:p-8 min-h-[220px] flex flex-col justify-center"
            style={{ background: "linear-gradient(120deg,#fff0f6,#ffd9e7)" }}
          >
            <Image
              src="/images/c295c7a2-01ba-42e3-99c4-52c93af7c585.png"
              alt="Ilustrasi token listrik PLN"
              width={1024}
              height={1024}
              priority
              sizes="(max-width: 768px) 50vw, 250px"
              className="absolute right-[-10px] bottom-[-10px] w-[50%] max-w-[250px] mix-blend-multiply"
              style={MASK}
            />
            <div className="relative max-w-[62%]">
              <div className="text-xs font-bold tracking-[.2em] text-[#c41d65]">TOKEN PLN</div>
              <div className="text-4xl md:text-5xl font-extrabold leading-[1.05] mt-2">
                Diskon
                <br />
                Hingga <span className="text-[#e0337a]">5%</span>
              </div>
              <p className="text-sm text-[#5a4b58] mt-2">
                Penuhi kebutuhan listrik dengan lebih hemat
              </p>
              <span className="mt-5 inline-grid place-items-center w-9 h-9 rounded-full bg-white text-[#e0337a] shadow">
                →
              </span>
            </div>
          </Link>
        </section>

        {/* Pil layanan */}
        <section id="layanan" className="mt-6">
          <div className="flex gap-3 overflow-x-auto pb-2 md:flex-wrap md:justify-between">
            {PILLS.map(([id, label]) => (
              <Link
                key={id}
                href={svcUrl(id)}
                className="shrink-0 inline-flex items-center gap-2.5 rounded-full bg-[#fff0f6] hover:bg-[#ffe3ee] border border-[#f9d4e3] px-4 py-2.5 text-sm font-semibold"
              >
                <span className="w-5 h-5 text-[#e0337a]">
                  <Icon name={id} className="w-5 h-5" />
                </span>
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* Produk populer */}
        <section id="populer" className="mt-10">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl md:text-3xl font-extrabold">Lagi Laris</h2>
            <Link href="/bayar" className="text-sm font-bold text-[#e0337a]">
              Lihat Semua ›
            </Link>
          </div>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR.map((p) => (
              <div key={p.name} className="card p-4 flex flex-col">
                <div className="flex items-start gap-3">
                  <span
                    className="w-14 h-14 rounded-2xl grid place-items-center text-white font-extrabold text-sm shrink-0"
                    style={{ background: p.color }}
                  >
                    {p.badge}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-lg leading-tight">{p.name}</div>
                    <div className="text-xs text-[#7a6b78]">{p.desc}</div>
                  </div>
                  <span className="text-xs font-bold bg-[#ffe3ee] text-[#e0337a] rounded-md px-2 py-0.5">
                    -5%
                  </span>
                </div>
                <div className="mt-5 flex items-end justify-between gap-2">
                  <div>
                    <div className="text-xs text-[#ad9aa7] line-through">{p.old}</div>
                    <div className="font-extrabold text-lg text-[#e0337a]">{p.now}</div>
                  </div>
                  <Link
                    href={p.href}
                    className="rounded-lg bg-[#e0337a] hover:bg-[#c41d65] text-white font-bold text-sm px-5 py-2"
                  >
                    Beli
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Keunggulan */}
        <section className="mt-8 card p-5 md:p-6 grid sm:grid-cols-3 gap-5 sm:divide-x divide-[#f4e8ee]">
          {FEATURES.map((f) => (
            <div key={f.title} className={"flex items-center gap-4 " + f.pad}>
              <span className="w-12 h-12 rounded-full bg-[#ffe3ee] text-[#e0337a] p-3 shrink-0">
                <Icon name={f.icon} className="w-full h-full" />
              </span>
              <div>
                <div className="font-bold">{f.title}</div>
                <div className="text-xs text-[#7a6b78]">{f.desc}</div>
              </div>
            </div>
          ))}
        </section>
      </div>

      <div className="max-w-6xl mx-auto px-5">
        {/* Cara belanja + lacak pesanan */}
        <section id="alur" className="py-14 grid lg:grid-cols-5 gap-5">
          <div
            className="lg:col-span-3 rounded-[28px] p-7 md:p-10 text-white relative overflow-hidden"
            style={{ background: "#2a1526" }}
          >
            <div
              className="absolute -right-16 -top-16 w-56 h-56 rounded-full"
              style={{ background: "radial-gradient(#e0337a55,transparent 70%)" }}
            />
            <div className="relative grid md:grid-cols-2 gap-8">
              <div>
                <div className="text-xs font-bold tracking-[.2em] text-[#ff7aa8]">CARA BELANJA</div>
                <h2 className="text-3xl md:text-4xl font-extrabold mt-2 leading-tight">
                  Gampang,
                  <br />
                  nggak pakai ribet.
                </h2>
                <p className="text-white/60 mt-3 text-sm">
                  Semua transaksi selesai di satu halaman, tanpa perlu daftar akun.
                </p>
                <Link
                  href="/bayar"
                  className="inline-block mt-6 rounded-full bg-[#e0337a] hover:bg-[#c41d65] font-bold px-6 py-3 text-sm"
                >
                  Mulai belanja →
                </Link>
              </div>
              <ol className="space-y-5">
                {STEPS.map(([n, t, d]) => (
                  <li key={n} className="flex gap-4">
                    <span className="font-extrabold text-3xl text-[#ff7aa8] w-10 shrink-0">{n}</span>
                    <div className="pb-5 border-b border-white/10 flex-1">
                      <div className="font-bold text-white">{t}</div>
                      <div className="text-sm text-white/60">{d}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="lg:col-span-2 rounded-[28px] p-7 md:p-8 border-2 border-dashed border-[#f9c6da] bg-[#fff8fb] flex flex-col">
            <span className="w-12 h-12 rounded-2xl bg-[#e0337a] text-white p-3">
              <Icon name="search" className="w-full h-full" />
            </span>
            <h3 className="text-2xl font-extrabold mt-4">Lacak pesanan</h3>
            <p className="text-sm text-[#7a6b78] mt-1">Masukkan kode referensi atau nomor tujuan.</p>
            <TrackForm />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="pb-14 grid lg:grid-cols-3 gap-8">
          <div>
            <div className="text-xs font-bold tracking-[.2em] text-[#e0337a]">FAQ</div>
            <h2 className="text-3xl font-extrabold mt-2">Masih ada yang bingung?</h2>
            <p className="text-[#7a6b78] mt-2 text-sm">
              Jawaban singkat untuk pertanyaan yang sering muncul.
            </p>
            <Link href="/bantuan" className="inline-block mt-4 font-bold text-[#e0337a] text-sm">
              Pusat Bantuan ›
            </Link>
          </div>
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-3 content-start">
            {HOME_FAQ.map((f) => (
              <details
                key={f.q}
                className="group bg-white rounded-2xl border border-[#f4e8ee] p-5"
              >
                <summary className="list-none cursor-pointer flex justify-between gap-4 font-bold">
                  {f.q}
                  <span className="text-[#e0337a] text-xl leading-none group-open:rotate-45 transition">
                    +
                  </span>
                </summary>
                <p className="text-sm text-[#7a6b78] mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      {/* CTA WhatsApp */}
      <section className="px-5 pb-16">
        <div className="max-w-6xl mx-auto rounded-[28px] bg-[#ffe3ee] p-7 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold">Butuh bantuan cepat?</h2>
            <p className="text-[#5a4b58] mt-1">CS kami siap membantu lewat WhatsApp.</p>
          </div>
          <a
            href={`https://wa.me/${CS_WA}`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full bg-[#25a35a] hover:bg-[#1f8f4e] text-white font-bold px-6 h-12"
          >
            Chat 0857-1117-2317
          </a>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}
