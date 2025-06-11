"use client";

import { useRouter } from "next/navigation";
import { useLogoutMutation, userApi } from "@/lib/api";
import { useDispatch } from "react-redux";
// 컴포넌트 props 타입 정의
interface LogoutButtonProps {
  redirectTo?: string;          // 로그아웃 후 이동할 경로 (기본값: "/")
  children?: React.ReactNode;   // 버튼 안에 보여줄 내용 (기본값: "로그아웃")
}
// 로그아웃 버튼 컴포넌트 정의
export default function LogoutButton({ redirectTo = "/", children = "로그아웃" }: LogoutButtonProps) {
  const router = useRouter();
  const dispatch = useDispatch();        // Redux store에 액션을 보낼 수 있게 해줌
  const [logout] = useLogoutMutation();  // RTK Query의 로그아웃 요청 함수

  const handleLogout = async () => {
  try {
    const res = await logout().unwrap();  // logout mutation 실행 후 결과 받기

    if (res?.success) {
      localStorage.removeItem("logInUser");  // 클라이언트에 저장된 로그인 정보 삭제
      dispatch(userApi.util.resetApiState());  // RTK Query의 캐시 상태 초기화
      alert("로그아웃 되었습니다.");
      router.push(redirectTo);
    } else {
      alert("이미 세션이 만료되었거나 로그인 상태가 아닙니다.");
      router.push(redirectTo);
    }
  } catch (err) {
    console.error("로그아웃 오류:", err);
    alert("로그아웃 중 문제가 발생했습니다.");
  }
};
//  버튼 렌더링
  return (
    <button onClick={handleLogout}>
      {children}
    </button>
  );
}