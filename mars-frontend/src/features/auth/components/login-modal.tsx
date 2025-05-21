"use client"

import type React from "react"

import { X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt with:", email, password)
    // You would typically call an authentication API here
    alert(`Login attempt with: ${email}`)
  }

  const handleGoBack = () => {
    console.log("Navigating back...")
    // Close the modal first
    onOpenChange(false)
    // Then navigate back
    setTimeout(() => {
      router.back()
    }, 100) // Small delay to ensure modal closes smoothly before navigation
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/50 backdrop-blur-sm" />

      {/* Logo positioned outside the content area */}
      {open && (
        <div
          className="fixed left-8 top-8 z-[60] h-10 w-10 cursor-pointer transition-transform hover:scale-105"
          onClick={handleGoBack}
          title="Go back"
        >
          <Image src="/placeholder-zyos8.png" alt="Logo" width={40} height={40} className="rounded-full" />
        </div>
      )}

      {/* Close button positioned outside the content area */}
      {open && (
        <button
          onClick={handleGoBack}
          className="fixed right-8 top-8 z-[60] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          title="Go back"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Go back</span>
        </button>
      )}

      {/* Main content area */}
      <DialogContent className="border-none p-6 shadow-lg sm:max-w-md">
        <div className="mt-6 text-center">
          <p className="text-sm text-[#747480]">MARS 모의투자에 오신걸 환영합니다 !!!</p>
          <h2 className="mt-2 text-3xl font-bold text-[#000000]">로그인</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="email">Email</Label>
              <span className="text-xs text-[#747480]">email 찾기</span>
            </div>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@gmail.com"
              className="border-none bg-[#bfdbfe] placeholder:text-[#3c3c43]/70"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <span className="text-xs text-[#747480]">비밀번호 찾기</span>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-none bg-[#bfdbfe]"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-[#5f80f8] text-white hover:bg-[#5f80f8]/90">
            로그인
            <span className="ml-2">→</span>
          </Button>

          <div className="text-center text-sm">
            <span className="text-[#747480]">아직회원이 아니신가요?</span>{" "}
            <Link href="#" className="text-[#5f80f8] hover:underline">
              join us
            </Link>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
