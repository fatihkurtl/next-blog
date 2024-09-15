"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/services/api";
import { UserServices } from "@/helpers/users";
import { userStore } from "@/stores/user";
import { defaultAvatarUrl } from "@/constants";
import { UpdateUserForm } from "@/interfaces/user";
import { useSwal } from "@/utils/useSwal";
import { getUserData } from "@/middlewares/user-save";

const userServices = new UserServices(api);

export default function ProfileInfoForm() {
  const user = userStore((state) => state.user);
  const saveUser = userStore((state) => state.setUser);
  const alerts = useSwal();

  const [userForm, setUserForm] = useState<UpdateUserForm>({
    fullname: "",
    username: "",
    email: "",
    image: null,
  });

  useEffect(() => {
    setUserForm({
      fullname: user.fullname || "",
      username: user.username || "",
      email: user.email || "",
      image: null,
    });
  }, [user]);

  useEffect(() => {
    if (user.id) {
      getUserData(user.id, saveUser);
    }
  }, [user.id, saveUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUserForm((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userForm);
    try {
      const formData = new FormData();
      Object.entries(userForm).forEach(([key, value]) => {
        if (value !== null) {
          if (key === "image" && value instanceof File) {
            formData.append("image", value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await userServices.updateUser(
        user.id as number,
        formData as any
      );
      if (response.success === true) {
        console.log(response);
        // saveUser(response.user);
        alerts.success("Başarılı", "Kullanıcı bilgileri güncellendi.");
      }
      console.log(formData);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="image" className="form-label">
          Profil Fotoğrafı
        </label>
        <input
          type="file"
          className="form-control"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      {userForm.image !== null ? (
        <Image
          src={URL.createObjectURL(userForm.image)}
          alt="Profil Fotoğrafı"
          width={200}
          height={200}
        />
      ) : (
        <Image
          src={(user.image as string) || defaultAvatarUrl}
          alt="Profil Fotoğrafı"
          width={200}
          height={200}
          className="img-thumbnail mb-3"
        />
      )}
      <div className="mb-3">
        <label htmlFor="fullname" className="form-label">
          Ad Soyad
        </label>
        <input
          type="text"
          className="form-control"
          id="fullname"
          name="fullname"
          value={userForm.fullname}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Kullanıcı Adı
        </label>
        <input
          type="text"
          className="form-control"
          id="username"
          name="username"
          value={userForm.username}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          E-posta
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={userForm.email}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Bilgileri Güncelle
      </button>
    </form>
  );
}
