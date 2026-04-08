import { NextResponse } from "next/server";
import { unlockedPackIds } from "@/lib/catalog-packs";
import { saveWholesaleInquiry } from "@/lib/wholesale-storage";

interface InquiryPayload {
  name?: string;
  email?: string;
  company?: string;
  country?: string;
  items?: string;
  quantity?: string;
  notes?: string;
  sourceUrl?: string;
}

function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as InquiryPayload;

  if (!payload.name || !payload.email || !payload.items) {
    return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
  }

  if (!isValidEmail(payload.email)) {
    return NextResponse.json({ message: "Invalid email address." }, { status: 400 });
  }

  const saved = await saveWholesaleInquiry({
    name: payload.name.trim(),
    email: payload.email.trim(),
    company: payload.company?.trim() || undefined,
    country: payload.country?.trim() || undefined,
    items: payload.items.trim(),
    quantity: payload.quantity?.trim() || undefined,
    notes: payload.notes?.trim() || undefined,
    sourceUrl: payload.sourceUrl?.trim() || undefined,
  });

  const webhookUrl = process.env.WHOLESALE_INQUIRY_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(saved),
      });
    } catch {
      // Keep the local persistence even if the webhook fails.
    }
  }

  return NextResponse.json({
    ok: true,
    inquiryId: saved.id,
    unlock: {
      token: saved.id,
      packIds: unlockedPackIds,
    },
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "POST wholesale inquiries to this endpoint.",
  });
}
