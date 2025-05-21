"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
// import LoginModal from "@/components/login-modal"
import LoginModal from "./login-modal"


export default function LoginButton() {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    console.log("Modal state changing to:", newOpen)
    setOpen(newOpen)
  }

  const handleClick = () => {
    console.log("Login button clicked")
    setOpen(true)
  }

  return (
    <>
      <Button onClick={handleClick} className="w-full bg-[#5f80f8] hover:bg-[#5f80f8]/90">
        Login
      </Button>
      <LoginModal open={open} onOpenChange={handleOpenChange} />
    </>
  )
}
