// app/layout.tsx veya başka bir component
"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/userStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await fetch("/api/auth/user");
        const data = await response.json();

        if (data.user) {
          console.log("User found:", data.user);
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      }
    };

    initAuth();
  }, []);

  return <>{children}</>;
}
