"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LeagueCodeShare({
  leagueName,
  code,
}: {
  leagueName: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  const inviteText = `Te invito a mi polla privada "${leagueName}" para el Mundial 2026.\n\nUsa el código: ${code}\n\nEntra en https://polla-mundial.vercel.app/leagues y pega el código para unirte.`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Código copiado");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("No pudimos copiar el código");
    }
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: `Polla "${leagueName}"`,
          text: inviteText,
        });
        return;
      } catch {
        // user cancelled or not supported
      }
    }
    // Fallback: copy invite text
    try {
      await navigator.clipboard.writeText(inviteText);
      toast.success("Invitación copiada al portapapeles");
    } catch {
      toast.error("No pudimos compartir");
    }
  };

  return (
    <Card className="border-border/60 bg-card/70 backdrop-blur">
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Código de invitación
        </div>
        <div className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/50 px-3 py-2">
          <span className="font-mono text-lg font-bold tracking-[0.2em] text-primary">
            {code}
          </span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={copy}
            className="gap-1.5"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copiado" : "Copiar"}</span>
          </Button>
        </div>
        <Button type="button" onClick={share} variant="outline" size="sm" className="gap-1.5">
          <Share2 className="size-3.5" />
          Compartir invitación
        </Button>
      </CardContent>
    </Card>
  );
}
