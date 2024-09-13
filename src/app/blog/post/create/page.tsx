"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

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

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ title, content, category, image });
    alert("Post başarıyla paylaşıldı!");
    router.push("/blog");
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Yeni Post Paylaş</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Başlık
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            İçerik
          </label>
          {/* <textarea
            className="form-control"
            id="content"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea> */}
          <ReactQuill
            className="form-control"
            id="content"
            modules={modules}
            value={content}
            onChange={(value) => setContent(value)}
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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
          <label htmlFor="image" className="form-label">
            Görsel
          </label>
          <input
            type="file"
            className="form-control"
            id="image"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Paylaş
        </button>
      </form>
    </div>
  );
}
