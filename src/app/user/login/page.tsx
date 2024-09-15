"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import { UserServices } from "@/helpers/users";
import { UserLogin } from "@/interfaces/user";
import { userStore } from "@/stores/user";
import { useSwal } from "@/utils/useSwal";

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
  const user = userStore((state) => state.user);
  useEffect(() => {
    console.log("Güncellenmiş user:", user);
  }, [user]);

  const alerts = useSwal();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    try {
      const response = await userServices.loginUser(userData);
      if (response.success) {
        saveUser(response.user);
        console.log(response);
        alerts.success("Hosgeldiniz", "Giriş yapıldı.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setError("Kullanıcı adı ya da sifre yanlış. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Giriş Yap</h2>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row gy-3 gy-md-4 overflow-hidden">
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
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="remember"
                        id="remember"
                        onChange={handleChange}
                      />
                      <label
                        className="form-check-label text-secondary"
                        htmlFor="remember"
                      >
                        Beni Hatırla
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-grid">
                      <button
                        className="btn bsb-btn-xl btn-primary"
                        type="submit"
                      >
                        Giriş Yap
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              <div className="mt-3 text-center">
                Hesabınız yok mu <Link href="/user/register">Kayıt Ol</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
