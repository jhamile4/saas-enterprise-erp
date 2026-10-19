// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Strata ERP | SaaS Enterprise Business Intelligence & Inventory Engine',
  description: 'Plataforma SaaS ERP de nivel empresarial para analítica financiera, control de inventario y gestión de roles RBAC.',
  authors: [{ name: 'Jhamile Macavilca' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="bg-bgDeep text-zinc-100 antialiased selection:bg-goldAccent selection:text-bgDeep">
        {children}
      </body>
    </html>
  );
}
