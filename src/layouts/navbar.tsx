"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link href="/" className="navbar-brand">Blog Sitesi</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
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
        </div>
      </div>
    </nav>
  );
}
