/**
 * Woodex Interior — API service layer.
 * Stage 1 (frontend-only): submissions are simulated locally.
 * Stage 2 (backend): point API_BASE at the tRPC/Hono server and these
 * functions will POST to /inquiries without changes to the UI.
 */

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export interface InquiryPayload {
  full_name: string;
  phone: string;
  email: string;
  project_type: string;
  project_location: string;
  area: string;
  services: string[];
  start_date: string;
  budget: string;
  message: string;
  source_page: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface InquiryResponse {
  success: boolean;
  inquiry_id: string;
  message: string;
}

export async function submitInquiry(data: InquiryPayload): Promise<InquiryResponse> {
  // capture UTM params automatically
  const params = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign'].forEach((k) => {
    const v = params.get(k);
    if (v) (data as unknown as Record<string, string>)[k] = v;
  });

  if (API_BASE) {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Submission failed');
    return res.json();
  }

  // frontend-only mode: simulate latency and success
  await new Promise((r) => setTimeout(r, 900));
  return {
    success: true,
    inquiry_id: `INQ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    message: 'Your inquiry has been received. Woodex Interior will contact you shortly.',
  };
}
