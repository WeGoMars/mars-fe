"use client"

import { useRouter } from "next/navigation"
import { useLogoutQuery, userApi } from "@/lib/api"
import { useDispatch } from "react-redux"

interface LogoutButtonProps {
  redirectTo?: string // 로그아웃 후 이동할 경로 (ex: "/", "/login")
  children?: React.ReactNode // 버튼 텍스트나 아이콘
}

export default function LogoutButton({ redirectTo = "/", children = "로그아웃" }: LogoutButtonProps) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { refetch } = useLogoutQuery(undefined, { skip: true })

  const handleLogout = async () => {
    try {
      const res = await refetch()

      if (res.data?.success === "true") {
        localStorage.removeItem("logInUser")
        dispatch(userApi.util.resetApiState())
        alert("로그아웃 되었습니다.")
        router.push(redirectTo)
      } else {
        alert("이미 세션이 만료되었거나 로그인 상태가 아닙니다.")
        router.push(redirectTo)
      }
    } catch (err) {
      console.error("로그아웃 오류:", err)
      alert("로그아웃 중 문제가 발생했습니다.")
    }
  }

  return (
    <button onClick={handleLogout}>
      {children}
    </button>
  )
}