import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

import { RetroVumeter } from "@/components/RetroVumeter";

export const metadata: Metadata = {
  title: "Caja de Herramientas Digital | Gratis y Privado",
  description: "Todas las herramientas que necesitas en un solo lugar: Unificador de Excel, QR, PDF y más. Sin registros y 100% privado en tu navegador.",
  keywords: ["excel online", "unir pdf", "generar qr", "herramientas web", "privacidad local", "marcelo bouzou", "toolbox"],
  authors: [{ name: "Marcelo Bouzou" }],
  openGraph: {
    title: "Caja de Herramientas Digital",
    description: "Utilidades simples para problemas complejos. Todo corre en tu navegador.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider>
          {children}
          <RetroVumeter />
        </ThemeProvider>
      </body>
    </html>
  );
}