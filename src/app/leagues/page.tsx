import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Crown, Plus, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CreateLeagueForm, JoinLeagueForm } from "./forms";

export const metadata: Metadata = {
  title: "Mis ligas privadas",
  description: "Crea ligas privadas o únete con un código para competir con amigos y familia en la Polla Mundial 2026.",
  alternates: { canonical: "/leagues" },
};

export default async function LeaguesPage() {
  const user = await requireUser();

  const memberships = await prisma.leagueMember.findMany({
    where: { userId: user.id },
    include: {
      league: {
        include: {
          _count: { select: { members: true } },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Ligas privadas
        </h1>
        <p className="text-sm text-muted-foreground">
          Arma tu polla privada con la familia, la oficina o los panas. Cada liga tiene
          su propio ranking calculado con los mismos puntos.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="size-4 text-primary" />
              Crear una liga
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateLeagueForm />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4 text-primary" />
              Unirme con código
            </CardTitle>
          </CardHeader>
          <CardContent>
            <JoinLeagueForm />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold">
          Mis ligas ({memberships.length})
        </h2>

        {memberships.length === 0 ? (
          <Card className="border-dashed border-border/60 bg-card/30">
            <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
              <Users className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Todavía no estás en ninguna liga privada. Crea una o únete con un código.
              </p>
            </CardContent>
          </Card>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {memberships.map((m) => {
              const isOwner = m.league.ownerId === user.id;
              return (
                <li key={m.id}>
                  <Link
                    href={`/leagues/${m.league.slug}`}
                    className="group block rounded-xl outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Card className="h-full border-border/60 bg-card/60 transition-colors hover:border-primary/40 hover:bg-card">
                      <CardContent className="flex items-center justify-between gap-3 p-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-display text-base font-semibold">
                              {m.league.name}
                            </span>
                            {isOwner && (
                              <Badge variant="secondary" className="gap-1 text-[10px]">
                                <Crown className="size-3" />
                                Admin
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{m.league._count.members} {m.league._count.members === 1 ? "miembro" : "miembros"}</span>
                            <span>·</span>
                            <span className="font-mono">{m.league.code}</span>
                          </div>
                        </div>
                        <ArrowRight className="size-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/ranking"
          className={buttonVariants({ variant: "outline", size: "sm" }) + " gap-1.5"}
        >
          Ranking global
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </main>
  );
}
