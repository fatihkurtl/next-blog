"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">Login Page</div>
    </div>
  );
}
