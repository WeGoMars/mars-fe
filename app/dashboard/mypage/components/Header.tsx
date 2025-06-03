"use client"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface HeaderSectionProps {
  nickname: string | null
  onAvatarClick: () => void
}

export default function HeaderSection({ nickname, onAvatarClick }: HeaderSectionProps) {
  const router = useRouter()

  return (
    <header className="bg-white border-b">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Image
              src="/marslogo.png"
              alt="Mars 로고"
              width={30}
              height={30}
              className="rounded-full cursor-pointer"
            />
          </Link>
          <span className="text-lg font-medium">Mars</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-[#747480]">
            {nickname}님 환영합니다
          </span>
          <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80" onClick={onAvatarClick}>
            <AvatarImage src="/placeholder.svg?height=32&width=32&query=user+avatar" />
               
          </Avatar>
          <Button
            variant="default"
            size="sm"
            className="bg-[#5f80f8] hover:bg-[#4c6ef5] text-white"
            onClick={() => {
              localStorage.removeItem("logInUser")
              alert("로그아웃 되었습니다.")
              router.push("/")
            }}
          >
            로그아웃
          </Button>
        </div>
      </div>
    </header>
  )
}