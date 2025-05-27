"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, User, ArrowRight, Camera } from "lucide-react"

export default function MyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const isProfileEditOpen = searchParams.get("modal") === "edit"
  const [nickname, setNickname] = useState("")
  const [password, setPassword] = useState("")
  const [profileImage, setProfileImage] = useState("")

  const handleAvatarClick = () => {
    const url = new URL(window.location.href)
    url.searchParams.set("modal", "edit")
    router.push(url.toString())
  }

  const handleCloseModal = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete("modal")
    router.push(url.pathname)
  }

  const handleSubmit = () => {
    console.log("Profile updated:", { nickname, password })
    handleCloseModal()
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      {isProfileEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md mx-auto relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-[#747480] hover:text-[#3c3c43] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 pt-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#000000] mb-8">프로필편집</h2>
              </div>

              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-[#eaf2ff] rounded-2xl flex items-center justify-center mb-3">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <User className="w-12 h-12 text-[#b4dbff]" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-upload"
                  />
                </div>
                <label
                  htmlFor="profile-upload"
                  className="text-sm text-[#747480] cursor-pointer hover:text-[#5f80f8] transition-colors flex items-center gap-1"
                >
                  <Camera className="w-4 h-4" />
                  사진변경
                </label>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-[#3c3c43] mb-2">NickName</label>
                  <Input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full bg-[#bfdbfe] border-0 rounded-lg h-12 text-[#3c3c43] placeholder:text-[#747480]"
                    placeholder="닉네임을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3c3c43] mb-2">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#bfdbfe] border-0 rounded-lg h-12 text-[#3c3c43] placeholder:text-[#747480]"
                    placeholder="비밀번호를 입력하세요"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  className="bg-[#5f80f8] hover:bg-[#4c6ef5] text-white rounded-full px-8 py-3 flex items-center gap-2 text-sm font-medium"
                >
                  수정하기
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}