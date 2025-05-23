"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

type FormErrors = {
  email?: string
  password?: string
  nickname?: string
  phoneNumber?: string
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    phoneNumber: "010-",
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

    // Phone number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be in format 010-XXXX-XXXX"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("회원가입 버튼 클릭됨") // 👉 버튼 눌렀는지 확인

    if (validateForm()) {
      // If validation passes, you would typically send the data to your server here
      console.log("Form submitted:", formData)
      alert("회원가입 완료.!")
      onClose()
    }
  }

  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      {/* Close button positioned in the top-right corner of the modal window frame */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
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
            <div className="mb-4 text-3xl font-light text-[#bfdbfe]">Logo Here</div>
            <p className="text-sm text-[#3c3c43]">MARS 모의투자에 오신걸 환영합니다 !!!</p>
          </div>

          <h1 className="mb-6 text-3xl font-bold text-[#000000]">회원가입</h1>

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
                placeholder="test@gmail.com"
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
                className={`w-full rounded bg-[#bfdbfe]/30 p-3 outline-none ${errors.nickname ? "border border-red-500" : ""}`}
              />
              {errors.nickname && <p className="mt-1 text-xs text-red-500">{errors.nickname}</p>}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="mb-1 block text-sm font-medium text-[#3c3c43]">
                phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                inputMode="numeric"
                // pattern="[0-9]*"
                value={formData.phoneNumber}
                // onChange={handleChange}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 11) // 최대 11자리
                  let formatted = raw
                
                  if (raw.length >= 4 && raw.length < 8) {
                    formatted = raw.slice(0, 3) + "-" + raw.slice(3)
                  } else if (raw.length >= 8) {
                    formatted = raw.slice(0, 3) + "-" + raw.slice(3, 7) + "-" + raw.slice(7)
                  }
                
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: formatted,
                  }))
                }}
                className={`w-full rounded bg-[#bfdbfe]/30 p-3 outline-none ${errors.phoneNumber ? "border border-red-500" : ""}`}
              />
              {errors.phoneNumber && <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>}
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-[#5f80f8] py-3 text-white hover:bg-[#5f80f8]/90"
            >
              회원가입
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#747480]">
            이미 계정이 있으신가요?{" "}
            <a href="#" className="text-[#5f80f8] hover:underline">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
