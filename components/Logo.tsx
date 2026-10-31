export function Logo({
  dark = false,
  name = "Ludexa Store",
  logoUrl = null,
}: {
  dark?: boolean;
  name?: string;
  logoUrl?: string | null;
}) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const main = words[0] ?? "Ludexa";
  const sub = (words.slice(1).join(" ") || "Store").toUpperCase();

  return (
    <span className="inline-flex items-center gap-2 leading-none">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt=""
          width={40}
          height={42}
          className="h-[42px] w-[40px] shrink-0 object-contain"
        />
      ) : (
        <svg width="40" height="42" viewBox="0 0 40 42" aria-hidden="true">
          <path
            d="M13 13V10a7 7 0 0 1 14 0v3"
            fill="none"
            stroke={dark ? "#ffb3cf" : "#1f1630"}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M5 14h30l-2.4 22.5A5 5 0 0 1 27.6 41H12.4a5 5 0 0 1-5-4.5z"
            fill="#e0337a"
          />
          <path
            d="M14 25q6 7 12 0"
            fill="none"
            stroke="#fff"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="14" cy="20.5" r="1.8" fill="#fff" />
          <circle cx="26" cy="20.5" r="1.8" fill="#fff" />
        </svg>
      )}
      <span className="flex flex-col">
        <span
          className={
            "font-black text-[24px] tracking-tight italic " +
            (dark ? "text-white" : "text-[#1f1630]")
          }
        >
          {main}
        </span>
        <span
          className={
            "text-[9px] font-bold tracking-[.45em] mt-0.5 " +
            (dark ? "text-[#ffb3cf]" : "text-[#e0337a]")
          }
        >
          {sub}
        </span>
      </span>
    </span>
  );
}
