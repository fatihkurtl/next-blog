"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/services/api";
import { UserServices } from "@/helpers/users";
import PostList from "@/components/blog/post-list";
import { BlogPost } from "@/interfaces/posts";
import ProfileInfoForm from "@/components/profile/profile-info-form";
import ChangePasswordForm from "@/components/profile/change-password-form";

const userServices = new UserServices(api);

export default function UserProfile() {

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
              <ProfileInfoForm />
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Şifre Değiştirme</h3>
              <ChangePasswordForm />
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
