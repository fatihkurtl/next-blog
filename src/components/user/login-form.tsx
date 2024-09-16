import React from "react";
import Link from "next/link";
import { UserLogin } from "@/interfaces/user";

interface LoginFormProps {
  userData: UserLogin;
  error: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function LoginForm({
  userData,
  error,
  handleChange,
  handleSubmit,
}: LoginFormProps) {
  return (
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
                  checked={userData.remember}
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
                <button className="btn bsb-btn-xl btn-primary" type="submit">
                  Giriş Yap
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="mt-3 text-center">
          Hesabınız yok mu? <Link href="/user/register">Kayıt Ol</Link>
        </div>
      </div>
    </div>
  );
}