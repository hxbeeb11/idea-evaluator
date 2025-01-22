import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from './components/Header'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "Idea Evaluator - AI-Powered Business Idea Analysis",
  description: "Get comprehensive analysis of your business ideas using advanced AI. Receive detailed evaluations covering market potential, technical feasibility, financial projections, and implementation strategies.",
  keywords: [
    "business idea evaluation",
    "AI analysis",
    "market analysis",
    "startup validation",
    "business planning",
    "idea assessment",
    "financial projections",
    "market research"
  ],
  authors: [{ name: "Habeeb" }],
  creator: "Habeeb",
  publisher: "Idea Evaluator",
  openGraph: {
    title: "Idea Evaluator - AI-Powered Business Idea Analysis",
    description: "Transform your business ideas with AI-powered analysis and comprehensive evaluation reports.",
    type: "website",
    siteName: "Idea Evaluator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Idea Evaluator - AI-Powered Business Idea Analysis",
    description: "Transform your business ideas with AI-powered analysis and comprehensive evaluation reports.",
    creator: "@habeeb",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#ECF0F1]">
        <Header />
        {children}
      </body>
    </html>
  );
}
