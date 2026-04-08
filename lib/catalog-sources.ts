import sourceFeedsData from "@/data/catalog-sources.json";
import type { CategorySlug } from "@/types";

export interface SourceFeed {
  id: string;
  label: string;
  category: CategorySlug;
  url: string;
  password?: string;
  note?: string;
}

export const sourceFeeds: SourceFeed[] = sourceFeedsData as SourceFeed[];
