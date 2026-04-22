"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function compute(target: Date): Parts | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff / 3_600_000) % 24);
  const minutes = Math.floor((diff / 60_000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function Countdown({ targetIso, label }: { targetIso: string; label: string }) {
  // Render an empty skeleton on first pass so SSR and the first client render
  // agree. The real values are computed in useEffect on the client only.
  const [parts, setParts] = useState<Parts | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const target = new Date(targetIso);
    setParts(compute(target));
    setMounted(true);
    const t = setInterval(() => setParts(compute(target)), 1000);
    return () => clearInterval(t);
  }, [targetIso]);

  if (!mounted) {
    return (
      <div className="grid grid-cols-4 gap-2 sm:gap-4" aria-hidden>
        <Cell value={0} label="días" />
        <Cell value={0} label="horas" />
        <Cell value={0} label="min" />
        <Cell value={0} label="seg" />
      </div>
    );
  }

  if (!parts) {
    return <p className="text-sm text-muted-foreground">{label} está en curso o ya ocurrió.</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      <Cell value={parts.days} label="días" />
      <Cell value={parts.hours} label="horas" />
      <Cell value={parts.minutes} label="min" />
      <Cell value={parts.seconds} label="seg" />
    </div>
  );
}

function Cell({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg border bg-card px-2 py-3 text-center sm:px-4 sm:py-4">
      <div className="text-2xl font-bold tabular-nums sm:text-4xl">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
        {label}
      </div>
    </div>
  );
}
