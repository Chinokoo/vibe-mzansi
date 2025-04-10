import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Vibe Mzansi",
  description:
    "Vibe Mzansi is where the squad vibes hard! 🎉🔥 A social media app for the youth, repping SA culture, creativity, and community. Discover lit local talent, trending tea, and connect with Mzansi magic. 💃✨",
  icons: {
    icon: "/public/assets/sa-rounded.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <head>
            <link rel="icon" href="/assets/sa-rounded.png" />
          </head>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen">
              {/* container to center the content */}
              <NavBar />
              <div className="max-w-7xl mx-auto px-4">
                {/* content goes here */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="hidden lg:block lg:col-span-3">
                    <SideBar />
                  </div>
                  <div className="lg:col-span-9">{children}</div>
                </div>
              </div>
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
