function parseAmount(token: string): number | null {
  const normalized = token.replace(/,/g, "").match(/(\d+)/);
  if (!normalized) return null;
  return Number(normalized[1]);
}

function formatAmount(amount: number, plus = false): string {
  return `₱${amount.toLocaleString("en-PH")}${plus ? "+" : ""}`;
}

function formatPercentageValue(cleaned: string): string | null {
  if (!/%/.test(cleaned)) return null;

  const rangeMatch = cleaned.match(
    /(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)\s*%/,
  );
  if (rangeMatch) {
    const suffix = cleaned
      .slice(rangeMatch.index! + rangeMatch[0].length)
      .trim();
    const base = `${rangeMatch[1]}% – ${rangeMatch[2]}%`;
    return suffix ? `${base} ${suffix}` : base;
  }

  return cleaned.replace(/\s+/g, " ").trim();
}

export function formatPesoAmount(value: string | null): string | null {
  if (!value) return null;

  const cleaned = value.trim();
  if (!cleaned) return null;
  if (cleaned.toLowerCase() === "varies") return "Varies";

  const percentage = formatPercentageValue(cleaned);
  if (percentage) return percentage;

  if (!/\d/.test(cleaned)) return cleaned;

  const hasPlus = cleaned.includes("+");
  const rangeMatch = cleaned.match(/(\d[\d,]*)\s*[-–—]\s*(\d[\d,]*)(\+)?/);

  if (rangeMatch) {
    const low = parseAmount(rangeMatch[1]);
    const high = parseAmount(rangeMatch[2]);
    if (low != null && high != null) {
      return `${formatAmount(low)} – ${formatAmount(high)}`;
    }
  }

  const singleMatch = cleaned.match(/(\d[\d,]*)(\+)?/);
  if (singleMatch) {
    const amount = parseAmount(singleMatch[1]);
    if (amount != null) {
      return formatAmount(amount, Boolean(singleMatch[2]) || hasPlus);
    }
  }

  return cleaned;
}

export function formatPesoInText(text: string): string {
  return text
    .replace(/\bP\s*(\d[\d,]*)/gi, (_, amount) => {
      const parsed = parseAmount(amount);
      return parsed != null ? formatAmount(parsed) : `P${amount}`;
    })
    .replace(/(spend note:\s*)(\d[\d,]*)/gi, (_, prefix, amount) => {
      const parsed = parseAmount(amount);
      return parsed != null
        ? `${prefix}${formatAmount(parsed)}`
        : `${prefix}${amount}`;
    })
    .replace(/\bnett\b/gi, "net");
}

export function formatPesoEstimate(value: string | null): string | null {
  const formatted = formatPesoAmount(value);
  if (!formatted) return null;
  if (formatted === "Varies" || !formatted.startsWith("₱")) return formatted;

  if (formatted.includes(" – ")) {
    return formatted;
  }

  return formatted.endsWith("+") ? `From ${formatted}` : `About ${formatted}`;
}

export function formatPromoSavingsLabel(value: string | null): string | null {
  const formatted = formatPesoAmount(value);
  if (!formatted) return null;
  if (formatted === "Varies") return "Varies";

  const isPeso = formatted.startsWith("₱");
  const isPercent = formatted.includes("%");
  if (!isPeso && !isPercent) return formatted;

  if (isPercent) {
    const normalized = formatted.replace(/\s+off\s*$/i, "").trim();
    return `Save ${normalized}`;
  }

  return `Save ${formatted}`;
}
