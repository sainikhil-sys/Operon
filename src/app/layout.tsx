import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { JsonLd } from "@/components/seo/json-ld";

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://operon.cogniqa.systems"),
  title: {
    default: "Operon — Enterprise AI Operating System | CogniQA Systems",
    template: "%s | Operon — Enterprise AI Operating System",
  },
  description:
    "Operon is an Enterprise AI Operating System developed by CogniQA Systems. Unify Sales, Finance, Engineering, Operations, and Knowledge into a single neural intelligence graph powered by autonomous AI agents.",
  keywords: [
    "Enterprise AI Operating System",
    "AI Operating System",
    "Enterprise AI Platform",
    "Autonomous AI Agents",
    "Business AI Platform",
    "AI Workflow Automation",
    "Enterprise Automation",
    "AI Workspace",
    "Enterprise Knowledge Platform",
    "AI orchestration",
    "Business intelligence",
    "Workflow engine",
    "AI copilots",
    "Multi-agent AI",
    "Knowledge engine",
    "Operations platform",
    "CogniQA Systems",
    "Operon",
    "pgvector HNSW",
  ],
  authors: [{ name: "CogniQA Systems", url: "https://cogniqa.systems" }],
  creator: "CogniQA Systems",
  publisher: "CogniQA Systems",
  applicationName: "Operon",
  category: "Enterprise AI Operating System",
  alternates: {
    canonical: "https://operon.cogniqa.systems",
    languages: {
      "en-US": "https://operon.cogniqa.systems",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://operon.cogniqa.systems",
    siteName: "Operon",
    title: "Operon — Enterprise AI Operating System",
    description:
      "Unify Sales, Finance, Engineering, Operations, and Knowledge into a single real-time neural core with autonomous AI agents. Developed by CogniQA Systems.",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Operon Enterprise AI Operating System — CogniQA Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Operon — Enterprise AI Operating System",
    description:
      "The Enterprise AI Operating Layer For Modern Organizations. Powered by CogniQA Systems.",
    creator: "@cogniqa",
    site: "@cogniqa",
    images: ["/logo.svg"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/logo.svg", type: "image/svg+xml", sizes: "512x512" },
    ],
    shortcut: "/icon.svg",
    apple: "/logo.svg",
  },
  manifest: "/manifest.webmanifest",
  other: {
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${geist.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd />
      </head>
      <body className="min-h-full bg-background text-foreground font-sans selection:bg-[#46D296]/25 selection:text-white">
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
