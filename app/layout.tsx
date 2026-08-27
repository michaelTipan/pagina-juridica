import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { getSiteConfig } from '@/lib/data';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const description =
    'Estudio jurídico boutique en Ecuador. Asesoría legal estratégica, personalizada y transparente en derecho civil, penal, laboral, familiar, empresarial y administrativo.';

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
    ),
    title: {
      default: `${config.nombre_estudio} | Estudio Jurídico en Ecuador`,
      template: `%s | ${config.nombre_estudio}`,
    },
    description,
    keywords: [
      'abogados Ecuador',
      'estudio jurídico Quito',
      'derecho civil',
      'derecho penal',
      'derecho laboral',
      'derecho familiar',
      'derecho empresarial',
      'asesoría legal Ecuador',
      'abogados boutique Ecuador',
    ],
    openGraph: {
      type: 'website',
      locale: 'es_EC',
      title: `${config.nombre_estudio} | Estudio Jurídico en Ecuador`,
      description,
      siteName: config.nombre_estudio,
    },
    twitter: {
      card: 'summary_large_image',
      title: config.nombre_estudio,
      description,
    },
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getSiteConfig();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: config.nombre_estudio,
    description:
      'Estudio jurídico boutique en Ecuador. Asesoría legal estratégica y personalizada.',
    areaServed: 'EC',
    email: config.email,
    address: config.direccion
      ? { '@type': 'PostalAddress', streetAddress: config.direccion, addressCountry: 'EC' }
      : undefined,
    sameAs: [config.facebook, config.instagram, config.linkedin].filter(Boolean),
  };

  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
