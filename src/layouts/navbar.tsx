"use client";

import Link from "next/link";
import Image from "next/image";
import { userStore } from "@/stores/user";
import { slugify } from "@/utils/slugify";
import { defaultAvatarUrl } from "@/constants"; 

export default function Navbar() {
  const user = userStore((state) => state.user);
  const logout = userStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link href="/" className="navbar-brand">
          Blog Sitesi
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link">
                Ana Sayfa
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/blog" className="nav-link">
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link">
                Hakkımızda
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Image
                  src={user.image || defaultAvatarUrl}
                  width={32}
                  height={32}
                  className="rounded-circle"
                  alt="Profil"
                />
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdown"
              >
                {user.expires_at > new Date().toISOString() && user.token !== "" ? (
                  <>
                    <li>
                      <Link
                        href={`/user/auth/profile/${slugify(user.username)}`}
                        className="dropdown-item"
                      >
                        Profil
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/blog/auth/post/create"
                        className="dropdown-item"
                      >
                        Gönderi Paylaş
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item">
                        Çıkış
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/user/register" className="dropdown-item">
                        Kayıt Ol
                      </Link>
                    </li>
                    <li>
                      <Link href="/user/login" className="dropdown-item">
                        Giriş
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
