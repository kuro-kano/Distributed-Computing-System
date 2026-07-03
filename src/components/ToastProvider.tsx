"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: "#1f2937",
          color: "#f3f4f6",
          border: "1px solid #374151",
        },
        success: {
          iconTheme: { primary: "#22c55e", secondary: "#1f2937" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#1f2937" },
        },
      }}
    />
  );
}
