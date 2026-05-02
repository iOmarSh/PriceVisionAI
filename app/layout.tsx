import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "PriceVision AI — Predict House Prices Instantly with AI",
  description:
    "Accurate real estate market estimates powered by advanced machine learning. Get instant, data-driven home price predictions with confidence scores.",
  generator: "v0.app",
  keywords: [
    "house price prediction",
    "AI real estate",
    "machine learning property valuation",
    "home value estimator",
    "PriceVision",
  ],
  openGraph: {
    title: "PriceVision AI — Predict House Prices Instantly with AI",
    description:
      "Accurate real estate market estimates powered by advanced machine learning.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0613",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} bg-background scroll-smooth`}
    >
      <body className="font-sans antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
