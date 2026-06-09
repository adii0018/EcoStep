"use client";

import { useState, useCallback, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = Cookies.get("ecostep_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        Cookies.remove("ecostep_user");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post("/auth/login", { email, password });
      Cookies.set("ecostep_token", data.token, { expires: 7 });
      Cookies.set("ecostep_user", JSON.stringify(data.user), { expires: 7 });
      setUser(data.user);
      router.push("/dashboard");
    },
    [router]
  );

  const register = useCallback(
    async (name, email, password) => {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      Cookies.set("ecostep_token", data.token, { expires: 7 });
      Cookies.set("ecostep_user", JSON.stringify(data.user), { expires: 7 });
      setUser(data.user);
      router.push("/dashboard");
    },
    [router]
  );

  const logout = useCallback(() => {
    Cookies.remove("ecostep_token");
    Cookies.remove("ecostep_user");
    setUser(null);
    router.push("/login");
  }, [router]);

  return { user, loading, login, register, logout };
}
