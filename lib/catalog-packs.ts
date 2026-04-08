export interface CatalogPack {
  id: string;
  title: string;
  description: string;
  itemCount: number;
  unlockedByInquiry: boolean;
}

export const catalogPacks: CatalogPack[] = [
  {
    id: "starter",
    title: "Starter Directory",
    description: "Public catalog view for open browsing and sharing.",
    itemCount: 24,
    unlockedByInquiry: false,
  },
  {
    id: "trade",
    title: "Trade Pack",
    description: "Pricing context, MOQ notes, and buyer-ready follow-up.",
    itemCount: 48,
    unlockedByInquiry: true,
  },
  {
    id: "extended",
    title: "Extended Pack",
    description: "Additional source groups released after inquiry review.",
    itemCount: 96,
    unlockedByInquiry: true,
  },
];

export const unlockedPackIds = catalogPacks
  .filter((pack) => pack.unlockedByInquiry)
  .map((pack) => pack.id);
