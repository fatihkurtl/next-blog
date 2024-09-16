"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSwal } from "@/utils/useSwal";
import api from "@/services/api";
import { UserServices } from "@/helpers/users";
import { UserRegister } from "@/interfaces/user";
import RegisterForm from "@/components/user/register-form";

const userServices = new UserServices(api);

export default function Register() {
  const [userData, setUserData] = useState<UserRegister>({
    fullname: "",
    username: "",
    email: "",
    image: null,
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const alerts = useSwal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (userData.password !== userData.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      alerts.error("Hata", "Şifreler eşleşmiyor.");
      return;
    }
    if (!userData.terms) {
      setError("Hüküm ve koşullar kabul edilmeli.");
      alerts.error("Hata", "Hüküm ve koşullar kabul edilmeli.");
      return;
    }

    try {
      const response = await userServices.saveUser(userData);
      if (response.success) {
        alerts.success("Başarılı", "Kayıt yapıldı, yönlendiriliyorsunuz...");
        setUserData({
          fullname: "",
          username: "",
          email: "",
          image: null,
          password: "",
          confirmPassword: "",
          terms: false,
        });
        setTimeout(() => {
          router.push("/user/login");
        }, 1000);
      } else {
        console.log("Unexpected response:", response.data);
        setError(response.data.error || "Beklenmeyen bir yanıt alındı.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <RegisterForm
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