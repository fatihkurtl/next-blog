"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userStore } from "@/stores/user";
import { UserServices } from "@/helpers/users";
import api from "@/services/api";

const userServices = new UserServices(api);

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = userStore((state) => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      const isTokenValid = user.token && new Date(user.expires_at) > new Date();
      if (!isTokenValid) {
        router.push("/user/login");
      } else {
        try {
          const isValid = await userServices.userTokenController(user.token);
          if (!isValid) {
            userStore.getState().logout();
            router.push("/user/login");
          }
        } catch (error) {
          console.error("Token kontrol hatası:", error);
          router.push("/user/login");
        }
      }
    };

    if (window.location.pathname.includes("/auth/")) {
      checkAuth();
    }
  }, []);

  return <>{children}</>;
}
