export const revalidate = 86400;
import { SiteHeader } from '@/components/public/site-header';
import { SiteFooter } from '@/components/public/site-footer';
import { WhatsAppFloat } from '@/components/public/whatsapp-float';
import { getSiteConfig, whatsappLink } from '@/lib/data';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getSiteConfig();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader nombreEstudio={config.nombre_estudio} />
      <main className="flex-1">{children}</main>
      <SiteFooter config={config} />
      <WhatsAppFloat href={whatsappLink(config)} />
    </div>
  );
}
