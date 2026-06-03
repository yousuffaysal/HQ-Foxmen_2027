import { sql } from "@/lib/db";
import ServicesPage from "./ServicesClient";

export const dynamic = "force-dynamic";

type DbService = { id: number; name: string; descr: string; count: string; badge: string | null; image: string | null };

export default async function Page() {
  let services: DbService[] = [];
  try {
    services = await sql`SELECT id, name, descr, count, badge, image FROM services WHERE visible = true ORDER BY ord ASC` as DbService[];
  } catch { /* fallback to static services defined in ServicesClient */ }

  return <ServicesPage initialServices={services} />;
}
