// app/manga/[mangaId]/page.tsx
"use client";

import { use } from "react";
import { MangaDetailPage } from "./components/MangaPage";
import { useParams } from "next/navigation";

interface PageProps {
  params: {
    mangaId: string;
  };
}

const Page = ({ params }: PageProps) => {
  params = useParams();
  return <MangaDetailPage mangaId={params.mangaId} />;
};

export default Page;
