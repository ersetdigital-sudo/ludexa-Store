import { getCatalog } from "@/lib/db/server";
import { Checkout } from "./Checkout";
import { DataUnavailable } from "./DataUnavailable";

export async function CheckoutSection({ fixedId }: { fixedId?: string }) {
  const result = await getCatalog();
  if (!result.data) {
    return <DataUnavailable message={result.error} />;
  }

  const { brand, services, methods } = result.data;
  if (services.length === 0 || methods.length === 0) {
    return (
      <DataUnavailable message="Katalog atau metode pembayaran belum tersedia untuk brand ini." />
    );
  }

  return (
    <Checkout
      fixedId={fixedId}
      services={services}
      methods={methods}
      brand={brand}
    />
  );
}
