export type ServiceTone = "blue" | "purple" | "green" | "peach";

export type ServiceInputField = {
  key: string;
  label: string;
  placeholder: string;
  wajib: boolean;
};

export type Service = {
  id: string;
  dbId: string;
  n: string;
  t: ServiceTone;
  f: string;
  ph: string;
  inputs: ServiceInputField[];
  items?: [string, number, string][];
  bill?: boolean;
};

export type PaymentMethod = {
  id: string;
  name: string;
  fee: number;
  type: "qr" | "ew" | "va";
};

const ROUTES = new Set([
  "pulsa",
  "data",
  "pln",
  "pdam",
  "bpjs",
  "internet",
  "ewallet",
  "multifinance",
]);

const META: Record<string, { icon: string; tone: ServiceTone }> = {
  pulsa: { icon: "pulsa", tone: "blue" },
  data: { icon: "data", tone: "purple" },
  pln: { icon: "pln", tone: "green" },
  pdam: { icon: "pdam", tone: "peach" },
  bpjs: { icon: "bpjs", tone: "blue" },
  internet: { icon: "inet", tone: "purple" },
  ewallet: { icon: "wallet", tone: "green" },
  multifinance: { icon: "fin", tone: "peach" },
};

const FALLBACK_TONES: ServiceTone[] = ["blue", "purple", "green", "peach"];

export const svcUrl = (id: string) => (ROUTES.has(id) ? `/${id}` : "/bayar");

export function serviceMeta(slug: string, index = 0) {
  return (
    META[slug] ?? {
      icon: "wallet",
      tone: FALLBACK_TONES[index % FALLBACK_TONES.length],
    }
  );
}

export type PopularItem = {
  name: string;
  service: string;
  productId: string;
  price: number;
  href: string;
  icon: string;
  tone: ServiceTone;
};

export function buildPopular(
  services: Service[],
  limit = 4,
): PopularItem[] {
  return services
    .flatMap((service) => {
      const product = service.items?.[0];
      if (!product) return [];
      return [
        {
          name: product[0],
          service: service.n,
          productId: product[2],
          price: product[1],
          href: `${svcUrl(service.id)}?layanan=${encodeURIComponent(service.id)}`,
          icon: serviceMeta(service.id).icon,
          tone: service.t,
        },
      ];
    })
    .slice(0, limit);
}
