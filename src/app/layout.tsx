import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Benny Amirul | Developer Portfolio",
  description:
    "Modern developer portfolio built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.",
};

/**
 * Root layout menyiapkan sidebar fixed di kiri dan konten utama yang terdorong ke kanan.
 * Struktur ini membuat halaman terasa lebih padat, konsisten, dan lebih mudah dibaca di desktop.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-background text-slate-800">
        <Sidebar />
        <div className="md:pl-[260px]">
          <main className="min-h-screen">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
