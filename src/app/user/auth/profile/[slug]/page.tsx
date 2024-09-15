"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/services/api";
import { UserServices } from "@/helpers/users";
import PostList from "@/components/blog/post-list";
import { BlogPost } from "@/interfaces/posts";
import { userStore } from "@/stores/user";
import { defaultAvatarUrl } from "@/constants";
import { UpdateUserForm } from "@/interfaces/user";
import { useSwal } from "@/utils/useSwal";

const userServices = new UserServices(api);

export default function UserProfile() {
  const user = userStore((state) => state.user);
  const saveUser = userStore((state) => state.setUser);
  const alerts = useSwal();

  const [userForm, setUserForm] = useState<UpdateUserForm>({
    fullname: "",
    username: "",
    email: "",
    image: null,
  });

  const [changePasswordForm, setChangePasswordForm] = useState<any>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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
      getUserData();
    }
  }, [user.id]);

  const getUserData = async () => {
    try {
      const response = await userServices.getUserById(user.id as number);
      if (response.success === true) {
          console.log('response user:', response);
          saveUser(response.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangePasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        alerts.success("Hosgeldiniz", "Kullanıcı bilgileri kaydedildi.");
      }
      console.log(formData);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(changePasswordForm);
  };

  const userPosts: BlogPost[] = [
    {
      id: 1,
      title: "React Hooks Kullanımı",
      subtitle: "Modern React uygulamalarında state yönetimi",
      category_id: 1,
      category: "Web Geliştirme",
      imageUrl: "/images/react-hooks.jpg",
      content:
        "React Hooks, fonksiyon bileşenlerinde state ve yaşam döngüsü özelliklerini kullanmanıza olanak tanır...",
      date: "2023-05-15",
      author: "ornek_kullanici",
    },
    {
      id: 2,
      title: "TypeScript ile Daha Güvenli Kod Yazımı",
      subtitle: "JavaScript projelerinizi TypeScript ile güçlendirin",
      category_id: 2,
      category: "Programlama Dilleri",
      imageUrl: "/images/typescript.jpg",
      content:
        "TypeScript, JavaScript'e statik tip tanımlama özelliği ekleyerek daha güvenli ve ölçeklenebilir kod yazmanıza yardımcı olur...",
      date: "2023-05-20",
      author: "ornek_kullanici",
    },
  ];

  return (
    <div className="container mt-5">
      <h1 className="mb-5">Profil Sayfası</h1>

      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">Profil Bilgileri</h3>
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
                    src={user.image}
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
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Şifre Değiştirme</h3>
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">
                    Mevcut Şifre <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                    value={changePasswordForm.currentPassword}
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
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Paylaşılan Gönderiler</h2>
              {userPosts.length > 7 ? (
                <PostList posts={userPosts} />
              ) : (
                <>
                  <p>Henüz paylaştığınız bir gönderi yok.</p>
                  <div className="text-center mt-4">
                    <Link
                      href="/blog/auth/post/create"
                      className="btn btn-primary"
                    >
                      Bir gönderi paylaşın
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
