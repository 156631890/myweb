import { promises as fs } from "fs";
import path from "path";
import type { WholesaleInquiry } from "@/types";

const storagePath = path.join(process.cwd(), ".next", "cache", "wholesale-inquiries.json");

async function ensureStorageDir() {
  await fs.mkdir(path.dirname(storagePath), { recursive: true });
}

export async function readWholesaleInquiries(): Promise<WholesaleInquiry[]> {
  try {
    const raw = await fs.readFile(storagePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WholesaleInquiry[]) : [];
  } catch {
    return [];
  }
}

export async function saveWholesaleInquiry(
  inquiry: Omit<WholesaleInquiry, "id" | "createdAt">
): Promise<WholesaleInquiry> {
  const current = await readWholesaleInquiries();
  const record: WholesaleInquiry = {
    ...inquiry,
    id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  current.unshift(record);

  await ensureStorageDir();
  await fs.writeFile(storagePath, JSON.stringify(current, null, 2), "utf8");

  return record;
}
