import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const ROUTES = [
  "/",
  "/pulsa",
  "/data",
  "/pln",
  "/pdam",
  "/bpjs",
  "/internet",
  "/ewallet",
  "/multifinance",
  "/bayar",
  "/cek",
  "/bantuan",
  "/tentang",
  "/kebijakan-privasi",
  "/syarat-ketentuan",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((r) => ({
    url: SITE_URL + r,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: r === "/" ? 1 : 0.7,
  }));
}
