import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { CS_WA } from "@/lib/format";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Bagaimana Ludexa Store mengumpulkan, menggunakan, dan melindungi data Anda.",
  alternates: { canonical: "/kebijakan-privasi" },
  openGraph: {
    title: "Kebijakan Privasi — Ludexa Store",
    description: "Bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda.",
    url: "/kebijakan-privasi",
  },
};

const WA_LINK = `https://wa.me/${CS_WA}`;

const SECTIONS: LegalSection[] = [
  {
    id: "s1",
    title: "Data yang kami kumpulkan",
    body: (
      <ul>
        <li>Nomor tujuan transaksi (nomor HP, ID pelanggan, nomor meter, atau nomor kontrak).</li>
        <li>Detail transaksi: produk, nominal, metode pembayaran, dan waktu transaksi.</li>
        <li>Informasi yang Anda kirim saat menghubungi CS, misalnya bukti pembayaran.</li>
      </ul>
    ),
  },
  {
    id: "s2",
    title: "Penggunaan data",
    body: (
      <ul>
        <li>Memproses dan memverifikasi transaksi Anda.</li>
        <li>Menampilkan status dan riwayat transaksi.</li>
        <li>Memberikan bantuan layanan pelanggan.</li>
        <li>Mencegah penipuan dan penyalahgunaan layanan.</li>
      </ul>
    ),
  },
  {
    id: "s3",
    title: "Penyimpanan di perangkat",
    body: (
      <p>
        Riwayat transaksi dan kode voucher dapat disimpan di browser perangkat Anda (local storage)
        agar Anda bisa mengecek status dengan mudah. Data ini dapat Anda hapus kapan saja dengan
        membersihkan data browser.
      </p>
    ),
  },
  {
    id: "s4",
    title: "Berbagi data",
    body: (
      <p>
        Kami tidak menjual data pribadi Anda. Data hanya dibagikan kepada mitra yang diperlukan
        untuk menyelesaikan transaksi (misalnya penyedia layanan atau penyelenggara pembayaran),
        atau jika diwajibkan oleh hukum.
      </p>
    ),
  },
  {
    id: "s5",
    title: "Keamanan",
    body: (
      <p>
        Kami berupaya menjaga keamanan data Anda dengan langkah yang wajar. Jangan pernah
        membagikan PIN, kata sandi, atau kode OTP kepada siapa pun, termasuk yang mengaku sebagai
        CS kami.
      </p>
    ),
  },
  {
    id: "s6",
    title: "Hak Anda",
    body: (
      <p>
        Anda dapat meminta akses, koreksi, atau penghapusan data transaksi Anda dengan menghubungi
        CS kami.
      </p>
    ),
  },
  {
    id: "s7",
    title: "Perubahan kebijakan",
    body: <p>Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan akan ditampilkan di halaman ini.</p>,
  },
  {
    id: "s8",
    title: "Kontak",
    body: (
      <p>
        Pertanyaan seputar privasi: WhatsApp{" "}
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener"
          className="font-bold text-[#e0337a]"
        >
          0857-1117-2317
        </a>
      </p>
    ),
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <LegalPage
      title="Kebijakan Privasi"
      subtitle="Bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda."
      current="Kebijakan Privasi"
      other={{ label: "Syarat & Ketentuan", href: "/syarat-ketentuan" }}
      sections={SECTIONS}
      updated="16 Oktober 2026"
    />
  );
}
