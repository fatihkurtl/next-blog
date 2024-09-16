"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userStore } from "@/stores/user";
import { UserServices } from "@/helpers/users";
import api from "@/services/api";

const userServices = new UserServices(api);

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user-storage") || "{}");
  const logOut = userStore((state) => state.logout);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("user token check:", user.state.user.token);
      const isTokenValid = user.state.user.token && new Date(user.state.user.expires_at) > new Date();
      if (!isTokenValid) {
        router.push("/user/login");
      } else {
        try {
          const isValid = await userServices.userTokenController(user.state.user.token);
          console.log("isValid:", isValid);
          if (!isValid) {
            logOut();
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
  }, [user.state.user.token, router, logOut, user.state.user.expires_at]);

  return <>{children}</>;
}
