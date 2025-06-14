"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image";
import { useSignUpMutation } from "@/lib/api";
import { useCreateWalletMutation } from "@/lib/api"; 
interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

type FormErrors = {
  email?: string
  password?: string
  nickname?: string

}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const router = useRouter()
  const [signUpMutation] = useSignUpMutation(); //  훅으로부터 mutation 함수 가져오기
  const [createWallet] = useCreateWalletMutation(); //  지갑 생성 mutation
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",

  })
  const [errors, setErrors] = useState<FormErrors>({})

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof FormErrors]
        return newErrors
      })
    }
  }
  //유효성 검사 함수 
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    // Nickname validation
    if (!formData.nickname) {
      newErrors.nickname = "Nickname is required"
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = "Nickname must be at least 2 characters"
    }


    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm())
      return

    try {
      const response = await signUpMutation(formData).unwrap(); // ✅ 이렇게 호출해야 됨
      console.log("회원가입 성공:", response);
      // ✅ 예: router.push("/login") 등 추가 가능
      //회원가입 성공시 지갑 자동생성
      await createWallet({ amount: 100000 });
       console.log("시드머니 지갑 생성 완료");
      //폼데이터 초기화
      setFormData({ email: "", password: "", nickname: "" });
      setErrors({});
      onClose();

    } catch (err) {
      console.error("회원가입 실패:", err);
    }
  };



  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#eff5ff] via-[#e9f0ff] to-[#dfe8ff] backdrop-blur-sm p-4"

    >
      {/* ✅ 마크 링크: 가장 먼저, 가장 위에! */}
      <Link
        href="/"
        className="fixed left-4 top-4 z-[9999]"
        title="홈으로 이동"
      >
        <Image
          src="/mars_logo_main.png"
          alt="Mars 로고"
          width={60}
          height={60}
          className="rounded-full cursor-pointer"
        />
      </Link>
      {/* <span className="fixed left-7 top-4 text-lg font-medium">Mars</span> */}
      {/* <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}> */}
      {/* Close button positioned in the top-right corner of the modal window frame */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-black/20"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      <div
        className="relative max-h-[90vh] w-full max-w-md overflow -auto rounded-lg bg-white shadow-lg"
        onClick={handleModalClick}
      >
        <div className="p-8">
          <div className="mb-6 text-center">
            {/* <div className="mb-4 text-3xl font-light text-[#bfdbfe]">Logo Here</div> */}
            <p className="text-sm text-[#3c3c43]">MARS 모의투자에 오신걸 환영합니다 !!!</p>
          </div>

          <h1 className="mb-6 text-3xl font-bold text-[#000000] text-center">회원가입</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#3c3c43]">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일"
                className={`w-full rounded bg-[#bfdbfe]/30 p-3 outline-none ${errors.email ? "border border-red-500" : ""}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-[#3c3c43]">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호 (8자 이상)"
                className={`w-full rounded bg-[#bfdbfe]/30 p-3 outline-none ${errors.password ? "border border-red-500" : ""}`}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="nickname" className="mb-1 block text-sm font-medium text-[#3c3c43]">
                NickName
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="닉네임 2자 이상"
                className={`w-full rounded bg-[#bfdbfe]/30 p-3 outline-none ${errors.nickname ? "border border-red-500" : ""}`}
              />
              {errors.nickname && <p className="mt-1 text-xs text-red-500">{errors.nickname}</p>}
            </div>


            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-[#5f80f8] py-3 text-white hover:bg-[#5f80f8]/90"
            >
              회원가입
            </button>
          </form>
          {/* test */}

          <div className="text-center text-sm">
            <span className="text-[#747480] dark:text-gray-400">이미 계정이 있으신가요?</span>{" "}
            <button
              type="button"
              onClick={() => {
                const url = new URL(window.location.href)
                url.searchParams.set("modal", "login")
                router.push(url.toString())
              }}
              className="text-[#5f80f8] hover:underline dark:text-blue-400"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}