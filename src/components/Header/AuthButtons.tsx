// src/components/Header/AuthButtons.tsx
import Link from "next/link";

export const AuthButtons = () => {
  return (
    <>
      <Link
        href="/signin"
        className="hidden px-6 py-3 bg-[#4A6CF7] text-white text-sm rounded-full font-medium hover:bg-[#4A6CF7]/90 transition md:block"
      >
        Sign In
      </Link>
    </>
  );
};
