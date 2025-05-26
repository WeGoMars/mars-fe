import type React from "react"
export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-[#f5f7f9]">{children}</div>
}
