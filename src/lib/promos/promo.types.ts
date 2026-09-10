export type BirthdayPromo = {
  brand: string;
  category: string;
  niche: string | null;
  offer: string | null;
  offerValuePhpEst: string | null;
  exactBirthday: string | null;
  birthMonth: string | null;
  otherValidityPeriod: string | null;
  requiredCompanions: string | null;
  minimumSpendPhp: string | null;
  membershipRequired: string | null;
  appRequired: string | null;
  cardRequired: string | null;
  idRequirement: string | null;
  reservationRequired: string | null;
  participatingBranches: string | null;
  locationRegion: string | null;
  blackoutDates: string | null;
  promoValidityEnd: string | null;
  officialSourceUrl: string | null;
  otherSources: string | null;
  sourceType: string | null;
  verificationStatus: string | null;
  lastChecked: string | null;
  notes: string | null;
};

export type BirthdayPromosDatabase = {
  meta: {
    title: string;
    compiled: string;
    totalEntries: number;
    sourceFile: string;
  };
  promos: BirthdayPromo[];
};

export type PromoFilters = {
  query: string;
  category: string;
  verificationStatus: string;
};
