'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/lib/api"; // RTK Query를 이용해 유저 프로필 정보를 가져오는 API 훅
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // 사용자 아바타 UI 컴포넌트
import { Input } from "@/components/ui/input"; // (현재 사용하지 않지만 추후 입력용으로 쓰일 수 있음)

// 부모 컴포넌트에 닉네임과 로그인 상태를 전달하기 위한 props 정의
interface ProfileHandlerProps {
  onNicknameUpdate: (nickname: string | null) => void;
  onLoginStatusUpdate: (isLoggedIn: boolean) => void;
}

export default function ProfileHandler({
  onNicknameUpdate,
  onLoginStatusUpdate,
}: ProfileHandlerProps) {
  const router = useRouter();

  // 클라이언트에서만 요청을 보내도록 설정
  const { data, isError } = useGetProfileQuery(undefined, {
    skip: typeof window === "undefined", // 서버사이드 렌더링 환경에서는 호출하지 않음
  });

  const [nickname, setNickname] = useState(""); // 내부 상태로 닉네임 저장

  useEffect(() => {
    // 유저 데이터를 정상적으로 받아왔을 때
    if (data) {
      setNickname(data.nick); // 내부 상태 업데이트
      onNicknameUpdate(data.nick); // 부모 컴포넌트에 닉네임 전달
      onLoginStatusUpdate(true); // 로그인 상태 true 전달
    }
    // 에러가 발생하면 로그인 상태가 아니므로 false 전달 및 홈으로 리디렉션
    else if (isError) {
      onLoginStatusUpdate(false);
      window.location.href = "/"; // 비로그인 상태 시 강제로 메인으로 이동
    }
  }, [data, isError]); // data 또는 에러 상태가 바뀔 때마다 실행

  // 아바타 클릭 시, URL에 쿼리 파라미터를 추가하여 모달을 띄우는 방식
  const handleAvatarClick = () => {
    const url = new URL(window.location.href); // 현재 URL 가져오기
    url.searchParams.set("modal", "edit"); // modal=edit 파라미터 추가
    router.push(url.toString()); // 변경된 URL로 라우팅 → 모달 제어에 활용 가능
  };

  return (
    <Avatar
      className="w-8 h-8 cursor-pointer hover:opacity-80"
      onClick={handleAvatarClick}
    >
      {/* 아바타 이미지 없을 경우 fallback 문자 M 표시 */}
      <AvatarImage src="/placeholder.svg?height=32&width=32&query=user+avatar" />
      <AvatarFallback>M</AvatarFallback>
    </Avatar>
  );
}