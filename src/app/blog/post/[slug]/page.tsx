"use client";
import { useParams } from "next/navigation";

export default function PostDetail() {
  const params = useParams();
  return (
    <div>
      <h1>Post Detail</h1>
      <p> {params.slug} </p>
    </div>
  );
}
