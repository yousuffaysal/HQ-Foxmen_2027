import { sql } from "@/lib/db";
import HomeClient from "./HomeClient";

type DbService = { id:number; ord:number; name:string; descr:string; count:string; visible:boolean; badge:string|null; image:string|null };
type DbProject = { id:number; name:string; tagline:string; industry:string; year:string; scope:string; status:string; thumbnail:string; slug:string; color_cls:string; live_url:string; home_featured:boolean; home_order:number };
type DbClient  = { id:number; name:string; industry:string; country:string };
type DbTesti   = { id:number; quote:string; name:string; role:string; av:string; hi:string; rating:number; img:string };

export default async function Page() {
  const [svcRes, projRes, clientRes, testiRes] = await Promise.allSettled([
    sql`SELECT * FROM services WHERE visible = true ORDER BY ord ASC`,
    sql`SELECT id, name, tagline, industry, year, scope, status, thumbnail, slug, color_cls, live_url, home_featured, home_order FROM projects ORDER BY home_order ASC, id ASC`,
    sql`SELECT id, name, industry, country FROM clients ORDER BY id ASC`,
    sql`SELECT id, quote, name, role, av, hi, rating, img FROM testimonials WHERE visible = true ORDER BY id ASC`,
  ]);

  const services: DbService[] = svcRes.status === "fulfilled" ? svcRes.value as DbService[] : [];

  const allProjects: DbProject[] = projRes.status === "fulfilled" ? projRes.value as DbProject[] : [];
  const featured = allProjects.filter(p => p.home_featured);
  const projects: DbProject[] = featured.length > 0
    ? featured.sort((a, b) => a.home_order - b.home_order)
    : allProjects.filter(p => p.status === "live").slice(0, 6);

  const clients: DbClient[]  = clientRes.status === "fulfilled" ? clientRes.value as DbClient[] : [];
  const testis:  DbTesti[]   = testiRes.status  === "fulfilled" ? testiRes.value  as DbTesti[]  : [];

  return (
    <HomeClient
      initialServices={services}
      initialProjects={projects}
      initialClients={clients}
      initialTestis={testis}
    />
  );
}
