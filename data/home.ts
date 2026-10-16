export type Popular = {
  badge: string;
  color: string;
  name: string;
  desc: string;
  old: string;
  now: string;
  href: string;
};

// Section "Lagi Laris" di halaman utama
export const POPULAR: Popular[] = [
  { badge: "DANA", color: "#118eea", name: "DANA", desc: "Top Up Saldo DANA", old: "Rp 50.000", now: "Rp 47.500", href: "/ewallet" },
  { badge: "OVO", color: "#4c2a86", name: "OVO", desc: "Top Up Saldo OVO", old: "Rp 50.000", now: "Rp 47.500", href: "/ewallet" },
  { badge: "GoPay", color: "#00aed6", name: "GoPay", desc: "Top Up Saldo GoPay", old: "Rp 50.000", now: "Rp 47.500", href: "/ewallet" },
  { badge: "TSEL", color: "#e4002b", name: "Pulsa Telkomsel", desc: "Pulsa Reguler", old: "Rp 50.000", now: "Rp 47.500", href: "/pulsa" },
];

// FAQ halaman utama
export const HOME_FAQ: { q: string; a: string }[] = [
  { q: "Berapa lama transaksi diproses?", a: "Setelah pembayaran terverifikasi, umumnya 1–5 menit." },
  { q: "Metode pembayaran apa saja?", a: "QRIS, transfer bank, dan e-wallet (DANA, OVO, GoPay)." },
  { q: "Bagaimana cara cek status transaksi?", a: "Masukkan kode referensi atau nomor tujuan di kolom Lacak Pesanan atau halaman Cek Transaksi." },
  { q: "Bagaimana jika transaksi gagal?", a: "Hubungi CS via WhatsApp dengan kode referensi, tim kami bantu cek dan proses." },
];
