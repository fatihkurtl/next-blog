"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useSwal } from "@/utils/useSwal";
import api from "@/services/api";
import { UserServices } from "@/helpers/users";
import { UserRegister } from "@/interfaces/user";

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

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userData);
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
        router.push("/user/login");
      } else {
        console.log("Unexpected response:", response.data);
        setError(response.data.error || "Beklenmeyen bir yanıt alındı.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Kayıt Ol</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row gy-3 gy-md-4 overflow-hidden">
                  <div className="col-12">
                    <label htmlFor="fullname" className="form-label">
                      Ad Soyad <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullname"
                      id="fullname"
                      value={userData.fullname}
                      onChange={handleChange}
                      placeholder="Tam Ad"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="username" className="form-label">
                      Kullanıcı Adı <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      id="username"
                      value={userData.username}
                      onChange={handleChange}
                      placeholder="Kullanıcı Adı"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      E-posta <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      id="email"
                      value={userData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="password" className="form-label">
                      Şifre <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      id="password"
                      value={userData.password}
                      onChange={handleChange}
                      placeholder="********"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="confirmPassword" className="form-label">
                      Şifre tekrarı <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder="********"
                      value={userData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="terms"
                        id="terms"
                        onChange={handleChange}
                      />
                      <label
                        className={`form-check-label ${
                          error !== ""
                            ? userData.terms
                              ? "text-secondary"
                              : "text-danger"
                            : "text-secondary"
                        }`}
                        htmlFor="terms"
                      >
                        Hüküm ve koşulları kabul ediyorum.
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-grid">
                      <button
                        className="btn bsb-btn-xl btn-primary"
                        type="submit"
                      >
                        Kayıt Ol
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              <div className="mt-3 text-center">
                Zaten hesabınız var mı?{" "}
                <Link href="/user/login">Giriş Yap</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
