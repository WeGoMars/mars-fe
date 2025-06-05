'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
interface ProfileHandlerProps {
  onNicknameUpdate: (nickname: string | null) => void;
  onLoginStatusUpdate: (isLoggedIn: boolean) => void;
}

export default function ProfileHandler({
  onNicknameUpdate,
  onLoginStatusUpdate,
}: ProfileHandlerProps) {
  const router = useRouter();
  const { data, isError } = useGetProfileQuery(undefined, {
  skip: typeof window === "undefined", // 서버사이드일 때는 호출하지 않음
});

  useEffect(() => {
    if (data) {
      onNicknameUpdate(data.nick);
      onLoginStatusUpdate(true);
    } else if (isError) {
      onLoginStatusUpdate(false);
      window.location.href = "/";
    }
  }, [data, isError]);

const handleAvatarClick = () => {
  const url = new URL(window.location.href);
  url.searchParams.set("modal", "edit");
  router.push(url.toString());
};
  return(
    <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80" onClick={handleAvatarClick}>
            <AvatarImage src="/placeholder.svg?height=32&width=32&query=user+avatar" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
  )};