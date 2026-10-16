import Link from "next/link";
import { Logo } from "./Logo";
import { CS_WA } from "@/lib/format";

const PAYMENTS = ["QRIS", "DANA", "OVO", "GoPay", "VA Bank"];

export function Footer() {
  return (
    <footer className="bg-[#2a1526] text-white/65 text-sm">
      <div className="max-w-6xl mx-auto px-5 pt-14 pb-8 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-xs">
            Platform pembayaran digital untuk pulsa, data, token listrik, dan tagihan bulanan.
            Cepat, aman, harga bersahabat.
          </p>
        </div>
        <div>
          <div className="text-white font-bold mb-3">Layanan</div>
          <ul className="space-y-2">
            <li><Link href="/pulsa">Pulsa &amp; Data</Link></li>
            <li><Link href="/pln">Token PLN</Link></li>
            <li><Link href="/ewallet">E-Wallet</Link></li>
            <li><Link href="/bpjs">Tagihan</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-white font-bold mb-3">Bantuan</div>
          <ul className="space-y-2">
            <li><Link href="/cek">Cek Transaksi</Link></li>
            <li><Link href="/bantuan">Pusat Bantuan</Link></li>
            <li>
              <a href={`https://wa.me/${CS_WA}`} target="_blank" rel="noopener">
                WhatsApp CS
              </a>
            </li>
          </ul>
          <div className="text-white font-bold mb-3 mt-6">Perusahaan</div>
          <ul className="space-y-2">
            <li><Link href="/tentang">Tentang Kami</Link></li>
            <li><Link href="/kebijakan-privasi">Kebijakan Privasi</Link></li>
            <li><Link href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-white font-bold mb-3">Pembayaran</div>
          <div className="flex flex-wrap gap-2">
            {PAYMENTS.map((x) => (
              <span
                key={x}
                className="px-2.5 py-1 rounded-md bg-white/10 text-white/85 text-xs font-semibold"
              >
                {x}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-5 py-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-2 text-xs">
        <span>© 2026 Ludexa Store. All rights reserved.</span>
        <span>Dibuat untuk transaksi yang lebih mudah.</span>
      </div>
    </footer>
  );
}
