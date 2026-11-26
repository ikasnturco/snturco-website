import { site } from '@/config/site';
import { IconWhatsApp } from './Icons';

/** Shown only when a WhatsApp number is set in src/config/site.ts. */
export function WhatsAppButton({ label }: { label: string }) {
  if (!site.whatsapp) return null;
  return (
    <a
      href={`https://wa.me/${site.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed bottom-5 end-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 print:hidden"
    >
      <IconWhatsApp />
    </a>
  );
}
