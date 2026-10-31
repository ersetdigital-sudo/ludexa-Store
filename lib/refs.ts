const KEY = "ldx_refs";
const LIMIT = 12;

export function readRefs(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(raw)
      ? raw.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

export function saveRef(ref: string) {
  if (!ref) return;
  const next = [ref, ...readRefs().filter((item) => item !== ref)].slice(
    0,
    LIMIT,
  );
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage penuh */
  }
}

export function removeRef(ref: string) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify(readRefs().filter((item) => item !== ref)),
    );
  } catch {
    /* abaikan */
  }
}
