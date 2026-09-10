import {
  formatPesoAmount,
  formatPesoEstimate,
  formatPesoInText,
} from "./formatPeso";
import { formatReadablePromoText } from "./formatPromoText";
import type { BirthdayPromo } from "./promo.types";

export type PromoDetailSection = {
  id: string;
  title: string | null;
  items: string[];
};

export type PromoDetailHighlights = {
  value: string | null;
  timing: string | null;
  area: string | null;
};

function isAffirmative(value: string | null): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "yes" || normalized.startsWith("yes ");
}

function isNegative(value: string | null): boolean {
  if (!value) return true;
  const normalized = value.trim().toLowerCase();
  return (
    normalized === "no" ||
    normalized === "none" ||
    normalized === "unknown" ||
    normalized === "n/a" ||
    normalized === "0"
  );
}

function cleanValue(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || isNegative(trimmed)) return null;
  return trimmed;
}

export function formatEstimatedValue(value: string | null): string | null {
  return formatPesoEstimate(value);
}

export function formatValidityEnd(value: string | null): string | null {
  const cleaned = cleanValue(value);
  if (!cleaned) return null;
  if (cleaned.toLowerCase() === "ongoing") {
    return "No published end date";
  }

  const date = new Date(`${cleaned}T12:00:00`);
  if (!Number.isNaN(date.getTime()) && cleaned.includes("-")) {
    return `Until ${date.toLocaleDateString("en-PH", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`;
  }

  return formatReadablePromoText(cleaned)[0] ?? cleaned;
}

export function formatLastChecked(value: string | null): string | null {
  const cleaned = cleanValue(value);
  if (!cleaned) return null;

  const date = new Date(`${cleaned}T12:00:00`);
  if (Number.isNaN(date.getTime())) return `Last checked ${cleaned}`;

  return `Last checked ${date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

export function formatVerificationLabel(status: string | null): string | null {
  if (!status) return null;

  const normalized = status.toLowerCase();
  if (normalized.includes("verified")) return "Verified with official sources";
  if (normalized.includes("needs verify")) {
    return "Confirm details with the store before you go";
  }

  return status;
}

function mentionsWeekendsAndHolidays(text: string): boolean {
  const lower = text.toLowerCase();
  return lower.includes("weekend") && lower.includes("holiday");
}

function getPromoEndDate(value: string | null): Date | null {
  const cleaned = cleanValue(value);
  if (
    !cleaned ||
    cleaned.toLowerCase() === "ongoing" ||
    !cleaned.includes("-")
  ) {
    return null;
  }

  const date = new Date(`${cleaned}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function extractDatesFromText(text: string): Date[] {
  const dates: Date[] = [];

  for (const match of text.matchAll(/\b(\d{4}-\d{2}-\d{2})\b/g)) {
    const date = new Date(`${match[1]}T12:00:00`);
    if (!Number.isNaN(date.getTime())) dates.push(date);
  }

  for (const match of text.matchAll(
    /\b([A-Za-z]{3,9})\s+(\d{1,2})(?:,)?\s+(\d{4})\b/g,
  )) {
    const date = new Date(`${match[1]} ${match[2]}, ${match[3]} 12:00:00`);
    if (!Number.isNaN(date.getTime())) dates.push(date);
  }

  return dates;
}

function isSameCalendarDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function textReferencesPromoEndDate(text: string, promoEndDate: Date): boolean {
  return extractDatesFromText(text).some((date) =>
    isSameCalendarDay(date, promoEndDate),
  );
}

function hasExactBirthdaySummary(existing: string[]): boolean {
  return existing.some((item) => /on your exact birthday/i.test(item));
}

function hasBirthMonthSummary(existing: string[]): boolean {
  return existing.some((item) => /during your birth month/i.test(item));
}

function isBareExactBirthdayClause(clause: string): boolean {
  if (/paying|adults|companions?|\d|lunch|dinner|month:/i.test(clause)) {
    return false;
  }

  return /^exact birthday(?:\s+only)?(?:\s+(?:reported|implied(?:\s+in\s+.+)?|per\s+current\s+listing))?\.?$/i.test(
    clause.trim(),
  );
}

function isPromoEndAnnouncement(clause: string): boolean {
  if (/^until /i.test(clause)) return false;

  return (
    /(?:promo\s+)?(?:posted\s+)?(?:through|until|ends?|end)\b/i.test(clause) ||
    /^not available:\s*promo\s+end\b/i.test(clause)
  );
}

function isMislabeledEndDateNote(text: string): boolean {
  return /promo\s+end\b/i.test(text);
}

function shouldSkipTimingClause(
  clause: string,
  existing: string[],
  promoEndDate: Date | null = null,
): boolean {
  if (
    /^birth month$/i.test(clause) &&
    existing.some((item) =>
      /during your birth month|exact birthday/i.test(item),
    )
  ) {
    return true;
  }

  if (isBareExactBirthdayClause(clause) && hasExactBirthdaySummary(existing)) {
    return true;
  }

  if (/^birth month$/i.test(clause.trim()) && hasBirthMonthSummary(existing)) {
    return true;
  }

  if (
    mentionsWeekendsAndHolidays(clause) &&
    existing.some((item) => mentionsWeekendsAndHolidays(item))
  ) {
    return true;
  }

  if (
    /birthday.*birth month|birth month.*birthday/i.test(clause) &&
    existing.some((item) =>
      /exact birthday|during your birth month/i.test(item),
    )
  ) {
    return true;
  }

  if (
    promoEndDate &&
    textReferencesPromoEndDate(clause, promoEndDate) &&
    isPromoEndAnnouncement(clause)
  ) {
    return true;
  }

  if (
    promoEndDate &&
    /^until /i.test(clause) &&
    existing.some(
      (item) =>
        /^until /i.test(item) && textReferencesPromoEndDate(item, promoEndDate),
    )
  ) {
    return true;
  }

  return false;
}

function appendUniqueTimingItems(
  target: string[],
  items: string[],
  promoEndDate: Date | null = null,
) {
  for (const item of items) {
    if (shouldSkipTimingClause(item, target, promoEndDate)) continue;
    if (!target.some((existing) => existing === item)) {
      target.push(item);
    }
  }
}

function extractCardListFromNotes(notes: string | null): string | null {
  const cleaned = notes?.trim();
  if (!cleaned) return null;

  const match = cleaned.match(/^cards?:\s*(.+?)\.?$/i);
  return match?.[1]?.trim() ?? null;
}

function isCardListNote(item: string): boolean {
  return /^cards?:\s+/i.test(item);
}

function isSourceOnlyClause(clause: string): boolean {
  const lower = clause.toLowerCase();
  return (
    /^from u\//.test(lower) ||
    /^mentioned in/.test(lower) ||
    /^widely cited/.test(lower) ||
    /reddit excel/.test(lower) ||
    /crowdsourced/.test(lower) ||
    /screenshot transcription/.test(lower) ||
    (/from reddit/.test(lower) && lower.length < 80) ||
    (/per reddit/.test(lower) && lower.length < 40) ||
    (/birthday threads?/.test(lower) && /reddit|excel|screenshot/.test(lower))
  );
}

function cleanNoteClause(clause: string): string | null {
  const cleaned = clause
    .replace(/\s+from reddit excel[^.]*$/i, "")
    .replace(/\s+from reddit[^.]*$/i, "")
    .replace(/\s+per reddit\.?$/i, "")
    .trim();

  if (!cleaned || isSourceOnlyClause(cleaned)) return null;
  return cleaned;
}

function isRedundantTimingNote(
  item: string,
  timingItems: string[],
  promo: BirthdayPromo,
): boolean {
  const lower = item.toLowerCase();

  if (/confirm if extended|check if renewed/i.test(item)) {
    return Boolean(cleanValue(promo.promoValidityEnd));
  }

  if (
    /^promo (until|ends|end)\b/i.test(item) &&
    timingItems.some((timing) => /^until /i.test(timing))
  ) {
    return true;
  }

  if (
    /^promo period\b/i.test(item) &&
    timingItems.some((timing) => /until /i.test(timing.toLowerCase()))
  ) {
    return true;
  }

  if (
    lower === "birth month" &&
    timingItems.some((timing) => /birth month/i.test(timing))
  ) {
    return true;
  }

  return false;
}

function isBenefitClause(clause: string): boolean {
  const lower = clause.toLowerCase();
  return (
    /companions?\s+get/.test(lower) ||
    /\d+%\s*(off|discount)/.test(lower) ||
    /food discount/.test(lower) ||
    /^not for /.test(lower) ||
    /can also (claim|use)/.test(lower) ||
    /also gives/.test(lower) ||
    /year-round/.test(lower) ||
    /^excludes? /.test(lower) ||
    /\bexcluded\b/.test(lower) ||
    /fee waived/.test(lower) ||
    /\d+%\s+birthday/.test(lower) ||
    /classic:.*off/.test(lower) ||
    /gold:.*off/.test(lower)
  );
}

function isRedemptionConstraint(clause: string): boolean {
  return /walk-in|ticket booth only|register (before|for)|book online/i.test(
    clause,
  );
}

function isLocationClause(
  clause: string,
  promo: BirthdayPromo,
  branches: string[],
): boolean {
  const lower = clause.toLowerCase();
  if (
    branches.some((branch) => {
      const branchLower = branch.toLowerCase();
      return (
        branchLower.includes(lower) ||
        (lower.length > 5 && lower.includes(branchLower.split(",")[0].trim()))
      );
    })
  ) {
    return true;
  }

  if (/^sta\.?\s*rosa/i.test(lower)) {
    return branches.some((branch) => /sta\.?\s*rosa/i.test(branch));
  }

  const region = promo.locationRegion?.toLowerCase();
  return Boolean(region && lower === region);
}

function isRedundantBranchNote(note: string, branches: string[]): boolean {
  if (branches.length !== 1) return false;

  const noteLower = note.toLowerCase();
  if (!/exclusive|only/i.test(noteLower)) return false;

  const tokens = branches[0]
    .toLowerCase()
    .split(/[\s,]+/)
    .filter((token) => token.length > 3);
  const matches = tokens.filter((token) => noteLower.includes(token));
  return matches.length >= 2;
}

function splitNoteClauses(item: string): string[] {
  return item
    .split(/\.\s+/)
    .map((clause) => cleanNoteClause(clause))
    .filter((clause): clause is string => Boolean(clause));
}

function extractPercentTokens(text: string): string[] {
  return text.match(/\d+(?:\.\d+)?%/g) ?? [];
}

function normalizeBenefitForComparison(text: string): string {
  return text
    .toLowerCase()
    .replace(/^worth\s+/i, "")
    .replace(/\s+birthday\s+promo$/i, "")
    .replace(/[^\w%–\-+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function benefitsOverlap(left: string, right: string): boolean {
  const normLeft = normalizeBenefitForComparison(left);
  const normRight = normalizeBenefitForComparison(right);
  if (!normLeft || !normRight) return false;
  if (normLeft === normRight) return true;

  const leftPercents = extractPercentTokens(left);
  const rightPercents = extractPercentTokens(right);
  if (
    leftPercents.length > 0 &&
    rightPercents.length > 0 &&
    leftPercents.some((token) => rightPercents.includes(token))
  ) {
    const leftWithoutPercent = normLeft.replace(/\d+(?:\.\d+)?%/g, "").trim();
    const rightWithoutPercent = normRight.replace(/\d+(?:\.\d+)?%/g, "").trim();
    if (
      !leftWithoutPercent ||
      leftWithoutPercent === "off" ||
      !rightWithoutPercent ||
      rightWithoutPercent === "off"
    ) {
      return true;
    }
  }

  return false;
}

function isRedundantBenefitItem(
  candidate: string,
  existing: string[],
): boolean {
  return existing.some((item) => benefitsOverlap(candidate, item));
}

function formatBenefitOffer(offer: string): string {
  let text = offer.trim();

  if (/^(\d+\s+)?free\s+birthday\s+celebrant\b/i.test(text)) {
    return "Free service for the birthday celebrant";
  }

  const semicolonIndex = text.indexOf(";");
  if (
    semicolonIndex > 0 &&
    /\d+\s+(?:full[- ]?paying|paying)/i.test(text.slice(semicolonIndex))
  ) {
    text = text.slice(0, semicolonIndex).trim();
  }

  text = text
    .replace(
      /\s+with\s+(?:\d+\s+)?(?:full[- ]?paying\s+)?(?:\d+\s+)?(?:adults?|guests?|companions?|paying\s+(?:adults?|guests?|companions?))(?:\s*\([^)]+\))?\.?$/i,
      "",
    )
    .replace(/\s+when accompanied by\b.+$/i, "");

  return text.trim();
}

function shouldIncludeWorthLine(
  offer: string | null,
  value: string | null,
): boolean {
  const formatted = formatPesoAmount(value);
  if (!formatted || formatted === "Varies") return false;
  if (/%/.test(value ?? "")) return false;
  if (!formatted.startsWith("₱")) return false;

  const worthLine = `Worth ${formatted}`;
  if (offer && benefitsOverlap(worthLine, offer)) return false;
  if (offer && benefitsOverlap(formatted, offer)) return false;

  return true;
}

function formatWorthLine(
  offer: string | null,
  value: string | null,
): string | null {
  if (!shouldIncludeWorthLine(offer, value)) return null;

  const formatted = formatPesoAmount(value);
  if (!formatted) return null;
  return `Worth ${formatted}`;
}

function getExtraBenefitItems(
  promo: BirthdayPromo,
  timingItems: string[],
  branches: string[],
): string[] {
  const items: string[] = [];

  for (const item of formatReadablePromoText(promo.notes)) {
    if (isCardListNote(item)) continue;

    for (const clause of splitNoteClauses(item)) {
      if (!isBenefitClause(clause)) continue;
      if (isRedundantBranchNote(clause, branches)) continue;
      if (isRedundantTimingNote(clause, timingItems, promo)) continue;

      const formatted = formatPesoInText(clause);
      if (!isRedundantBenefitItem(formatted, items)) {
        items.push(formatted);
      }
    }
  }

  return items;
}

export function formatWhatYoullGetItems(promo: BirthdayPromo): string[] {
  const timingItems = formatTimingSummary(promo);
  const branches = formatBranchList(promo.participatingBranches);
  const items: string[] = [];

  const offer = promo.offer?.trim();
  if (offer) {
    items.push(formatBenefitOffer(offer));
  }

  const worthLine = formatWorthLine(offer ?? null, promo.offerValuePhpEst);
  if (worthLine && !isRedundantBenefitItem(worthLine, items)) {
    items.push(worthLine);
  }

  for (const extra of getExtraBenefitItems(promo, timingItems, branches)) {
    if (!isRedundantBenefitItem(extra, items)) {
      items.push(extra);
    }
  }

  return items;
}

export function formatTimingSummary(promo: BirthdayPromo): string[] {
  const items: string[] = [];
  const branches = formatBranchList(promo.participatingBranches);
  const exactDay = isAffirmative(promo.exactBirthday);
  const birthMonth = isAffirmative(promo.birthMonth);
  const promoEndDate = getPromoEndDate(promo.promoValidityEnd);

  if (exactDay && birthMonth) {
    items.push("On your exact birthday, or any day during your birth month");
  } else if (birthMonth) {
    items.push("Any day during your birth month");
  } else if (exactDay) {
    items.push("On your exact birthday only");
  }

  appendUniqueTimingItems(
    items,
    formatReadablePromoText(promo.otherValidityPeriod).filter(
      (clause) =>
        !isRedemptionConstraint(clause) &&
        !isLocationClause(clause, promo, branches),
    ),
    promoEndDate,
  );

  const blackout = cleanValue(promo.blackoutDates);
  if (blackout) {
    appendUniqueTimingItems(
      items,
      formatReadablePromoText(blackout)
        .filter((entry) => !isMislabeledEndDateNote(entry) || !promoEndDate)
        .map((entry) =>
          entry.toLowerCase().startsWith("not ")
            ? entry
            : `Not available: ${entry}`,
        ),
      promoEndDate,
    );
  }

  const validUntil = formatValidityEnd(promo.promoValidityEnd);
  if (validUntil) {
    appendUniqueTimingItems(items, [validUntil], promoEndDate);
  }

  return items;
}

export function formatRequirementItems(promo: BirthdayPromo): string[] {
  const items: string[] = [];

  const companions = cleanValue(promo.requiredCompanions);
  if (companions) {
    if (/^\d+$/.test(companions) && Number(companions) === 0) {
      items.push("No paying companions required");
    } else if (/^\d+$/.test(companions)) {
      const count = Number(companions);
      items.push(`Bring ${count} paying companion${count === 1 ? "" : "s"}`);
    } else {
      items.push(`Bring ${companions}`);
    }
  }

  const minimumSpend = cleanValue(promo.minimumSpendPhp);
  if (minimumSpend) {
    items.push(
      minimumSpend.toLowerCase().includes("none")
        ? "No minimum spend for you"
        : `Spend note: ${minimumSpend}`,
    );
  }

  const membership = cleanValue(promo.membershipRequired);
  if (membership) {
    items.push(`Membership: ${membership}`);
  }

  const app = cleanValue(promo.appRequired);
  if (app) {
    const appMatch = app.match(/^yes\s*(?:\((.+)\)|(.+))?$/i);
    if (appMatch) {
      const appName = (appMatch[1] ?? appMatch[2] ?? "").trim();
      items.push(appName ? `${appName} required` : "App required");
    } else if (isAffirmative(app)) {
      items.push("App required");
    } else {
      items.push(app);
    }
  }

  const card = cleanValue(promo.cardRequired);
  const cardListFromNotes = extractCardListFromNotes(promo.notes);
  if (card) {
    if (isAffirmative(card) && cardListFromNotes) {
      items.push(`Eligible cards: ${cardListFromNotes}`);
    } else if (isAffirmative(card)) {
      items.push("Card required");
    } else {
      items.push(`Card: ${card}`);
    }
  } else if (cardListFromNotes) {
    items.push(`Eligible cards: ${cardListFromNotes}`);
  }

  const idRequirement = cleanValue(promo.idRequirement);
  if (idRequirement) {
    const normalized = idRequirement.replace(/^valid /i, "valid ");
    items.push(
      /^valid /i.test(normalized)
        ? `Bring a ${normalized.charAt(0).toLowerCase()}${normalized.slice(1)}`
        : `Bring ${normalized}`,
    );
  }

  const reservation = cleanValue(promo.reservationRequired);
  if (reservation) {
    if (isAffirmative(reservation)) {
      items.push("Reservation required");
    } else if (reservation.toLowerCase().includes("recommend")) {
      items.push("Reservation recommended");
    } else {
      items.push(`Reservation: ${reservation}`);
    }
  }

  return items.map(formatPesoInText);
}

export function formatBranchList(
  participatingBranches: string | null,
): string[] {
  const cleaned = cleanValue(participatingBranches);
  if (!cleaned) return [];

  return cleaned
    .split(/[;|]/)
    .map((branch) => branch.trim())
    .filter(Boolean);
}

export function getPromoDetailHighlights(
  promo: BirthdayPromo,
): PromoDetailHighlights {
  const timingItems = formatTimingSummary(promo);

  return {
    value: formatEstimatedValue(promo.offerValuePhpEst),
    timing: timingItems[0] ?? null,
    area: cleanValue(promo.locationRegion),
  };
}

export function getPromoDetailSections(
  promo: BirthdayPromo,
): PromoDetailSection[] {
  const sections: PromoDetailSection[] = [];
  const whatYoullGet = formatWhatYoullGetItems(promo);

  if (whatYoullGet.length > 0) {
    sections.push({
      id: "benefits",
      title: "What you'll get",
      items: whatYoullGet,
    });
  }

  const timingItems = formatTimingSummary(promo);
  if (timingItems.length > 0) {
    sections.push({
      id: "timing",
      title: "When you can use this",
      items: timingItems,
    });
  }

  const branches = formatBranchList(promo.participatingBranches);
  const baseRequirements = formatRequirementItems(promo);
  const redemptionItems = formatReadablePromoText(promo.otherValidityPeriod)
    .filter(isRedemptionConstraint)
    .map(formatPesoInText);
  const requirements = [
    ...baseRequirements,
    ...redemptionItems.filter((item) => !baseRequirements.includes(item)),
  ];
  if (requirements.length > 0) {
    sections.push({
      id: "requirements",
      title: "Requirements",
      items: requirements,
    });
  }
  if (branches.length > 0) {
    sections.push({
      id: "branches",
      title: "Where to redeem",
      items: branches,
    });
  } else if (promo.locationRegion) {
    sections.push({
      id: "branches",
      title: "Where to redeem",
      items: [promo.locationRegion],
    });
  }

  return sections;
}

export function getPromoVerificationBadge(
  status: string | null,
): { label: string; variant: "verified" | "check" } | null {
  if (!status) return null;

  const normalized = status.toLowerCase();
  if (normalized.includes("verified")) {
    return { label: "Verified", variant: "verified" };
  }

  if (normalized.includes("needs verify")) {
    return { label: "Confirm with store", variant: "check" };
  }

  return null;
}
