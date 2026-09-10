function formatTimeToken(
  hour: string,
  minute: string | undefined,
  meridiem?: string,
) {
  const hourNum = Number(hour);
  const minuteNum = minute ? Number(minute) : 0;
  const date = new Date();
  date.setHours(
    meridiem?.toUpperCase() === "PM" && hourNum < 12
      ? hourNum + 12
      : meridiem?.toUpperCase() === "AM" && hourNum === 12
        ? 0
        : hourNum,
    minuteNum,
    0,
    0,
  );

  return date.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: minuteNum ? "2-digit" : undefined,
  });
}

function formatTimeRanges(text: string): string {
  return text.replace(
    /(\d{1,2})(?::(\d{2}))?\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?/g,
    (_, startHour, startMinute, endHour, endMinute, meridiem) => {
      const start = formatTimeToken(startHour, startMinute, meridiem);
      const end = formatTimeToken(endHour, endMinute, meridiem);
      return `${start} – ${end}`;
    },
  );
}

function formatDateRanges(text: string): string {
  return text
    .replace(
      /(\d{1,2}\s+[A-Za-z]{3})\s*-\s*(\d{1,2}\s+[A-Za-z]{3}\s+\d{4})/g,
      "$1 – $2",
    )
    .replace(
      /(\d{1,2}\s+[A-Za-z]{3}\s+\d{4})\s*-\s*(\d{1,2}\s+[A-Za-z]{3}\s+\d{4})/g,
      "$1 – $2",
    )
    .replace(/\bValid\s+(?=\d)/i, "Valid from ");
}

function capitalizeSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function formatClause(clause: string): string {
  let formatted = clause.trim().replace(/[.]+$/g, "");
  formatted = formatDateRanges(formatted);
  formatted = formatTimeRanges(formatted);
  formatted = formatted.replace(/\s+/g, " ");
  return capitalizeSentence(formatted);
}

const ABBREV_DOT =
  /\b(Sta|St|Dr|Ave|Brgy|Mr|Mrs|Ms|Jr|Sr|Mt|Gov|Gen|Col)\.\s+/gi;

function protectAbbreviations(text: string): string {
  return text.replace(ABBREV_DOT, (_match, abbr: string) => `${abbr}<dot> `);
}

function restoreAbbreviations(text: string): string {
  return text.replace(/<dot>/g, ".");
}

export function formatReadablePromoText(text: string | null): string[] {
  const cleaned = text?.trim();
  if (!cleaned) return [];

  const protectedText = protectAbbreviations(cleaned);

  return protectedText
    .split(/\.\s+/)
    .flatMap((sentence) => sentence.split(/\s*;\s*/))
    .map((clause) => formatClause(restoreAbbreviations(clause)))
    .filter(Boolean);
}
