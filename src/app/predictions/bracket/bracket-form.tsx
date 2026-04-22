"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Lock, Medal, Save, Swords, Trophy } from "lucide-react";
import { BallSpinner } from "@/components/brand";
import { fireConfetti } from "@/lib/confetti";
import {
  saveKnockoutPredictions,
  type SavePredictionsState,
} from "@/lib/actions/predictions";
import {
  resolveKnockout,
  type KnockoutMatchInput,
  type Standing,
} from "@/lib/bracket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Flag } from "@/components/flag";
import { cn } from "@/lib/utils";
import type { Stage } from "@/generated/prisma/enums";
import { formatDate } from "@/lib/datetime";
import type { DatePrefs } from "@/lib/timezone";

export type TeamLite = { id: number; code: string; nameEs: string };

export type BracketRow = {
  id: number;
  matchNumber: number;
  stage: Stage;
  dateIso: string;
  venue: string;
  city: string;
  homePlaceholder: string | null;
  awayPlaceholder: string | null;
  initialHomeScore: number | null;
  initialAwayScore: number | null;
  initialWinnerId: number | null;
  locked: boolean;
  actual: { homeScore: number; awayScore: number } | null;
};

type FieldState = { home: string; away: string; winner: string };

const STAGE_LABEL: Record<Stage, string> = {
  GROUP: "Grupos",
  R32: "Dieciseisavos",
  R16: "Octavos",
  QF: "Cuartos",
  SF: "Semifinal",
  TP: "Tercer puesto",
  FINAL: "Final",
};

// Bracket layout: match numbers per side & round, top-to-bottom.
// Derived from the official FIFA 2026 bracket structure.
const LEFT = {
  R32: [74, 77, 73, 75, 83, 84, 81, 82],
  R16: [89, 90, 93, 94],
  QF: [97, 98],
  SF: [101],
};
const RIGHT = {
  R32: [76, 78, 79, 80, 86, 88, 85, 87],
  R16: [91, 92, 95, 96],
  QF: [99, 100],
  SF: [102],
};

const INITIAL_FORM_STATE: SavePredictionsState = {};

export function BracketForm({
  rows,
  teams,
  standings,
  prefs,
}: {
  rows: BracketRow[];
  teams: TeamLite[];
  standings: Standing[];
  prefs: DatePrefs;
}) {
  const teamById = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams]);

  // One field-state entry per match, driven by the user's live inputs.
  const [fields, setFields] = useState<Record<number, FieldState>>(() => {
    const init: Record<number, FieldState> = {};
    for (const r of rows) {
      init[r.id] = {
        home: r.initialHomeScore === null ? "" : String(r.initialHomeScore),
        away: r.initialAwayScore === null ? "" : String(r.initialAwayScore),
        winner: r.initialWinnerId === null ? "" : String(r.initialWinnerId),
      };
    }
    return init;
  });

  const updateField = (id: number, key: keyof FieldState, value: string) =>
    setFields((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }));

  // Recompute bracket resolutions every time the user changes a value.
  const resolutions = useMemo(() => {
    const toNum = (s: string): number | null =>
      s === "" || s === null ? null : Number(s);
    const inputs: KnockoutMatchInput[] = rows.map((r) => ({
      id: r.id,
      matchNumber: r.matchNumber,
      homePlaceholder: r.homePlaceholder,
      awayPlaceholder: r.awayPlaceholder,
      predictedHome: toNum(fields[r.id]?.home ?? ""),
      predictedAway: toNum(fields[r.id]?.away ?? ""),
      predictedWinnerId: toNum(fields[r.id]?.winner ?? ""),
    }));
    return resolveKnockout(standings, inputs);
  }, [rows, fields, standings]);

  const resolvedById = useMemo(
    () => new Map(resolutions.map((r) => [r.matchId, r])),
    [resolutions],
  );

  const [serverState, formAction, pending] = useActionState(
    saveKnockoutPredictions,
    INITIAL_FORM_STATE,
  );

  useEffect(() => {
    if (serverState.ok && serverState.savedCount !== undefined) {
      if (serverState.savedCount === 0) toast.info("No hay cambios para guardar.");
      else {
        toast.success(
          `Guardado (${serverState.savedCount} ${serverState.savedCount === 1 ? "partido" : "partidos"}).`,
        );
        fireConfetti();
      }
    } else if (serverState.error) {
      toast.error(serverState.error);
    }
  }, [serverState]);

  const rowByNumber = useMemo(
    () => new Map(rows.map((r) => [r.matchNumber, r])),
    [rows],
  );
  const pick = (ns: number[]) =>
    ns.map((n) => rowByNumber.get(n)).filter(Boolean) as BracketRow[];
  const final = rows.find((r) => r.stage === "FINAL");
  const thirdPlace = rows.find((r) => r.stage === "TP");

  // Helper used by each card to resolve the "live" home/away teams.
  const teamsFor = (row: BracketRow) => {
    const r = resolvedById.get(row.id);
    return {
      home: r?.homeTeamId ? teamById.get(r.homeTeamId) ?? null : null,
      away: r?.awayTeamId ? teamById.get(r.awayTeamId) ?? null : null,
    };
  };

  const cardProps = (row: BracketRow) => ({
    row,
    field: fields[row.id] ?? { home: "", away: "", winner: "" },
    live: teamsFor(row),
    onChange: updateField,
    prefs,
  });

  return (
    <form action={formAction} className="space-y-6">
      {serverState.error && (
        <Alert variant="destructive">
          <AlertDescription>{serverState.error}</AlertDescription>
        </Alert>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur sm:p-6">
        <div className="grid min-w-[1200px] grid-cols-[220px_220px_220px_220px_280px_220px_220px_220px_220px] gap-4">
          <BracketColumn
            side="left"
            title={STAGE_LABEL.R32}
            items={pick(LEFT.R32).map(cardProps)}
          />
          <BracketColumn
            side="left"
            title={STAGE_LABEL.R16}
            items={pick(LEFT.R16).map(cardProps)}
          />
          <BracketColumn
            side="left"
            title={STAGE_LABEL.QF}
            items={pick(LEFT.QF).map(cardProps)}
          />
          <BracketColumn
            side="left"
            title={STAGE_LABEL.SF}
            items={pick(LEFT.SF).map(cardProps)}
          />

          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                <Trophy className="size-3.5" />
                <span>Final</span>
              </div>
              {final && <MatchCard {...cardProps(final)} variant="final" />}
              {final && <ChampionBanner row={final} live={teamsFor(final)} field={fields[final.id] ?? { home: "", away: "", winner: "" }} />}
            </div>

            {thirdPlace && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--bronze)]">
                  <Medal className="size-3.5" />
                  <span>Tercer puesto</span>
                </div>
                <MatchCard {...cardProps(thirdPlace)} variant="third" />
              </div>
            )}
          </div>

          <BracketColumn
            side="right"
            title={STAGE_LABEL.SF}
            items={pick(RIGHT.SF).map(cardProps)}
          />
          <BracketColumn
            side="right"
            title={STAGE_LABEL.QF}
            items={pick(RIGHT.QF).map(cardProps)}
          />
          <BracketColumn
            side="right"
            title={STAGE_LABEL.R16}
            items={pick(RIGHT.R16).map(cardProps)}
          />
          <BracketColumn
            side="right"
            title={STAGE_LABEL.R32}
            items={pick(RIGHT.R32).map(cardProps)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-card/60 p-3">
        <p className="text-xs text-muted-foreground">
          Al escribir un marcador el ganador avanza al siguiente cruce. Guarda cuando termines.
        </p>
        <Button type="submit" disabled={pending} className="gap-1.5">
          {pending ? (
            <BallSpinner className="size-3.5" />
          ) : (
            <Save className="size-3.5" />
          )}
          {pending ? "Guardando..." : "Guardar bracket"}
        </Button>
      </div>
    </form>
  );
}

type CardProps = {
  row: BracketRow;
  field: FieldState;
  live: { home: TeamLite | null; away: TeamLite | null };
  onChange: (id: number, key: keyof FieldState, value: string) => void;
  prefs: DatePrefs;
};

function BracketColumn({
  side,
  title,
  items,
}: {
  side: "left" | "right";
  title: string;
  items: CardProps[];
}) {
  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground",
          side === "right" && "justify-end",
        )}
      >
        {side === "left" && <Swords className="size-3.5" />}
        <span>{title}</span>
        {side === "right" && <Swords className="size-3.5" />}
      </div>
      <ul className="flex flex-1 flex-col justify-around gap-3">
        {items.map((c) => (
          <li key={c.row.id}>
            <MatchCard {...c} side={side} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function MatchCard({
  row,
  field,
  live,
  onChange,
  side,
  variant,
  prefs,
}: CardProps & {
  side?: "left" | "right";
  variant?: "final" | "third";
}) {
  const canEdit = !row.locked && !!live.home && !!live.away;

  const date = new Date(row.dateIso);
  const dateLabel = formatDate(date, prefs, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const homeNum = field.home === "" ? null : Number(field.home);
  const awayNum = field.away === "" ? null : Number(field.away);
  const isTie = homeNum !== null && awayNum !== null && homeNum === awayNum;

  const liveWinnerId: number | null = (() => {
    if (!live.home || !live.away) return null;
    if (homeNum === null || awayNum === null) return null;
    if (homeNum > awayNum) return live.home.id;
    if (homeNum < awayNum) return live.away.id;
    const wId = field.winner === "" ? null : Number(field.winner);
    if (wId === live.home.id || wId === live.away.id) return wId;
    return null;
  })();

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card/80 backdrop-blur transition-colors",
        variant === "final"
          ? "border-primary/40 shadow-[0_0_32px_-8px_oklch(0.74_0.18_162/0.5)]"
          : "border-border/60 hover:border-primary/30",
        variant === "third" && "border-[color:var(--bronze)]/40",
      )}
    >
      {variant === "final" && (
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
      )}

      <div className="flex items-center justify-between border-b border-border/40 bg-background/30 px-2.5 py-1 text-[10px] text-muted-foreground">
        <span className="font-mono font-semibold">#{row.matchNumber}</span>
        <span>{dateLabel}</span>
      </div>

      <div className="divide-y divide-border/40">
        <TeamRow
          team={live.home}
          placeholder={row.homePlaceholder}
          inputName={`match-${row.id}-home`}
          value={field.home}
          onChange={(v) => onChange(row.id, "home", v)}
          disabled={!canEdit}
          isWinner={liveWinnerId !== null && live.home?.id === liveWinnerId}
          actualScore={row.actual?.homeScore ?? null}
        />
        <TeamRow
          team={live.away}
          placeholder={row.awayPlaceholder}
          inputName={`match-${row.id}-away`}
          value={field.away}
          onChange={(v) => onChange(row.id, "away", v)}
          disabled={!canEdit}
          isWinner={liveWinnerId !== null && live.away?.id === liveWinnerId}
          actualScore={row.actual?.awayScore ?? null}
        />
      </div>

      {live.home && live.away && canEdit && isTie && (
        <div className="border-t border-[color:var(--accent)]/40 bg-accent/10 px-2 py-1">
          <label className="flex items-center justify-between gap-1.5 text-[10px] font-medium text-accent-foreground/80">
            <span className="truncate uppercase tracking-wider">
              Empate → ganador
            </span>
            <select
              name={`match-${row.id}-winner`}
              value={field.winner}
              onChange={(e) => onChange(row.id, "winner", e.target.value)}
              className="h-6 max-w-[96px] flex-1 rounded border border-border/60 bg-background px-1.5 text-[11px] text-foreground"
            >
              <option value="">—</option>
              <option value={live.home.id}>{live.home.code}</option>
              <option value={live.away.id}>{live.away.code}</option>
            </select>
          </label>
        </div>
      )}

      {row.actual ? (
        <div className="border-t border-border/40 bg-primary/5 px-2.5 py-1 text-[10px] font-medium text-primary">
          Resultado final
        </div>
      ) : row.locked ? (
        <div className="flex items-center gap-1 border-t border-border/40 bg-muted/30 px-2.5 py-1 text-[10px] text-muted-foreground">
          <Lock className="size-3" />
          En curso o bloqueado
        </div>
      ) : null}

      {/* Intentional to keep form layout stable even when we swap sides */}
      {side && side === "right" ? null : null}
    </div>
  );
}

function TeamRow({
  team,
  placeholder,
  inputName,
  value,
  onChange,
  disabled,
  isWinner,
  actualScore,
}: {
  team: TeamLite | null;
  placeholder: string | null;
  inputName: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  isWinner: boolean;
  actualScore: number | null;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 px-2 py-1.5 transition-colors",
        isWinner && "bg-primary/10",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {team ? (
          <>
            <Flag code={team.code} size="sm" />
            <span
              className={cn(
                "truncate font-display text-sm font-semibold",
                isWinner && "text-primary",
              )}
            >
              {team.code}
            </span>
          </>
        ) : (
          <>
            <div className="h-4 w-6 rounded-[2px] border border-dashed border-border/50 bg-muted/30" />
            <span className="truncate font-mono text-[11px] text-muted-foreground">
              {placeholder ?? "TBD"}
            </span>
          </>
        )}
      </div>
      <Input
        type="number"
        inputMode="numeric"
        min={0}
        max={20}
        name={inputName}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-7 w-10 text-center text-sm font-semibold tabular-nums"
        aria-label={`Goles ${team?.code ?? placeholder ?? ""}`}
      />
      {actualScore !== null && (
        <span className="font-mono text-[10px] font-medium text-primary">
          ({actualScore})
        </span>
      )}
    </div>
  );
}

/**
 * Little celebration block shown under the Final card — displays the live
 * predicted champion as the user types.
 */
function ChampionBanner({
  row,
  live,
  field,
}: {
  row: BracketRow;
  live: { home: TeamLite | null; away: TeamLite | null };
  field: FieldState;
}) {
  const homeNum = field.home === "" ? null : Number(field.home);
  const awayNum = field.away === "" ? null : Number(field.away);

  let champion: TeamLite | null = null;
  if (live.home && live.away && homeNum !== null && awayNum !== null) {
    if (homeNum > awayNum) champion = live.home;
    else if (homeNum < awayNum) champion = live.away;
    else {
      const wId = field.winner === "" ? null : Number(field.winner);
      if (wId === live.home.id) champion = live.home;
      else if (wId === live.away.id) champion = live.away;
    }
  }

  if (!champion) return null;

  return (
    <div className="mt-1 flex items-center gap-2 rounded-md border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 px-3 py-2">
      <Trophy className="size-4 text-[color:var(--gold)]" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
        Tu campeón
      </span>
      <Flag code={champion.code} size="sm" />
      <span className="font-display text-sm font-semibold">{champion.code}</span>
    </div>
  );
}
