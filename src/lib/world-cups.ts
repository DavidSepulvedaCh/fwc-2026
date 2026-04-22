/**
 * Histórico de las 22 ediciones de la Copa Mundial (1930–2022).
 * Datos estáticos: no cambian en el tiempo y no justifican una tabla en DB.
 *
 * Para mantener el listado de equipos coherente con el resto de la app,
 * usamos los códigos FIFA de 3 letras. Algunos mapeos son simplificaciones
 * históricas (ej. GER cubre Alemania Federal pre-1990, CZE cubre
 * Checoslovaquia pre-1993).
 */

export type Edition = {
  year: number;
  editionNumber: number;
  hosts: string[];
  champion: string;
  runnerUp: string;
  scoreHome: number;
  scoreAway: number;
  /** "aet" si se definió en tiempo extra, "pens" si en penales */
  decision?: "aet" | "pens";
  /** Marcador de penales si aplica, ej. "4-2" */
  penalties?: string;
  /** Nota histórica breve (opcional) */
  note?: string;
};

/** Nombre en español por código FIFA — solo los que aparecen en ediciones. */
export const TEAM_NAME_ES: Record<string, string> = {
  URU: "Uruguay",
  ARG: "Argentina",
  ITA: "Italia",
  CZE: "Checoslovaquia",
  HUN: "Hungría",
  BRA: "Brasil",
  GER: "Alemania",
  SWE: "Suecia",
  CHI: "Chile",
  ENG: "Inglaterra",
  MEX: "México",
  NED: "Países Bajos",
  ESP: "España",
  USA: "Estados Unidos",
  FRA: "Francia",
  KOR: "Corea del Sur",
  JPN: "Japón",
  RSA: "Sudáfrica",
  RUS: "Rusia",
  CRO: "Croacia",
  QAT: "Catar",
  SUI: "Suiza",
  CAN: "Canadá",
};

export const teamName = (code: string) => TEAM_NAME_ES[code] ?? code;

export const EDITIONS: Edition[] = [
  { editionNumber: 1,  year: 1930, hosts: ["URU"], champion: "URU", runnerUp: "ARG", scoreHome: 4, scoreAway: 2 },
  { editionNumber: 2,  year: 1934, hosts: ["ITA"], champion: "ITA", runnerUp: "CZE", scoreHome: 2, scoreAway: 1, decision: "aet" },
  { editionNumber: 3,  year: 1938, hosts: ["FRA"], champion: "ITA", runnerUp: "HUN", scoreHome: 4, scoreAway: 2 },
  { editionNumber: 4,  year: 1950, hosts: ["BRA"], champion: "URU", runnerUp: "BRA", scoreHome: 2, scoreAway: 1, note: "Maracanazo — fase final por puntos" },
  { editionNumber: 5,  year: 1954, hosts: ["SUI"], champion: "GER", runnerUp: "HUN", scoreHome: 3, scoreAway: 2 },
  { editionNumber: 6,  year: 1958, hosts: ["SWE"], champion: "BRA", runnerUp: "SWE", scoreHome: 5, scoreAway: 2 },
  { editionNumber: 7,  year: 1962, hosts: ["CHI"], champion: "BRA", runnerUp: "CZE", scoreHome: 3, scoreAway: 1 },
  { editionNumber: 8,  year: 1966, hosts: ["ENG"], champion: "ENG", runnerUp: "GER", scoreHome: 4, scoreAway: 2, decision: "aet" },
  { editionNumber: 9,  year: 1970, hosts: ["MEX"], champion: "BRA", runnerUp: "ITA", scoreHome: 4, scoreAway: 1 },
  { editionNumber: 10, year: 1974, hosts: ["GER"], champion: "GER", runnerUp: "NED", scoreHome: 2, scoreAway: 1 },
  { editionNumber: 11, year: 1978, hosts: ["ARG"], champion: "ARG", runnerUp: "NED", scoreHome: 3, scoreAway: 1, decision: "aet" },
  { editionNumber: 12, year: 1982, hosts: ["ESP"], champion: "ITA", runnerUp: "GER", scoreHome: 3, scoreAway: 1 },
  { editionNumber: 13, year: 1986, hosts: ["MEX"], champion: "ARG", runnerUp: "GER", scoreHome: 3, scoreAway: 2 },
  { editionNumber: 14, year: 1990, hosts: ["ITA"], champion: "GER", runnerUp: "ARG", scoreHome: 1, scoreAway: 0 },
  { editionNumber: 15, year: 1994, hosts: ["USA"], champion: "BRA", runnerUp: "ITA", scoreHome: 0, scoreAway: 0, decision: "pens", penalties: "3-2" },
  { editionNumber: 16, year: 1998, hosts: ["FRA"], champion: "FRA", runnerUp: "BRA", scoreHome: 3, scoreAway: 0 },
  { editionNumber: 17, year: 2002, hosts: ["KOR", "JPN"], champion: "BRA", runnerUp: "GER", scoreHome: 2, scoreAway: 0 },
  { editionNumber: 18, year: 2006, hosts: ["GER"], champion: "ITA", runnerUp: "FRA", scoreHome: 1, scoreAway: 1, decision: "pens", penalties: "5-3" },
  { editionNumber: 19, year: 2010, hosts: ["RSA"], champion: "ESP", runnerUp: "NED", scoreHome: 1, scoreAway: 0, decision: "aet" },
  { editionNumber: 20, year: 2014, hosts: ["BRA"], champion: "GER", runnerUp: "ARG", scoreHome: 1, scoreAway: 0, decision: "aet" },
  { editionNumber: 21, year: 2018, hosts: ["RUS"], champion: "FRA", runnerUp: "CRO", scoreHome: 4, scoreAway: 2 },
  { editionNumber: 22, year: 2022, hosts: ["QAT"], champion: "ARG", runnerUp: "FRA", scoreHome: 3, scoreAway: 3, decision: "pens", penalties: "4-2" },
];

export type TitleCount = {
  code: string;
  name: string;
  titles: number;
  years: number[];
};

/** Ranking de títulos por país, ordenado desc. Empate resuelto por último título. */
export function getTitleRanking(): TitleCount[] {
  const map = new Map<string, TitleCount>();
  for (const e of EDITIONS) {
    const existing = map.get(e.champion);
    if (existing) {
      existing.titles += 1;
      existing.years.push(e.year);
    } else {
      map.set(e.champion, {
        code: e.champion,
        name: teamName(e.champion),
        titles: 1,
        years: [e.year],
      });
    }
  }
  return [...map.values()].sort((a, b) => {
    if (b.titles !== a.titles) return b.titles - a.titles;
    return Math.max(...b.years) - Math.max(...a.years);
  });
}

export type HostCount = {
  code: string;
  name: string;
  times: number;
  years: number[];
};

/** Sedes por país (contando coorganizaciones como 1 para cada país). */
export function getHostRanking(): HostCount[] {
  const map = new Map<string, HostCount>();
  for (const e of EDITIONS) {
    for (const h of e.hosts) {
      const existing = map.get(h);
      if (existing) {
        existing.times += 1;
        existing.years.push(e.year);
      } else {
        map.set(h, {
          code: h,
          name: teamName(h),
          times: 1,
          years: [e.year],
        });
      }
    }
  }
  return [...map.values()].sort((a, b) => b.times - a.times || Math.max(...b.years) - Math.max(...a.years));
}
