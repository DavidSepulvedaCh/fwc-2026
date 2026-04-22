import Link from "next/link";
import {
  Award,
  CalendarCheck,
  Calculator,
  Goal,
  Swords,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { RecomputeButton } from "./recompute-button";

export default async function AdminHome() {
  const [matchCounts, userCount, predictionCount] = await Promise.all([
    prisma.match.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.user.count(),
    prisma.prediction.count(),
  ]);

  const byStatus = new Map(matchCounts.map((m) => [m.status, m._count._all]));
  const scheduled = byStatus.get("SCHEDULED") ?? 0;
  const live = byStatus.get("LIVE") ?? 0;
  const finished = byStatus.get("FINISHED") ?? 0;

  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-8">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Panel de administración
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resultados reales, premios oficiales y recálculo de puntaje.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<Users className="size-4" />} label="Usuarios" value={userCount} />
        <Stat icon={<Goal className="size-4" />} label="Predicciones" value={predictionCount} />
        <Stat icon={<CalendarCheck className="size-4" />} label="Programados" value={scheduled} />
        <Stat icon={<Swords className="size-4" />} label="Cerrados" value={finished + live} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <ActionCard
          href="/admin/matches"
          icon={<Swords className="size-4 text-primary" />}
          title="Resultados de partidos"
          description="Ingresa marcadores reales. En eliminatoria empatada, registra ganador (ET/pen)."
          cta="Ir a partidos"
        />
        <ActionCard
          href="/admin/awards"
          icon={<Award className="size-4 text-[color:var(--gold)]" />}
          title="Premios oficiales"
          description="Campeón, subcampeón, goleador, asistidor, mejor jugador y portero."
          cta="Ir a premios"
        />

        <Card className="sm:col-span-2 bg-card/70 backdrop-blur">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Calculator className="size-4 text-primary" />
            <CardTitle className="text-base">Recalcular puntaje</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <p className="text-muted-foreground">
              Después de cargar resultados o premios, corre el recálculo para actualizar el ranking.
            </p>
            <RecomputeButton />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/60 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[10px] uppercase tracking-[0.18em]">{label}</span>
      </div>
      <div className="mt-2 font-display text-3xl font-bold tabular-nums">
        {value}
      </div>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  description,
  cta,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <Card className="bg-card/70 backdrop-blur">
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        {icon}
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        <p className="text-muted-foreground">{description}</p>
        <Link href={href} className={buttonVariants({ size: "sm" })}>
          {cta}
        </Link>
      </CardContent>
    </Card>
  );
}
