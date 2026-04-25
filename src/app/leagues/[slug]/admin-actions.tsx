"use client";

import { LogOut, Trash2 } from "lucide-react";
import { deleteLeagueAction, leaveLeagueAction } from "@/lib/actions/leagues";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LeagueAdminActions({
  leagueId,
  isOwner,
}: {
  leagueId: string;
  isOwner: boolean;
}) {
  return (
    <Card className="border-border/60 bg-card/70 backdrop-blur">
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {isOwner ? "Administración" : "Membresía"}
        </div>

        {isOwner ? (
          <form
            action={deleteLeagueAction}
            onSubmit={(e) => {
              if (
                !confirm(
                  "¿Seguro que quieres eliminar esta liga? Esta acción no se puede deshacer.",
                )
              ) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="leagueId" value={leagueId} />
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="w-full gap-1.5 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" />
              Eliminar liga
            </Button>
          </form>
        ) : (
          <form
            action={leaveLeagueAction}
            onSubmit={(e) => {
              if (!confirm("¿Salir de esta liga?")) e.preventDefault();
            }}
          >
            <input type="hidden" name="leagueId" value={leagueId} />
            <Button type="submit" variant="outline" size="sm" className="w-full gap-1.5">
              <LogOut className="size-3.5" />
              Salir de la liga
            </Button>
          </form>
        )}

        <p className="text-[11px] text-muted-foreground">
          {isOwner
            ? "Como admin puedes eliminar la liga. Los miembros pueden salir cuando quieran."
            : "Si sales pierdes acceso al ranking privado. Puedes volver a unirte con el código."}
        </p>
      </CardContent>
    </Card>
  );
}
