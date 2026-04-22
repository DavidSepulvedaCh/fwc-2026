import Link from "next/link";
import {
  CalendarDays,
  History,
  LogOut,
  Settings,
  Shield,
  Swords,
  Trophy,
} from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/lib/actions/auth";
import { Brand } from "@/components/brand";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold tracking-tight"
        >
          <Brand size="md" />
          <span className="hidden text-sm text-muted-foreground sm:inline">
            Polla del Mundial
          </span>
        </Link>

        <nav className="flex items-center gap-1.5">
          <NavLink
            href="/fixtures"
            icon={<CalendarDays className="size-3.5" />}
            label="Calendario"
          />
          <NavLink
            href="/historia"
            icon={<History className="size-3.5" />}
            label="Historia"
          />
          {user ? (
            <>
              <NavLink
                href="/predictions"
                icon={<Swords className="size-3.5" />}
                label="Predicciones"
              />
              <NavLink
                href="/ranking"
                icon={<Trophy className="size-3.5" />}
                label="Ranking"
              />
              {user.role === "ADMIN" && (
                <NavLink
                  href="/admin"
                  icon={<Shield className="size-3.5" />}
                  label="Admin"
                />
              )}
              <UserMenu
                name={user.name ?? "Usuario"}
                email={user.email ?? null}
                image={user.image ?? null}
              />
            </>
          ) : (
            <>
              <Link
                href="/settings"
                className={buttonVariants({ variant: "ghost", size: "sm" }) + " gap-1.5"}
                aria-label="Preferencias"
              >
                <Settings className="size-3.5" />
                <span className="hidden sm:inline">Preferencias</span>
              </Link>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Entrar
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm" })}>
                Registrarme
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={buttonVariants({ variant: "ghost", size: "sm" }) + " gap-1.5"}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

function UserMenu({
  name,
  email,
  image,
}: {
  name: string;
  email: string | null;
  image: string | null;
}) {
  const initials =
    name
      .split(/\s+/)
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="ml-1 rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Menú de usuario"
          />
        }
      >
        <Avatar className="h-8 w-8 border border-border/60">
          {image && (
            <AvatarImage src={image} alt={name} referrerPolicy="no-referrer" />
          )}
          <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border/60">
              {image && (
                <AvatarImage
                  src={image}
                  alt={name}
                  referrerPolicy="no-referrer"
                />
              )}
              <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{name}</div>
              {email && (
                <div className="truncate text-xs font-normal text-muted-foreground">
                  {email}
                </div>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={
            <Link href="/settings" className="flex cursor-pointer items-center gap-2" />
          }
        >
          <Settings className="size-4" />
          Preferencias
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logoutAction}>
          <DropdownMenuItem
            nativeButton
            render={
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center gap-2"
              />
            }
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
