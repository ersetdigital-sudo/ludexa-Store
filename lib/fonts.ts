import localFont from "next/font/local";

// Plus Jakarta Sans self-hosted (semua weight seperti HTML asli)
export const pjs = localFont({
  src: [
    { path: "../fonts/plusjakartasans-extralight.ttf", weight: "200", style: "normal" },
    { path: "../fonts/plusjakartasans-extralightitalic.ttf", weight: "200", style: "italic" },
    { path: "../fonts/plusjakartasans-light.ttf", weight: "300", style: "normal" },
    { path: "../fonts/plusjakartasans-lightitalic.ttf", weight: "300", style: "italic" },
    { path: "../fonts/plusjakartasans-regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/plusjakartasans-italic.ttf", weight: "400", style: "italic" },
    { path: "../fonts/plusjakartasans-medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/plusjakartasans-mediumitalic.ttf", weight: "500", style: "italic" },
    { path: "../fonts/plusjakartasans-semibold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/plusjakartasans-semibolditalic.ttf", weight: "600", style: "italic" },
    { path: "../fonts/plusjakartasans-bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/plusjakartasans-bolditalic.ttf", weight: "700", style: "italic" },
    { path: "../fonts/plusjakartasans-extrabold.ttf", weight: "800", style: "normal" },
    { path: "../fonts/plusjakartasans-extrabolditalic.ttf", weight: "800", style: "italic" },
  ],
  variable: "--font-pjs",
  display: "swap",
  preload: false,
});
