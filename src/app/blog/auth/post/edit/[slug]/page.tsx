"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Image from 'next/image';
import api from "@/services/api";
import { BlogPostEdit } from "@/interfaces/posts";
import { PostServices } from "@/helpers/posts";
import { UserServices } from "@/helpers/users";
import { useSwal } from "@/utils/useSwal";
import { userStore } from "@/stores/user";

const userServices = new UserServices(api);
const postServices = new PostServices(api);
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function EditPost() {
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
  const router = useRouter();
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [post, setPost] = useState<BlogPostEdit>({
    id: 0,
    title: "",
    subtitle: "",
    content: "",
    category: "",
    category_id: "",
    imageUrl: null,
    author: "",
    user_id: 0,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const response = await postServices.getPostById(id);
          setPost(response.data);
          if (response.data.imageUrl && typeof response.data.imageUrl === 'string') {
            setPreviewImage(response.data.imageUrl);
          }
        } catch (error) {
          console.error("Error fetching post:", error);
          alerts.error("Hata", "Gönderi yüklenirken bir hata oluştu.");
        }
      }
    };

    fetchPost();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const categoryId = getCategoryId(value);
    setPost((prev) => ({
      ...prev,
      category: value,
      category_id: categoryId,
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
      const file = e.target.files[0];
      setPost((prev) => ({
        ...prev,
        imageUrl: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirmed = await alerts.question("Gönderi düzenle", "Gönderiyi düzenlemek istediğinize emin misiniz?");
    if (confirmed) {
      try {
        const formData = new FormData();
        Object.entries(post).forEach(([key, value]) => {
          if (value !== null) {
            if (key === "imageUrl") {
              if (value instanceof File) {
                formData.append("image", value);
              } else if (typeof value === 'string' && value !== '') {
                formData.append("imageUrl", value);
              }
            } else {
              formData.append(key, String(value));
            }
          }
        });
        const response = await userServices.updatePost(post.id, formData as any);
        if (response.success === true) {
          alerts.success("Başarılı", "Gönderi güncellendi.");
          setTimeout(() => {
            router.push("/blog");
          }, 1000);
        }
      } catch (error) {
        console.error(error);
        alerts.error("Hata", "Gönderi güncellenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    }    
  };

  const getCategoryId = (categoryName: string): string => {
    switch (categoryName) {
      case "Web Geliştirme":
        return "1";
      case "Mobil Uygulama":
        return "2";
      case "Veri Bilimi":
        return "3";
      case "Yapay Zeka":
        return "4";
      default:
        return "";
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Gönderi Düzenle</h1>
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
            onChange={handleCategoryChange}
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
          {previewImage && (
            <div className="mt-2">
              <p>Önizleme:</p>
              <Image
                src={previewImage}
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
          Güncelle
        </button>
      </form>
    </div>
  );
}