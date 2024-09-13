"use client";
import { useParams, useSearchParams } from "next/navigation";

export default function PostDetail() {
  const params = useParams();
  console.log(params.slug);
  const searchParams = useSearchParams();

  console.log(searchParams.get("id"));
  return (
    <div>
      <h1>Post Detail</h1>
      <p> {params.slug} </p>
    </div>
  );
}
