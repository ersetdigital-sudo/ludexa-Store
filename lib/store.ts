// Penyimpanan transaksi & sementara di perangkat (localStorage / sessionStorage)
export type Tx = {
  ref: string;
  svc: string;
  prod: string;
  no: string;
  method: string;
  admin?: number;
  total: number;
  disc?: number;
  voucher?: string | null;
  time: string;
  status: string;
  sn?: string;
};

const safeGet = (fn: () => string | null) => {
  try {
    return fn();
  } catch {
    return null;
  }
};

export const TX = {
  all(): Tx[] {
    return JSON.parse(safeGet(() => localStorage.getItem("ldx_tx")) || "[]") as Tx[];
  },
  save(t: Tx) {
    const a = TX.all();
    a.unshift(t);
    try {
      localStorage.setItem("ldx_tx", JSON.stringify(a.slice(0, 30)));
    } catch {
      /* storage penuh */
    }
  },
};

export const setSvc = (v: string) => {
  try {
    localStorage.setItem("ldx_svc", v || "");
    sessionStorage.setItem("ldx_svc", v || "");
  } catch {
    /* storage tidak tersedia */
  }
};

export const getStored = (key: "ldx_svc" | "ldx_no" | "ldx_voucher" | "ldx_q") =>
  safeGet(() => localStorage.getItem(key)) ?? safeGet(() => sessionStorage.getItem(key)) ?? "";

export const removeKey = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* abaikan */
  }
};
