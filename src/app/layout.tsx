import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Vazirmatn } from "next/font/google";

const vazirFont = Vazirmatn({
    subsets: ["arabic"],
    display: "swap",
    variable: "--font-vazir",
});

const geistSans = Geist({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-geist-mono",
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" dir="ltr">
            <body className={`${geistSans.variable} ${geistMono.variable} ${vazirFont.variable} antialiased dark`}>{children}</body>
        </html>
    );
}
