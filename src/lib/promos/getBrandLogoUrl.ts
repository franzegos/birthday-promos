import { getBrandLogoOverrides } from "./brandLogoOverrides";
import { getBrandWebsiteHint } from "./brandWebsiteHints";

const SOCIAL_HOSTS = new Set([
  "facebook.com",
  "m.facebook.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "tiktok.com",
]);

export function extractDomainFromUrl(url: string | null): string | null {
  if (!url) return null;

  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    if (SOCIAL_HOSTS.has(hostname)) return null;
    return hostname;
  } catch {
    return null;
  }
}

function getDomainLogoCandidates(domain: string): string[] {
  // ponytail: one favicon URL per brand — fewer failed img loads in the console
  return [`https://www.google.com/s2/favicons?domain=${domain}&sz=128`];
}

export function getBrandLogoCandidates(
  brand: string,
  officialSourceUrl: string | null,
): string[] {
  const overrides = getBrandLogoOverrides(brand, officialSourceUrl);
  const domain =
    extractDomainFromUrl(officialSourceUrl) ?? getBrandWebsiteHint(brand);
  const domainLogos = domain ? getDomainLogoCandidates(domain) : [];

  return [...new Set([...overrides, ...domainLogos])];
}

export function getBrandInitials(brand: string): string {
  return brand
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
