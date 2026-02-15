import React, { useEffect, useState } from "react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number; // milliseconds, default 3000
}

interface ToastProps {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function Toast({ messages, onDismiss }: ToastProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "400px",
        pointerEvents: "none",
      }}
    >
      {messages.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: () => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(onDismiss, 300); // Animation
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => setIsVisible(false), toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [isVisible, toast.duration, onDismiss]);

  const bgColor = {
    success: "#d4edda",
    error: "#f8d7da",
    warning: "#fff3cd",
    info: "#d1ecf1",
  }[toast.type];

  const borderColor = {
    success: "#c3e6cb",
    error: "#f5c6cb",
    warning: "#ffeaa7",
    info: "#bee5eb",
  }[toast.type];

  const textColor = {
    success: "#155724",
    error: "#721c24",
    warning: "#856404",
    info: "#0c5460",
  }[toast.type];

  const icon = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  }[toast.type];

  return (
    <div
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 8,
        padding: "12px 16px",
        color: textColor,
        fontSize: "14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        animation: isVisible
          ? "slideIn 0.3s ease-out"
          : "slideOut 0.3s ease-out",
        pointerEvents: "all",
        display: "flex",
        gap: "8px",
        alignItems: "center",
      }}
    >
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(400px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(400px);
          }
        }
      `}</style>
      <span style={{ fontWeight: 600, fontSize: "16px" }}>{icon}</span>
      <span>{toast.message}</span>
    </div>
  );
}

export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
    duration = 3000
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    setMessages((prev) => [...prev, { id, type, message, duration }]);
  };

  const dismissToast = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  return { messages, addToast, dismissToast };
}
