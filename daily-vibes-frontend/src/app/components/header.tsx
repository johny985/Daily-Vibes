"use client";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <header>
      <span style={{ color: "white", cursor: "pointer" }} onClick={handleClick}>
        Your Vibe Today
      </span>
    </header>
  );
}
