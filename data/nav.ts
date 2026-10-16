// Pil layanan di halaman utama (section #layanan)
export const PILLS: [string, string][] = [
  ["pulsa", "Pulsa"],
  ["data", "Paket Data"],
  ["pln", "Token PLN"],
  ["pdam", "PDAM"],
  ["bpjs", "BPJS Kesehatan"],
  ["inet", "Internet & TV"],
  ["wallet", "E-Wallet"],
];

// Peta kata kunci pencarian header → rute layanan
export const SEARCH_MAP: Record<string, string> = {
  pulsa: "/pulsa",
  data: "/data",
  kuota: "/data",
  internet: "/internet",
  tv: "/internet",
  pln: "/pln",
  listrik: "/pln",
  token: "/pln",
  pdam: "/pdam",
  air: "/pdam",
  bpjs: "/bpjs",
  dana: "/ewallet",
  ovo: "/ewallet",
  gopay: "/ewallet",
  shopee: "/ewallet",
  wallet: "/ewallet",
  "e-wallet": "/ewallet",
  cicilan: "/multifinance",
  multifinance: "/multifinance",
  game: "/bayar",
};
