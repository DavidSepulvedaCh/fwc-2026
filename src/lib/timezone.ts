// Client-safe timezone constants and helpers. No server-only APIs here so
// this file can be imported from both server and client components.

export const DEFAULT_TIMEZONE = "America/Bogota";
export const TIMEZONE_COOKIE = "tz";

export type HourFormat = "12" | "24";
export const DEFAULT_HOUR_FORMAT: HourFormat = "24";
export const HOUR_FORMAT_COOKIE = "hf";

export type DatePrefs = {
  timezone: string;
  hourFormat: HourFormat;
};

export const DEFAULT_DATE_PREFS: DatePrefs = {
  timezone: DEFAULT_TIMEZONE,
  hourFormat: DEFAULT_HOUR_FORMAT,
};

export type TimezoneOption = {
  value: string;
  label: string;
  region: "Américas" | "Europa" | "Asia" | "Oceanía" | "África";
};

export const COMMON_TIMEZONES: TimezoneOption[] = [
  // Américas
  { value: "America/Bogota", label: "Bogotá / Lima", region: "Américas" },
  { value: "America/Mexico_City", label: "Ciudad de México", region: "Américas" },
  { value: "America/Monterrey", label: "Monterrey", region: "Américas" },
  { value: "America/Cancun", label: "Cancún", region: "Américas" },
  { value: "America/Tijuana", label: "Tijuana", region: "Américas" },
  { value: "America/New_York", label: "Nueva York · Miami (ET)", region: "Américas" },
  { value: "America/Chicago", label: "Chicago · Kansas City (CT)", region: "Américas" },
  { value: "America/Denver", label: "Denver (MT)", region: "Américas" },
  { value: "America/Phoenix", label: "Phoenix", region: "Américas" },
  { value: "America/Los_Angeles", label: "Los Ángeles · Seattle (PT)", region: "Américas" },
  { value: "America/Toronto", label: "Toronto · Montreal", region: "Américas" },
  { value: "America/Vancouver", label: "Vancouver", region: "Américas" },
  { value: "America/Caracas", label: "Caracas", region: "Américas" },
  { value: "America/La_Paz", label: "La Paz", region: "Américas" },
  { value: "America/Santiago", label: "Santiago", region: "Américas" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", region: "Américas" },
  { value: "America/Montevideo", label: "Montevideo", region: "Américas" },
  { value: "America/Sao_Paulo", label: "São Paulo · Río", region: "Américas" },

  // Europa
  { value: "Europe/London", label: "Londres · Lisboa", region: "Europa" },
  { value: "Europe/Madrid", label: "Madrid · París · Berlín", region: "Europa" },
  { value: "Europe/Rome", label: "Roma", region: "Europa" },
  { value: "Europe/Athens", label: "Atenas · Helsinki", region: "Europa" },
  { value: "Europe/Moscow", label: "Moscú · Estambul", region: "Europa" },

  // Asia
  { value: "Asia/Dubai", label: "Dubái", region: "Asia" },
  { value: "Asia/Tehran", label: "Teherán", region: "Asia" },
  { value: "Asia/Karachi", label: "Karachi", region: "Asia" },
  { value: "Asia/Kolkata", label: "Delhi · Mumbai", region: "Asia" },
  { value: "Asia/Bangkok", label: "Bangkok", region: "Asia" },
  { value: "Asia/Shanghai", label: "Shanghái · Hong Kong", region: "Asia" },
  { value: "Asia/Tokyo", label: "Tokio · Seúl", region: "Asia" },

  // Oceanía
  { value: "Australia/Perth", label: "Perth", region: "Oceanía" },
  { value: "Australia/Sydney", label: "Sídney · Melbourne", region: "Oceanía" },
  { value: "Pacific/Auckland", label: "Auckland", region: "Oceanía" },

  // África
  { value: "Africa/Lagos", label: "Lagos", region: "África" },
  { value: "Africa/Cairo", label: "El Cairo", region: "África" },
  { value: "Africa/Johannesburg", label: "Johannesburgo", region: "África" },
];

export function isValidTimezone(tz: string): boolean {
  if (!tz || tz.length > 100) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * Short offset label for a timezone, e.g. "GMT-5". Uses the `shortOffset`
 * timeZoneName, which is supported in all modern browsers & Node >=20.
 */
export function tzOffsetLabel(tz: string, reference: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).formatToParts(reference);
    const name = parts.find((p) => p.type === "timeZoneName")?.value;
    if (!name) return "";
    return name === "GMT" ? "GMT+0" : name;
  } catch {
    return "";
  }
}
