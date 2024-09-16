import React, { FormEvent } from "react";
import Link from "next/link";
import { UserRegister } from "@/interfaces/user";

interface RegisterFormProps {
  userData: UserRegister;
  error: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function RegisterForm({
  userData,
  error,
  handleChange,
  handleSubmit,
}: RegisterFormProps) {
  return (
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
                  checked={userData.terms}
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
                <button className="btn bsb-btn-xl btn-primary" type="submit">
                  Kayıt Ol
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="mt-3 text-center">
          Zaten hesabınız var mı? <Link href="/user/login">Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
}