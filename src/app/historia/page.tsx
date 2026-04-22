import type { Metadata } from "next";
import { Calendar, MapPin, Trophy } from "lucide-react";
import { Flag } from "@/components/flag";
import { Badge } from "@/components/ui/badge";
import {
  EDITIONS,
  type Edition,
  getHostRanking,
  getTitleRanking,
  teamName,
  type HostCount,
  type TitleCount,
} from "@/lib/world-cups";

export const metadata: Metadata = {
  title: "Historia del Mundial",
  description:
    "Todas las ediciones de la Copa Mundial de Fútbol desde 1930: campeones, subcampeones, marcadores y países organizadores.",
  alternates: { canonical: "/historia" },
  openGraph: {
    title: "Historia del Mundial · Polla Mundial 2026",
    description:
      "Todas las ediciones de la Copa Mundial desde 1930, con campeones y sedes.",
    url: "/historia",
  },
};

export default function HistoriaPage() {
  const titles = getTitleRanking();
  const hosts = getHostRanking();
  const editionsDesc = [...EDITIONS].sort((a, b) => b.year - a.year);

  return (
    <main className="mx-auto max-w-6xl flex-1 space-y-14 px-4 py-10">
      <section className="relative space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
          <Trophy className="size-3.5 text-[color:var(--gold)]" />
          <span>1930 — 2022</span>
        </div>
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
          Historia del <span className="text-primary">Mundial</span>
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          {EDITIONS.length} ediciones, {titles.length} campeones distintos.
          Desde Montevideo 1930 hasta Lusail 2022 — todos los que levantaron
          la copa.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold">
          <Trophy className="size-5 text-[color:var(--gold)]" />
          Países con más títulos
        </h2>
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <Podium titles={titles} />
          <TitlesList titles={titles} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold">
          <MapPin className="size-5 text-primary" />
          Sedes más frecuentes
        </h2>
        <HostsList hosts={hosts} />
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold">
          <Calendar className="size-5 text-primary" />
          Todas las ediciones
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {editionsDesc.map((e) => (
            <EditionCard key={e.year} e={e} />
          ))}
        </ul>
      </section>
    </main>
  );
}

function Podium({ titles }: { titles: TitleCount[] }) {
  const [first, second, third] = titles;
  return (
    <div className="grid grid-cols-3 items-end gap-2 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur">
      <Pedestal rank={2} data={second} height="h-24" color="var(--silver)" />
      <Pedestal rank={1} data={first} height="h-32" color="var(--gold)" />
      <Pedestal rank={3} data={third} height="h-20" color="var(--bronze)" />
    </div>
  );
}

function Pedestal({
  rank,
  data,
  height,
  color,
}: {
  rank: number;
  data: TitleCount;
  height: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
        #{rank}
      </div>
      <Flag code={data.code} size="xl" className="!bg-contain !bg-center" />
      <div className="text-center">
        <div className="font-mono text-[10px] font-semibold text-muted-foreground">
          {data.code}
        </div>
        <div className="truncate text-xs font-medium">{data.name}</div>
      </div>
      <div
        className={`relative flex w-full items-center justify-center rounded-t-md border border-border/40 ${height}`}
        style={{
          backgroundColor: `color-mix(in oklab, ${color} 14%, transparent)`,
          borderColor: `color-mix(in oklab, ${color} 35%, transparent)`,
        }}
      >
        <div className="text-center">
          <div
            className="font-display text-3xl font-bold tabular-nums"
            style={{ color }}
          >
            {data.titles}
          </div>
          <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
            {data.titles === 1 ? "título" : "títulos"}
          </div>
        </div>
      </div>
    </div>
  );
}

function TitlesList({ titles }: { titles: TitleCount[] }) {
  return (
    <ol className="divide-y divide-border/40 rounded-xl border border-border/60 bg-card/60 px-1 backdrop-blur">
      {titles.map((t, i) => (
        <li key={t.code} className="flex items-center gap-3 px-3 py-2.5">
          <span className="w-5 text-center font-mono text-xs font-semibold text-muted-foreground">
            {i + 1}
          </span>
          <Flag code={t.code} size="md" />
          <div className="min-w-0 flex-1">
            <div className="font-medium leading-tight">{t.name}</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {t.years.join(" · ")}
            </div>
          </div>
          <div className="flex items-center gap-1 font-display text-xl font-bold tabular-nums text-[color:var(--gold)]">
            {t.titles}
            <Trophy className="size-4" />
          </div>
        </li>
      ))}
    </ol>
  );
}

function HostsList({ hosts }: { hosts: HostCount[] }) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {hosts.map((h) => (
        <li
          key={h.code}
          className="flex items-center gap-2.5 rounded-md border border-border/60 bg-card/60 px-3 py-2 backdrop-blur"
        >
          <Flag code={h.code} size="md" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium leading-tight">
              {h.name}
            </div>
            <div className="truncate text-[10px] text-muted-foreground">
              {h.years.join(" · ")}
            </div>
          </div>
          <span className="font-display text-base font-bold tabular-nums text-primary">
            {h.times}
          </span>
        </li>
      ))}
    </ul>
  );
}

function EditionCard({ e }: { e: Edition }) {
  return (
    <li className="group relative overflow-hidden rounded-xl border border-border/60 bg-card/60 backdrop-blur transition-colors hover:border-primary/30">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 font-display text-[5rem] font-black leading-none text-foreground/[0.06]"
      >
        {e.year}
      </div>

      <div className="relative space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-[10px]">
            #{e.editionNumber}
          </Badge>
          <span className="font-semibold text-foreground">{e.year}</span>
          <span>·</span>
          <MapPin className="size-3" />
          {e.hosts.map((h, i) => (
            <span key={h} className="inline-flex items-center gap-1">
              <Flag code={h} size="xs" />
              <span>{teamName(h)}</span>
              {i < e.hosts.length - 1 && (
                <span className="mx-0.5 text-muted-foreground/60">+</span>
              )}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right">
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--gold)]">
                Campeón
              </div>
              <div className="truncate font-display text-sm font-semibold">
                {teamName(e.champion)}
              </div>
            </div>
            <Flag
              code={e.champion}
              size="lg"
              className="!bg-contain !bg-center ring-2 ring-[color:var(--gold)]/40"
            />
          </div>

          <div className="flex shrink-0 flex-col items-center px-1">
            <div className="font-display text-lg font-bold tabular-nums">
              {e.scoreHome} <span className="text-muted-foreground">–</span>{" "}
              {e.scoreAway}
            </div>
            {e.decision && (
              <span className="rounded-sm border border-border/60 px-1 text-[9px] uppercase tracking-widest text-muted-foreground">
                {e.decision === "aet" ? "t. extra" : `pen ${e.penalties}`}
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Flag code={e.runnerUp} size="lg" className="!bg-contain !bg-center" />
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Subcampeón
              </div>
              <div className="truncate font-display text-sm font-semibold">
                {teamName(e.runnerUp)}
              </div>
            </div>
          </div>
        </div>

        {e.note && (
          <p className="border-l-2 border-border/60 pl-2 text-[11px] italic text-muted-foreground">
            {e.note}
          </p>
        )}
      </div>
    </li>
  );
}
