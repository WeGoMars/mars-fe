import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"


export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f5f7f9] p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <p className="text-sm text-[#747480]">MARS 모의투자에 오신걸 환영합니다 !!!</p>
          <h2 className="mt-2 text-3xl font-bold text-[#000000]">로그인</h2>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="email">Email</Label>
              <span className="text-xs text-[#747480]">email 찾기</span>
            </div>
            <Input
              id="email"
              type="email"
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
            <Input id="password" type="password" className="border-none bg-[#bfdbfe]" required />
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

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-[#747480] hover:text-[#5f80f8]">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
