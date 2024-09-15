'use client';

import Link from 'next/link';
import Image from 'next/image';
import { userStore } from '@/stores/user';
import { slugify } from '@/utils/slugify';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link href="/" className="navbar-brand">Blog Sitesi</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link">Ana Sayfa</Link>
            </li>
            <li className="nav-item">
              <Link href="/blog" className="nav-link">Blog</Link>
            </li>
            <li className="nav-item">
              <Link href="/hakkimizda" className="nav-link">Hakkımızda</Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <Image src="https://i.pravatar.cc/150?img=3" width={32} height={32} className="rounded-circle" alt="Profil" />
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><Link href={`/user/auth/profile/${slugify(userStore.getState().user.username)}`} className="dropdown-item">Profil</Link></li>
                <li><Link href="/blog/auth/post/create" className="dropdown-item">Post Paylaş</Link></li>
                <li><Link href="/user/register" className="dropdown-item">Register</Link></li>
                <li><Link href="/user/login" className="dropdown-item">Giriş</Link></li>
                <li><Link href="/user/login" className="dropdown-item">Çıkış</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}