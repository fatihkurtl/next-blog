"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { UserServices } from "@/helpers/users";
import { UserLogin } from "@/interfaces/user";
import { userStore } from "@/stores/user";
import { useSwal } from "@/utils/useSwal";
import { getUserData } from "@/middlewares/user-save";
import LoginForm from "@/components/user/login-form";

const userServices = new UserServices(api);

export default function Login() {
  const [userData, setUserData] = useState<UserLogin>({
    email: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveUser = userStore((state) => state.setUser);

  const alerts = useSwal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await userServices.loginUser(userData);
      if (response.success) {
        saveUser(response.user);
        await getUserData(response.user.id, saveUser);
        alerts.success("Hosgeldiniz", "Giriş yapıldı.");
        setTimeout(() => {        
          router.push("/");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      setError("E-posta ya da şifre yanlış. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <LoginForm
            userData={userData}
            error={error}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}