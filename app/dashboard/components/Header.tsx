"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface HeaderProps {
  nickname: string | null;
  onAvatarClick: () => void;
  onToggleMobileMenu: () => void;
}

export default function Header({ nickname, onAvatarClick, onToggleMobileMenu }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center gap-2">
        <button className="lg:hidden mr-2" onClick={onToggleMobileMenu}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <Image src="/marslogo.png" alt="Mars 로고" width={40} height={40} className="rounded-full" />
        <span className="text-lg font-medium">mars</span>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <Link
          href="dashboard/mypage"
          className="flex items-center gap-2 text-sm text-gray-600 hover:opacity-80 transition-opacity"
        >
          <span>{nickname ? `${nickname}님 환영합니다` : "mars 모투에 오신걸 환영합니다"}</span>
        </Link>

        <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80" onClick={onAvatarClick}>
          <AvatarImage src="/placeholder.svg?height=32&width=32&query=user+avatar" />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>

        <Link
          href="dashboard/mypage"
          className="flex items-center gap-2 text-sm text-gray-600 hover:opacity-80 transition-opacity"
        >
          내계좌
        </Link>

        <Button
          variant="default"
          size="sm"
          className="bg-[#5f80f8] hover:bg-[#4c6ef5] text-white"
          onClick={() => {
            localStorage.removeItem("logInUser");
            alert("로그아웃 되었습니다.");
            router.push("/");
          }}
        >
          로그아웃
        </Button>
      </div>

      <div className="md:hidden">
        <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
      </div>
    </header>
  );
}