import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

/*
 * Instrument Serif → Display / marketing headings
 *   Variable: --font-display
 *   Used only for: hero h1, section h2, pricing title, CTA, enterprise sections
 *   Weight 400 only (the font ships one weight; italic is a separate optical style)
 */
const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

/*
 * Geist → All application UI (nav, dashboard, cards, forms, buttons,
 *   modals, tables, auth, settings, pricing cards, footer, descriptions)
 */
const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/*
 * JetBrains Mono → Code, metrics, execution IDs, telemetry, agent logs, terminal
 */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Operon — Powered by CogniQA Systems",
  description:
    "Operon is an enterprise AI operating system developed by CogniQA Systems.",
  keywords: [
    "AI OS",
    "Business Operating System",
    "CogniQA Systems",
    "Operon",
    "Enterprise Automation",
    "pgvector",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Inject both font CSS variables so globals.css var() references resolve
      className={`${instrumentSerif.variable} ${geist.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground font-sans">
        <ThemeProvider>
          <TooltipProvider>
            {children}
            <Toaster position="top-right" richColors />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
