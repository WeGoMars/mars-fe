import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css";
import { store } from "@/lib/store"; //
import { Provider } from "react-redux";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MARS - Market Analysis & Real-time Simulation",
  description: "MARS(Market Analysis & Real-time Simulation)",
    generator: 'v0.dev',
  icons: {
    icon: '/mars-icon.png',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Provider store={store}>
        {children}
        </Provider>
        </body>
    </html>
  )
}
