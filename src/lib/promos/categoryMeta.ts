import {
  Activity,
  Gift,
  HeartPulse,
  LayoutGrid,
  PawPrint,
  Plane,
  ShoppingBag,
  Sparkles,
  Utensils,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type CategoryMeta = {
  label: string;
  icon: LucideIcon;
  imageClass: string;
};

const defaultMeta: CategoryMeta = {
  label: "Other",
  icon: Gift,
  imageClass: "bg-muted",
};

const categoryMap: Record<string, CategoryMeta> = {
  Food: {
    label: "Food",
    icon: Utensils,
    imageClass: "bg-primary/5",
  },
  Activities: {
    label: "Activities",
    icon: Activity,
    imageClass: "bg-muted",
  },
  Shopping: {
    label: "Shopping",
    icon: ShoppingBag,
    imageClass: "bg-secondary",
  },
  Financial: {
    label: "Financial",
    icon: Wallet,
    imageClass: "bg-success/10",
  },
  Beauty: {
    label: "Beauty",
    icon: Sparkles,
    imageClass: "bg-warning/10",
  },
  Travel: {
    label: "Travel",
    icon: Plane,
    imageClass: "bg-muted",
  },
  Wellness: {
    label: "Wellness",
    icon: HeartPulse,
    imageClass: "bg-success/10",
  },
  Pets: {
    label: "Pets",
    icon: PawPrint,
    imageClass: "bg-muted",
  },
  Other: {
    label: "Other",
    icon: LayoutGrid,
    imageClass: "bg-muted",
  },
};

export function getCategoryMeta(category: string | null): CategoryMeta {
  if (!category) return defaultMeta;
  return categoryMap[category] ?? defaultMeta;
}
