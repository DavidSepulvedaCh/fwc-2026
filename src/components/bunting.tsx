import { prisma } from "@/lib/prisma";
import { isoForFifa } from "@/lib/flag";
import { BuntingClient } from "./bunting-client";

/**
 * Bunting — tira decorativa de banderines triangulares con las selecciones
 * clasificadas, colgando de una cuerda sutil. Oscila con un viento ambiente
 * y reacciona al cursor como un ventilador que pasa (ver BuntingClient).
 */
export async function Bunting({ className }: { className?: string }) {
  const teams = await prisma.team.findMany({
    select: { code: true, nameEs: true },
    orderBy: { code: "asc" },
  });

  if (teams.length === 0) return null;

  const pennants = teams.map((t) => ({
    code: t.code,
    nameEs: t.nameEs,
    iso: isoForFifa(t.code),
  }));

  return <BuntingClient teams={pennants} className={className} />;
}
