"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/services/api";
import { UserServices } from "@/helpers/users";
import PostList from "@/components/blog/post-list";
import { BlogPost } from "@/interfaces/posts";
import ProfileInfoForm from "@/components/profile/profile-info-form";
import ChangePasswordForm from "@/components/profile/change-password-form";
import { useSwal } from "@/utils/useSwal";

const userServices = new UserServices(api);

export default function UserProfile() {
  const userLocal = JSON.parse(localStorage.getItem("user-storage") || "{}");
  const alerts = useSwal();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await userServices.getUserPosts(
          userLocal.state.user.id
        );
        console.log("user posts", fetchedPosts);
        setPosts(fetchedPosts.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userLocal.state.user.id]);

  const handleEdit = (postId: number) => {
    console.log(`Editing post ${postId}`);
  };

  const handleDelete = async (postId: number) => {
    try {
      const confirmed = await alerts.question("Gönderi Silme!", "Bu gönderiyi silmek istediğinizden emin misiniz?");
      console.log("Confirmed:", confirmed);
      if (confirmed) {
        await userServices.deleteUserPost(postId);
        setPosts(posts.filter((post) => post.id !== postId));
        alerts.success("Başarılı", "Gönderi başarıyla silindi.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alerts.error("Hata", "Gönderi silinirken bir hata oluştu.");
    }
  };

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
              {loading ? (
                <p>Gönderiler yükleniyor...</p>
              ) : posts.length > 0 ? (
                <PostList
                  posts={posts}
                  showEditDelete={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
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
