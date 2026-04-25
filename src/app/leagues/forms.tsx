"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Send } from "lucide-react";
import {
  createLeagueAction,
  joinLeagueAction,
  type LeagueActionState,
} from "@/lib/actions/leagues";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BallSpinner } from "@/components/brand";

const INITIAL: LeagueActionState = {};

export function CreateLeagueForm() {
  const [state, action, pending] = useActionState(createLeagueAction, INITIAL);

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={action} className="flex flex-col gap-2">
      <Input
        name="name"
        placeholder="Ej: Polla Familia Sepúlveda"
        required
        minLength={3}
        maxLength={40}
      />
      <Button type="submit" disabled={pending} className="gap-1.5">
        {pending ? <BallSpinner className="size-3.5" /> : <Plus className="size-3.5" />}
        {pending ? "Creando..." : "Crear liga"}
      </Button>
      <p className="text-[11px] text-muted-foreground">
        Serás el administrador y obtendrás un código para invitar.
      </p>
    </form>
  );
}

export function JoinLeagueForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(joinLeagueAction, INITIAL);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.ok && state.redirectTo) {
      toast.success("¡Bienvenido a la liga!");
      router.push(state.redirectTo);
    }
  }, [state, router]);

  return (
    <form action={action} className="flex flex-col gap-2">
      <Input
        name="code"
        placeholder="CODIGO-LIGA"
        required
        minLength={4}
        maxLength={12}
        autoCapitalize="characters"
        className="font-mono uppercase tracking-wider"
      />
      <Button type="submit" disabled={pending} variant="outline" className="gap-1.5">
        {pending ? <BallSpinner className="size-3.5" /> : <Send className="size-3.5" />}
        {pending ? "Entrando..." : "Unirme"}
      </Button>
      <p className="text-[11px] text-muted-foreground">
        Pídele el código al admin de la liga (8 caracteres).
      </p>
    </form>
  );
}
