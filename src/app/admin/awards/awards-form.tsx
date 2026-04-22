"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveActualAwards, type AdminActionState } from "@/lib/actions/admin";

type TeamOption = { id: number; code: string; nameEs: string; groupLetter: string };

type Initial = {
  topScorerName: string | null;
  topAssistName: string | null;
  bestPlayerName: string | null;
  bestGoalkeeperName: string | null;
  championId: number | null;
  runnerUpId: number | null;
};

const INITIAL: AdminActionState = {};

export function AwardsForm({ teams, initial }: { teams: TeamOption[]; initial: Initial }) {
  const [state, formAction, pending] = useActionState(saveActualAwards, INITIAL);

  useEffect(() => {
    if (state.ok) toast.success("Premios guardados.");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campeón y subcampeón</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <TeamSelect
            id="championId"
            label="Campeón"
            teams={teams}
            defaultValue={initial.championId ?? ""}
          />
          <TeamSelect
            id="runnerUpId"
            label="Subcampeón"
            teams={teams}
            defaultValue={initial.runnerUpId ?? ""}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Premios individuales</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <TextField id="topScorerName" label="Goleador" defaultValue={initial.topScorerName ?? ""} />
          <TextField id="topAssistName" label="Mejor asistidor" defaultValue={initial.topAssistName ?? ""} />
          <TextField id="bestPlayerName" label="Mejor jugador" defaultValue={initial.bestPlayerName ?? ""} />
          <TextField id="bestGoalkeeperName" label="Mejor portero" defaultValue={initial.bestGoalkeeperName ?? ""} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando..." : "Guardar premios"}
        </Button>
      </div>
    </form>
  );
}

function TeamSelect({
  id,
  label,
  teams,
  defaultValue,
}: {
  id: string;
  label: string;
  teams: TeamOption[];
  defaultValue: number | "";
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={id}
        defaultValue={defaultValue}
        className="h-9 w-full rounded-md border bg-background px-3 text-sm shadow-sm"
      >
        <option value="">— Sin asignar —</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nameEs} ({t.code}, Grupo {t.groupLetter})
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({
  id,
  label,
  defaultValue,
}: {
  id: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type="text"
        defaultValue={defaultValue}
        maxLength={80}
        placeholder="Nombre del jugador"
      />
    </div>
  );
}
