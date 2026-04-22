import Link from "next/link";
import {
  CalendarClock,
  Flag as FlagIcon,
  Goal,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { buttonVariants } from "@/components/ui/button";
import { Countdown } from "@/components/countdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag } from "@/components/flag";
import { SoccerBall } from "@/components/brand";
import { Bunting } from "@/components/bunting";

export default async function HomePage() {
  const [user, firstMatch, counts] = await Promise.all([
    getCurrentUser(),
    prisma.match.findFirst({
      orderBy: { date: "asc" },
      include: { homeTeam: true, awayTeam: true },
    }),
    getCounts(),
  ]);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Polla Mundial 2026",
        inLanguage: "es",
        description:
          "Polla del Mundial de Fútbol 2026: predice marcadores, arma tu bracket y compite con tus amigos.",
      },
      {
        "@type": "SportsEvent",
        name: "Copa Mundial de la FIFA 2026",
        startDate: "2026-06-11",
        endDate: "2026-07-19",
        sport: "Fútbol",
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode:
          "https://schema.org/OfflineEventAttendanceMode",
        location: [
          { "@type": "Country", name: "Estados Unidos" },
          { "@type": "Country", name: "Canadá" },
          { "@type": "Country", name: "México" },
        ],
        organizer: {
          "@type": "Organization",
          name: "FIFA",
          url: "https://www.fifa.com",
        },
      },
    ],
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Bunting className="mx-auto max-w-6xl px-2 pt-3" />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-dots opacity-60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
              <FlagIcon className="size-3.5 text-primary" />
              <span>USA · Canadá · México</span>
            </div>

            <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
              Polla <span className="text-primary">Mundial</span>
              <br />
              2026
            </h1>

            <p className="text-lg text-muted-foreground sm:text-xl">
              Predice los {counts.matches} partidos, arma tu bracket y pelea por
              el trofeo con tus amigos.
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {user ? (
                <>
                  <Link
                    href="/predictions"
                    className={buttonVariants({ size: "lg" }) + " gap-2"}
                  >
                    <Goal className="size-4" /> Mis predicciones
                  </Link>
                  <Link
                    href="/predictions/bracket"
                    className={
                      buttonVariants({ size: "lg", variant: "outline" }) +
                      " gap-2"
                    }
                  >
                    <Trophy className="size-4" /> Ver bracket
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className={buttonVariants({ size: "lg" }) + " gap-2"}
                  >
                    <SoccerBall className="size-4" /> Empezar ahora
                  </Link>
                  <Link
                    href="/login"
                    className={buttonVariants({ size: "lg", variant: "outline" })}
                  >
                    Ya tengo cuenta
                  </Link>
                </>
              )}
            </div>
          </div>

          {firstMatch && (
            <div className="mx-auto mt-14 max-w-2xl">
              <Card className="relative overflow-hidden border-primary/20 bg-card/70 backdrop-blur">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                <CardHeader className="pb-2 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <CalendarClock className="size-3.5" />
                    El Mundial arranca en
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <Countdown
                    targetIso={firstMatch.date.toISOString()}
                    label="El primer partido"
                  />
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <TeamBadge
                      code={firstMatch.homeTeam?.code}
                      name={firstMatch.homeTeam?.nameEs}
                    />
                    <span className="font-display text-xl text-muted-foreground">
                      vs
                    </span>
                    <TeamBadge
                      code={firstMatch.awayTeam?.code}
                      name={firstMatch.awayTeam?.nameEs}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3" />
                    {firstMatch.venue}, {firstMatch.city}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={<Users className="size-4" />} value={counts.users} label={counts.users === 1 ? "Participante" : "Participantes"} />
            <Stat icon={<FlagIcon className="size-4" />} value={counts.teams} label="Equipos" />
            <Stat icon={<Goal className="size-4" />} value={counts.matches} label="Partidos" />
            <Stat icon={<Trophy className="size-4" />} value={counts.groups} label="Grupos" />
          </div>
        </div>
      </section>
    </main>
  );
}

function TeamBadge({
  code,
  name,
}: {
  code: string | null | undefined;
  name: string | null | undefined;
}) {
  return (
    <div className="flex items-center gap-2">
      <Flag code={code} size="md" />
      <div className="text-left">
        <div className="font-display text-base font-semibold leading-tight">
          {code ?? "—"}
        </div>
        <div className="text-[11px] text-muted-foreground">{name ?? "—"}</div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/70 p-4 backdrop-blur">
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

async function getCounts() {
  const [teams, groups, matches, users] = await Promise.all([
    prisma.team.count(),
    prisma.group.count(),
    prisma.match.count(),
    prisma.user.count(),
  ]);
  return { teams, groups, matches, users };
}
