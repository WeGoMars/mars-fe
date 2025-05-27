"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

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
    console.log("Login attempt with:", email, password)

    const users = JSON.parse(localStorage.getItem("users") || "[]")

    const matchUser = users.find(
      (user: any) => user.email === email && user.password === password
    )

    if (matchUser) {
      alert(`환영합니다, ${matchUser.nickname}님!`)
      localStorage.setItem("logInUser", JSON.stringify(matchUser))
      setEmail("")
      setPassword("")
      onOpenChange(false)
      router.push("/dashboard")
    } else {
      alert("이메일 또는 비밀번호가 올바르지 않습니다.")
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      router.back()
    }, 100)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#eff5ff] via-[#e9f0ff] to-[#dfe8ff] backdrop-blur-sm p-4"
      
    >
      {/* 마크 로고 */}
      <Link
        href="/"
        className="fixed left-4 top-4 z-[9999]"
        title="홈으로 이동"
      >
        <Image
          src="/marslogo.png"
          alt="Mars 로고"
          width={40}
          height={40}
          className="rounded-full cursor-pointer"
        />
      </Link>
      {/* 마스로고 + 글자 크기랑 위치 수정 할수도잇음 */}
      <span className="fixed left-14 top-8 text-lg font-medium" >Mars</span>
      <button
        onClick={handleClose}
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-black/20"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* 실제 로그인 모달 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-8 shadow-lg"
      >
        <div className="mb-6 text-center">
          <p className="text-sm text-[#747480] dark:text-gray-400">
            MARS 모의투자에 오신걸 환영합니다 !!!
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[#000000] dark:text-white">로그인</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@gmail.com"
              className="border-none bg-[#bfdbfe] dark:bg-gray-700 placeholder:text-[#3c3c43]/70 dark:placeholder:text-gray-400"
              required
            />
          </div>


          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
              <span className="text-xs text-[#747480] dark:text-gray-400 hover:text-[#5f80f8] dark:hover:text-blue-400 cursor-pointer">
                비밀번호 찾기
              </span>

      
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-none bg-[#bfdbfe] dark:bg-gray-700"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#5f80f8] text-white hover:bg-[#5f80f8]/90 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            로그인
            <span className="ml-2">→</span>
          </Button>

          <div className="text-center text-sm">
            <span className="text-[#747480] dark:text-gray-400">아직회원이 아니신가요?</span>{" "}
            <button
              type="button"
              onClick={() => router.push("?modal=register")}
              className="text-[#5f80f8] dark:text-blue-400 hover:underline"
            >
              join us
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}