// app/manga/[mangaId]/page.tsx
"use client";

import { use } from "react";
import { MangaDetailPage } from "./components/MangaPage";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";



const Page = () => {
  const {mangaId }= useParams();
  if (!mangaId || Array.isArray(mangaId)) {
    return <LoadingSpinner />;
  }
  return <MangaDetailPage mangaId={mangaId} />;
};

export default Page;
