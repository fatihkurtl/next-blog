"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import api from "@/services/api";
import { BlogPostCreate } from "@/interfaces/posts";
import { PostServices } from "@/helpers/posts";
import { useSwal } from "@/utils/useSwal";
import { userStore } from "@/stores/user";

const postServices = new PostServices(api);
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function SharePost() {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  const alerts = useSwal();
  const loggedInUser = userStore((state) => state.user);

  const [post, setPost] = useState<BlogPostCreate>({
    title: "",
    subtitle: "",
    content: "",
    category: "",
    imageUrl: null,
    author: loggedInUser.fullname !== "" ? loggedInUser.fullname : "",
    user_id: loggedInUser.id !== 0 ? loggedInUser.id : 0,
  });

  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: value as any,
    }));
  };

  const handleContentChange = (value: string) => {
    setPost((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPost((prev) => ({
        ...prev,
        imageUrl: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(post).forEach(([key, value]) => {
        if (value !== null) {
          if (key === "imageUrl" && value instanceof File) {
            formData.append("image", value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await postServices.createPost(formData as any);
      console.log(formData);
      console.log(response);
      if (response.success === true) {
        console.log(response);
        alerts.success("Başarılı", "Yeni post paylaşıldı.");
        setTimeout(() => {
          router.push("/blog");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      alert(
        "Post paylaşırken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Yeni Gönderi Paylaş</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Başlık
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={post.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="subtitle" className="form-label">
            Alt Başlık
          </label>
          <input
            type="text"
            className="form-control"
            id="subtitle"
            name="subtitle"
            value={post.subtitle}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            İçerik
          </label>
          <ReactQuill
            className="form-control"
            id="content"
            modules={modules}
            value={post.content}
            onChange={handleContentChange}
            placeholder="İçerik metnini girin..."
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Kategori
          </label>
          <select
            className="form-select"
            id="category"
            name="category"
            value={post.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Kategori Seçin</option>
            <option value="Web Geliştirme">Web Geliştirme</option>
            <option value="Mobil Uygulama">Mobil Uygulama</option>
            <option value="Veri Bilimi">Veri Bilimi</option>
            <option value="Yapay Zeka">Yapay Zeka</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">
            Görsel
          </label>
          <input
            type="file"
            className="form-control"
            id="imageUrl"
            name="imageUrl"
            accept="image/*"
            onChange={handleImageChange}
          />
          {post.imageUrl && (
          <div className="mt-2">
            <p>Önizleme:</p>
            <Image
              src={URL.createObjectURL(post.imageUrl)}
              alt="Görsel önizleme"
              width={200}
              height={200}
              objectFit="contain"
              className="img-thumbnail w-50"
            />
          </div>
        )}
        </div>
        <button type="submit" className="btn btn-primary">
          Paylaş
        </button>
      </form>
    </div>
  );
}
