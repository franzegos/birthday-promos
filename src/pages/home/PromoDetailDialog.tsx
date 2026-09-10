import {
  Calendar,
  ClipboardList,
  ExternalLink,
  Gift,
  MapPin,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPromoDetailSections } from "@/lib/promos/formatPromoDetails";
import type { BirthdayPromo } from "@/lib/promos/promo.types";

type PromoDetailDialogProps = {
  promo: BirthdayPromo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function DetailSection({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Calendar;
  title: string;
  items: string[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-3xl border border-border px-4 py-3">
      <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        {title}
      </h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="text-pretty">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PromoDetailDialog({
  promo,
  open,
  onOpenChange,
}: PromoDetailDialogProps) {
  if (!promo) return null;

  const sections = getPromoDetailSections(promo);

  const benefitsSection = sections.find((section) => section.id === "benefits");
  const timingSection = sections.find((section) => section.id === "timing");
  const requirementSection = sections.find(
    (section) => section.id === "requirements",
  );
  const branchSection = sections.find((section) => section.id === "branches");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl max-sm:inset-x-0 max-sm:top-auto max-sm:bottom-0 max-sm:max-h-[92dvh] max-sm:w-full max-sm:max-w-full max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-3xl">
        <div className="flex max-h-[min(90dvh,52rem)] flex-col max-sm:max-h-[92dvh]">
          <DialogHeader className="shrink-0 items-center space-y-3 p-4 pb-3 text-center sm:p-6 sm:pb-4">
            <BrandLogo
              brand={promo.brand}
              officialSourceUrl={promo.officialSourceUrl}
              size="dialog"
              className="!size-20"
            />
            <div className="flex items-center justify-center gap-1.5">
              <DialogTitle className="text-lg leading-tight">
                {promo.brand}
              </DialogTitle>
              <VerificationBadge
                status={promo.verificationStatus}
                lastChecked={promo.lastChecked}
                verifiedOnly
                iconClassName="size-4"
              />
            </div>
            <DialogDescription className="sr-only">
              {promo.offer}
            </DialogDescription>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <Badge variant="outline" className="text-[11px]">
                {promo.category}
              </Badge>
              {promo.niche ? (
                <Badge variant="outline" className="text-[11px]">
                  {promo.niche}
                </Badge>
              ) : null}
            </div>
          </DialogHeader>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4 sm:px-6">
            {benefitsSection ? (
              <DetailSection
                icon={Gift}
                title={benefitsSection.title ?? "What you'll get"}
                items={benefitsSection.items}
              />
            ) : null}

            {timingSection ? (
              <DetailSection
                icon={Calendar}
                title={timingSection.title ?? "When you can use this"}
                items={timingSection.items}
              />
            ) : null}

            {requirementSection ? (
              <DetailSection
                icon={ClipboardList}
                title={requirementSection.title ?? "Requirements"}
                items={requirementSection.items}
              />
            ) : null}

            {branchSection ? (
              <DetailSection
                icon={MapPin}
                title={branchSection.title ?? "Where to redeem"}
                items={branchSection.items}
              />
            ) : null}
          </div>

          {promo.officialSourceUrl ? (
            <div className="shrink-0 border-t border-border p-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 sm:pt-4 sm:pb-6">
              <Button asChild className="w-full rounded-full">
                <a
                  href={promo.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View official promo
                  <ExternalLink className="size-4" aria-hidden />
                </a>
              </Button>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
