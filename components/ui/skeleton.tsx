import { cn } from "@/lib/utils"

// 로딩 상태를 표시하는 UI 컴포넌트(로드되기전에 사용자에게 로딩 중임을 시각적으로 보여주는, 스피너 역할) 컴포넌트
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
