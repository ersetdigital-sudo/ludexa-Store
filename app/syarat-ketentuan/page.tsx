import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { CS_WA } from "@/lib/format";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Ketentuan penggunaan layanan Ludexa Store.",
  alternates: { canonical: "/syarat-ketentuan" },
  openGraph: {
    title: "Syarat & Ketentuan — Ludexa Store",
    description: "Ketentuan penggunaan layanan Ludexa Store.",
    url: "/syarat-ketentuan",
  },
};

const WA_LINK = `https://wa.me/${CS_WA}`;

const SECTIONS: LegalSection[] = [
  {
    id: "s1",
    title: "Ketentuan umum",
    body: (
      <p>
        Dengan menggunakan layanan Ludexa Store, Anda dianggap telah membaca dan menyetujui syarat
        &amp; ketentuan ini.
      </p>
    ),
  },
  {
    id: "s2",
    title: "Kebenaran data",
    body: (
      <p>
        Anda bertanggung jawab memastikan nomor tujuan dan nominal yang dimasukkan sudah benar.
        Kesalahan input nomor oleh pengguna berada di luar tanggung jawab kami.
      </p>
    ),
  },
  {
    id: "s3",
    title: "Pembayaran",
    body: (
      <ul>
        <li>Pembayaran via QRIS wajib sesuai dengan total yang tertera.</li>
        <li>Transaksi diproses setelah pembayaran berhasil diverifikasi.</li>
        <li>Simpan kode referensi sebagai bukti transaksi.</li>
      </ul>
    ),
  },
  {
    id: "s4",
    title: "Transaksi gagal & pengembalian dana",
    body: (
      <p>
        Jika transaksi gagal diproses setelah pembayaran terverifikasi, dana akan dikembalikan atau
        transaksi diproses ulang setelah konfirmasi dengan CS.
      </p>
    ),
  },
  {
    id: "s5",
    title: "Promo & voucher",
    body: (
      <p>
        Setiap promo memiliki syarat masing-masing dan dapat berubah atau berakhir sewaktu-waktu.
        Penyalahgunaan promo dapat menyebabkan transaksi dibatalkan.
      </p>
    ),
  },
  {
    id: "s6",
    title: "Larangan",
    body: (
      <p>
        Dilarang menggunakan layanan untuk aktivitas penipuan, pencucian uang, atau kegiatan yang
        melanggar hukum.
      </p>
    ),
  },
  {
    id: "s7",
    title: "Bantuan",
    body: (
      <p>
        Kendala transaksi dapat disampaikan melalui WhatsApp{" "}
        <a href={WA_LINK} target="_blank" rel="noopener" className="font-bold text-[#e0337a]">
          0857-1117-2317
        </a>{" "}
        dengan menyertakan kode referensi.
      </p>
    ),
  },
];

export default function SyaratKetentuanPage() {
  return (
    <LegalPage
      title="Syarat & Ketentuan"
      subtitle="Ketentuan penggunaan layanan Ludexa Store."
      current="Syarat & Ketentuan"
      other={{ label: "Kebijakan Privasi", href: "/kebijakan-privasi" }}
      sections={SECTIONS}
      updated="16 Oktober 2026"
    />
  );
}
