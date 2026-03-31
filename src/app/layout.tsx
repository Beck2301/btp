import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { AuthSessionProvider } from "@/components/auth-session-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: {
    default: "Busca Tu Placa (BTP) — perdidas y encontradas",
    template: "%s · BTP",
  },
  description:
    "Publica y busca placas vehiculares perdidas o encontradas. Contacto seguro entre personas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <AuthSessionProvider>
          <SiteHeader />
          <main className="main-shell mx-auto w-full max-w-7xl flex-1 px-4 pb-8 sm:px-6 sm:pb-10 lg:px-10 lg:pb-12">
            {children}
          </main>
          <SiteFooter />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
