import { ReactNode } from "react";
import { usePopup } from "./hook/usePopup";

interface PopupProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Popup = ({ trigger, children, className = "" }: PopupProps) => {
  const { isOpen, open, close } = usePopup();

  return (
    <div className="relative">
      <div onClick={open}>{trigger}</div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={close}
          />
          <div className={`relative z-50 ${className}`}>{children}</div>
        </div>
      )}
    </div>
  );
};
