"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
// import { X } from "lucide-react"

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
    console.log("Login attempt with:", email, password)
    
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    const matchUser = users.find(
      (user:any) => user.email === email && user.password === password
    )

    if (matchUser) {
      alert(`환영합니다, ${matchUser.nickname}님!`)

      // 로그인 상태를 localStorage에 저장할 수도 있음
      localStorage.setItem("logInUser", JSON.stringify(matchUser))

      // 초기화 및 모달 닫기
      setEmail("")
      setPassword("")
      onOpenChange(false)

      // 필요하면 페이지 이동도 가능
      // router.push("/dashboard")
    }else{
      alert("이메일  또는 비밀번호가 올바르지 않습니다.")
    }


  }

  const handleGoBack = () => {
    onOpenChange(false)
    setTimeout(() => {
      router.back()
    }, 100)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-[#f5f7f9] dark:bg-gray-900/80" />

      {open && (
        <>
          <div
            className="fixed left-8 top-8 z-[60] h-10 w-10 cursor-pointer transition-transform hover:scale-105"
            onClick={handleGoBack}
            title="Go back"
          >
            <Image src="/marslogo.png" alt="Logo" width={40} height={40} className="rounded-full" />
          </div>
          {/* <button
            onClick={handleGoBack}
            className="fixed right-8 top-8 z-[60] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            title="닫기"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">닫기</span>
          </button> */}
        </>
      )}

      <DialogContent className="p-0 border-none bg-transparent max-w-full">
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#f5f7f9] dark:bg-gray-900 p-4 w-full">
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-8 shadow-lg">
            <div className="mb-6 text-center">
              <p className="text-sm text-[#747480] dark:text-gray-400">MARS 모의투자에 오신걸 환영합니다 !!!</p>
              <h2 className="mt-2 text-3xl font-bold text-[#000000] dark:text-white">로그인</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                </div>
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
                  <span className="text-xs text-[#747480] dark:text-gray-400 hover:text-[#5f80f8] dark:hover:text-blue-400 cursor-pointer">비밀번호 찾기</span>
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

              {/* <div className="text-center text-sm">
                <span className="text-[#747480] dark:text-gray-400">아직회원이 아니신가요?</span>{" "}
                <Link href="#" className="text-[#5f80f8] dark:text-blue-400 hover:underline">
                  join us
                </Link>
              </div> */}
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

            <div className="mt-8 text-center">
            </div>
          </div>
        </main>
      </DialogContent>
    </Dialog>
  )
}