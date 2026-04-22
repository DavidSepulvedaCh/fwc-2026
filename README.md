<div align="center">

<img src="public/icon.png" alt="Polla Mundial 2026" width="128" />

# Polla Mundial 2026

**Predice la Copa Mundial de la FIFA 2026, arma tu bracket y compite con tus amigos.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#licencia)

</div>

---

## 📖 Sobre el proyecto

**Polla Mundial 2026** es una aplicación web multiusuario tipo *polla* / *quiniela* para predecir la Copa Mundial de la FIFA 2026 (USA · Canadá · México). Los participantes pronostican marcadores de los 104 partidos, arman su bracket de eliminatorias y compiten por el primer puesto del ranking.

Pensada para jugar **entre amigos**, con un sistema de puntuación transparente y un diseño *futbolero* centrado en la experiencia del torneo.

## ✨ Funcionalidades

- ⚽ **Predicciones de marcadores** en los 104 partidos (12 grupos de 4 + eliminatorias).
- 🏆 **Bracket de eliminatorias** generado a partir de tus predicciones (32avos → final).
- 🎖️ **Premios individuales**: goleador, asistidor, mejor jugador, mejor portero, campeón y subcampeón.
- 📊 **Ranking en vivo** con sistema de puntuación transparente visible al usuario.
- 🗓️ **Calendario oficial** con sedes, horarios y zonas horarias.
- 🔐 **Autenticación** con usuario y contraseña (NextAuth).
- ⚙️ **Panel de administración** para resultados y premios del torneo.
- 🌎 **SEO optimizado** (OpenGraph, sitemap, robots, JSON-LD SportsEvent).
- 🎨 **Diseño dark-first** inspirado en la identidad visual del Mundial 2026.

## 🧱 Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Lenguaje | [TypeScript 5](https://www.typescriptlang.org) |
| UI | [React 19](https://react.dev) · [Tailwind CSS 4](https://tailwindcss.com) · [shadcn/ui](https://ui.shadcn.com) |
| Base de datos | [PostgreSQL 17](https://www.postgresql.org) |
| ORM | [Prisma 7](https://www.prisma.io) |
| Autenticación | [NextAuth v5](https://authjs.dev) + Prisma Adapter |
| Validación | [Zod 4](https://zod.dev) |
| Iconos | [lucide-react](https://lucide.dev) · [flag-icons](https://flagicons.lipis.dev) |

## 🚀 Empezar

### Prerrequisitos

- **Node.js** 20+
- **PostgreSQL** 17 en ejecución local o remota
- **npm** (o `pnpm` / `yarn` / `bun`)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/DavidSepulvedaCh/FWC_2026.git
cd FWC_2026

# 2. Instalar dependencias (dispara prisma generate en postinstall)
npm install

# 3. Copiar variables de entorno y ajustarlas
cp .env.example .env

# 4. Aplicar migraciones
npm run db:migrate

# 5. Poblar con datos oficiales FIFA (equipos, grupos, calendario)
npm run db:seed

# 6. Levantar el dev server
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver la aplicación.

### Variables de entorno

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión PostgreSQL (Prisma). |
| `NEXT_PUBLIC_SITE_URL` | URL pública canónica del sitio, sin slash final. Se usa para metadata SEO, `sitemap.xml`, `robots.txt` y OpenGraph. |

Ver [.env.example](.env.example) como plantilla.

## 📜 Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con *hot reload*. |
| `npm run build` | Compila la aplicación para producción. |
| `npm start` | Sirve la build de producción. |
| `npm run lint` | Ejecuta ESLint sobre el proyecto. |
| `npm run db:migrate` | Aplica migraciones de Prisma en desarrollo. |
| `npm run db:push` | Sincroniza el schema con la BD sin migraciones. |
| `npm run db:studio` | Abre Prisma Studio para inspeccionar la BD. |
| `npm run db:seed` | Carga datos oficiales FIFA (equipos, grupos, partidos). |

## 🗂️ Estructura del proyecto

```
src/
├── app/                   # Rutas (App Router)
│   ├── admin/             # Panel de administración
│   ├── api/               # Route handlers (NextAuth, etc.)
│   ├── fixtures/          # Calendario de partidos
│   ├── predictions/       # Predicciones y bracket del usuario
│   ├── ranking/           # Tabla de posiciones
│   ├── login/ · register/ # Autenticación
│   ├── settings/          # Preferencias del usuario
│   ├── opengraph-image.tsx  # OG image dinámica
│   ├── icon.png · apple-icon.png
│   ├── robots.ts · sitemap.ts
│   └── layout.tsx · page.tsx
├── components/            # Componentes UI reutilizables
├── lib/                   # Utilidades (prisma, session, datetime, ...)
└── types/                 # Tipos compartidos

prisma/
├── schema.prisma          # Modelo de datos
├── migrations/            # Migraciones versionadas
├── seed.ts                # Script de seed
└── fifa-data.ts           # Datos oficiales FIFA 2026
```

## 🚢 Despliegue

La aplicación está optimizada para [Vercel](https://vercel.com/new), pero corre en cualquier plataforma que soporte Node.js.

1. Provisiona una base de datos PostgreSQL (Neon, Supabase, Railway, etc.).
2. Configura `DATABASE_URL` y `NEXT_PUBLIC_SITE_URL` en el entorno de producción.
3. Ejecuta `prisma migrate deploy` como paso previo al build.
4. `npm run build && npm start`.

## 🤝 Contribuciones

Este es un proyecto personal, pero las sugerencias y reportes de bugs son bienvenidos vía [Issues](../../issues) o Pull Request.

## 📄 Licencia

Distribuido bajo licencia **MIT**. Consulta `LICENSE` para más información.

---

<div align="center">

*"FIFA", "Copa Mundial de la FIFA" y las marcas asociadas son propiedad de la FIFA. Este proyecto no está afiliado ni respaldado oficialmente por la FIFA.*

</div>
