import React from "react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onOpenChange }) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "32px 24px",
          minWidth: "320px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 16 }}>로그인</h2>
        <div style={{ marginBottom: 24 }}>Login Modal</div>
        <button
          style={{
            padding: "8px 24px",
            borderRadius: "8px",
            background: "#006ffd",
            color: "white",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => onOpenChange(false)}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default LoginModal; 