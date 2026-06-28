"use client";

import { useEffect } from "react";

interface ConfirmLogoutProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutModal({
  isVisible,
  onConfirm,
  onCancel,
}: ConfirmLogoutProps) {
  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="rounded-lg bg-white items-center p-6 shadow-lg">
        <h1 className="text-xl font-semibold">
          Are you sure you want to logout?
        </h1>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer hover:text-blue-500"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            className="cursor-pointer hover:text-red-500"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}