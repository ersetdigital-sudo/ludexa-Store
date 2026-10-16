export type Service = {
  id: string;
  n: string;
  t: "blue" | "purple" | "green" | "peach";
  f: string;
  ph: string;
  items?: [string, number][];
  bill?: boolean;
};

export const SERVICES: Service[] = [
  { id: "pulsa", n: "Pulsa", t: "blue", f: "Nomor HP", ph: "08xx xxxx xxxx", items: [["Pulsa 10.000", 11500], ["Pulsa 25.000", 26000], ["Pulsa 50.000", 50500], ["Pulsa 100.000", 99000]] },
  { id: "data", n: "Paket Data", t: "purple", f: "Nomor HP", ph: "08xx xxxx xxxx", items: [["5 GB / 30 hari", 35000], ["12 GB / 30 hari", 60000], ["25 GB / 30 hari", 95000], ["Unlimited Harian", 120000]] },
  { id: "pln", n: "Token PLN", t: "green", f: "ID Pelanggan / No. Meter", ph: "11 digit nomor meter", items: [["Token 20.000", 21500], ["Token 50.000", 51500], ["Token 100.000", 101500], ["Token 200.000", 201500]] },
  { id: "pdam", n: "PDAM", t: "peach", f: "Nomor Pelanggan", ph: "Nomor pelanggan PDAM", bill: true },
  { id: "bpjs", n: "BPJS", t: "blue", f: "Nomor VA Keluarga", ph: "8888 xxxx xxxx xxxx", bill: true },
  { id: "inet", n: "Internet & TV", t: "purple", f: "ID Pelanggan", ph: "ID pelanggan provider", bill: true },
  { id: "wallet", n: "E-Wallet", t: "green", f: "Nomor HP terdaftar", ph: "08xx xxxx xxxx", items: [["Top up 50.000", 51000], ["Top up 100.000", 101000], ["Top up 200.000", 201000], ["Top up 500.000", 501000]] },
  { id: "fin", n: "Multifinance", t: "peach", f: "Nomor Kontrak", ph: "Nomor kontrak cicilan", bill: true },
];

const ROUTE: Record<string, string> = {
  pulsa: "pulsa",
  data: "data",
  pln: "pln",
  pdam: "pdam",
  bpjs: "bpjs",
  inet: "internet",
  wallet: "ewallet",
  fin: "multifinance",
};

export const svcUrl = (id: string) => "/" + (ROUTE[id] || "bayar");

export const svcById = (id?: string | null) => SERVICES.find((s) => s.id === id);
export const svcByName = (n: string) => SERVICES.find((s) => s.n === n);
