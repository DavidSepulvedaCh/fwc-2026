import type { Metadata } from "next";
import { Newspaper, ExternalLink, AlertCircle } from "lucide-react";
import { getWorldCupNews, type NewsArticle } from "@/lib/news";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Noticias del Mundial 2026",
  description:
    "Últimas noticias, fichajes, convocatorias y análisis camino al Mundial 2026.",
  alternates: { canonical: "/noticias" },
  openGraph: {
    title: "Noticias del Mundial 2026",
    description:
      "Lo último sobre selecciones, sedes y el camino al Mundial 2026.",
    url: "/noticias",
  },
};

export const revalidate = 1800;

export default async function NoticiasPage() {
  const { articles, error } = await getWorldCupNews(18);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Newspaper className="size-5" />
        </div>
        <div>
          <h1 className="font-heading text-2xl leading-tight">Noticias</h1>
          <p className="text-sm text-muted-foreground">
            Lo último camino al Mundial 2026. Se actualiza cada 30 minutos.
          </p>
        </div>
      </header>

      {error === "missing-key" && (
        <Alert className="mb-6">
          <AlertCircle className="size-4" />
          <AlertTitle>Configura GNews</AlertTitle>
          <AlertDescription>
            Agrega <code className="rounded bg-muted px-1">GNEWS_API_KEY</code>{" "}
            en tu <code className="rounded bg-muted px-1">.env</code>. Obtén una
            llave gratuita en{" "}
            <a
              href="https://gnews.io"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              gnews.io
            </a>{" "}
            (100 req/día en el tier free).
          </AlertDescription>
        </Alert>
      )}

      {error === "fetch-failed" && (
        <Alert className="mb-6">
          <AlertCircle className="size-4" />
          <AlertTitle>No pudimos cargar las noticias</AlertTitle>
          <AlertDescription>
            Intenta de nuevo en unos minutos.
          </AlertDescription>
        </Alert>
      )}

      {!error && articles.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Aún no hay noticias recientes.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <NewsCard key={a.url} article={a} />
        ))}
      </div>
    </main>
  );
}

function NewsCard({ article }: { article: NewsArticle }) {
  const published = new Date(article.publishedAt);
  const relative = formatRelative(published);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group block"
    >
      <Card className="h-full transition hover:ring-primary/40">
        {article.image ? (
          // Using plain <img> on purpose: news images come from dozens of
          // publisher CDNs and whitelisting every hostname in next.config
          // is not worth it for an external feed.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image}
            alt=""
            loading="lazy"
            className="aspect-[16/9] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[16/9] w-full items-center justify-center bg-muted">
            <Newspaper className="size-8 text-muted-foreground/50" />
          </div>
        )}
        <CardHeader>
          <CardTitle className="line-clamp-2 group-hover:text-primary">
            {article.title}
          </CardTitle>
          {article.description && (
            <CardDescription className="line-clamp-3">
              {article.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate font-medium">{article.source}</span>
          <span className="flex items-center gap-1">
            {relative}
            <ExternalLink className="size-3" />
          </span>
        </CardContent>
      </Card>
    </a>
  );
}

function formatRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `hace ${Math.max(1, mins)} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `hace ${days} d`;
  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });
}
