export type BranchHint = {
  label: string;
  query: string;
  kind: "address" | "named";
};

const VAGUE_PATTERNS = [
  /^multiple\b/i,
  /^all\b/i,
  /^participating\b/i,
  /\bother branches?\b/i,
  /\bsee\b.+\.(ph|com)\b/i,
  /\bnationwide\b/i,
  /\bstandalone locations?\b/i,
  /\bbranches nationwide\b/i,
  /\bper branch\b/i,
];

const ADDRESS_PATTERN =
  /\d+\s+[\w\s.-]+(?:street|st|ave|avenue|road|rd|blvd|boulevard|drive|dr|qc|city|manila|pasay|taguig|makati)/i;

const MALL_PATTERN =
  /\b(SM |Ayala|MOA|BGC|Megamall|Vertis|Circuit|Fairview|Greenhills|Southmall|North EDSA|One Ayala|UP Town)/i;

function looksLikeAddress(label: string): boolean {
  return ADDRESS_PATTERN.test(label) || /\d{2,4}\s+\w/.test(label);
}

function isVague(label: string): boolean {
  const normalized = label.trim();
  if (normalized.length < 3) return true;
  return VAGUE_PATTERNS.some((pattern) => pattern.test(normalized));
}

function buildGeocodeQuery(label: string, brand: string): string {
  if (looksLikeAddress(label)) {
    return `${label}, Philippines`;
  }

  if (MALL_PATTERN.test(label)) {
    return `${brand} ${label}, Metro Manila, Philippines`;
  }

  return `${brand} ${label}, Philippines`;
}

function splitBranchSegments(text: string): string[] {
  const segments = text
    .split(/[;|]/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  return segments.flatMap((segment) => {
    if (looksLikeAddress(segment)) {
      return [segment];
    }

    return segment
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  });
}

export function parseBranches(
  participatingBranches: string | null,
  brand: string,
): BranchHint[] {
  if (!participatingBranches) return [];

  const parts = splitBranchSegments(participatingBranches).filter(
    (part) => !isVague(part),
  );

  const unique = [...new Set(parts)];

  return unique.map((label) => ({
    label,
    query: buildGeocodeQuery(label, brand),
    kind: looksLikeAddress(label) ? "address" : "named",
  }));
}

export function hasOnlyVagueBranches(
  participatingBranches: string | null,
): boolean {
  if (!participatingBranches) return true;
  return parseBranches(participatingBranches, "").length === 0;
}
