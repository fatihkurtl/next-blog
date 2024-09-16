"use client";
import React, { useState } from "react";
import api from "@/services/api";
import { UserServices } from "@/helpers/users";
import { userStore } from "@/stores/user";
import { useSwal } from "@/utils/useSwal";
import { UpdatePasswordForm } from "@/interfaces/user";

const userServices = new UserServices(api);

export default function ChangePasswordForm() {
  const user = userStore((state) => state.user);

  const [changePasswordForm, setChangePasswordForm] =
    useState<UpdatePasswordForm>({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [passwordError, setPasswordError] = useState<string>("");

  const alerts = useSwal();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangePasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      setPasswordError("Şifreler uyuşmuyor.");
      return;
    }
    if (changePasswordForm.oldPassword === "") {
      setPasswordError("Mevcut şifre boş olamaz.");
      return;
    }
    try {
      const response = await userServices.updateUserPassword(
        user.id,
        changePasswordForm
      );
      if (response.success === true) {
        console.log(response);
        alerts.success("Başarılı", "Şifre değiştirildi.");
        setChangePasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }
    } catch (error) {
      console.log(error);
      alerts.error("Hata", "Şifre değiştirilemedi.");
    }
  };

  return (
    <form onSubmit={handlePasswordSubmit}>
      {passwordError && (
        <div className="alert alert-danger">{passwordError}</div>
      )}
      <div className="mb-3">
        <label htmlFor="oldPassword" className="form-label">
          Mevcut Şifre <span className="text-danger">*</span>
        </label>
        <input
          type="password"
          className="form-control"
          id="oldPassword"
          name="oldPassword"
          value={changePasswordForm.oldPassword}
          onChange={handlePasswordChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="newPassword" className="form-label">
          Yeni Şifre <span className="text-danger">*</span>
        </label>
        <input
          type="password"
          className="form-control"
          id="newPassword"
          name="newPassword"
          value={changePasswordForm.newPassword}
          onChange={handlePasswordChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">
          Yeni Şifre (Tekrar) <span className="text-danger">*</span>
        </label>
        <input
          type="password"
          className="form-control"
          id="confirmPassword"
          name="confirmPassword"
          value={changePasswordForm.confirmPassword}
          onChange={handlePasswordChange}
        />
      </div>
      <button type="submit" className="btn btn-warning">
        Şifreyi Değiştir
      </button>
    </form>
  );
}
