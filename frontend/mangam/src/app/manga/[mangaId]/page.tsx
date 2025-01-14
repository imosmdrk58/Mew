// app/manga/[mangaId]/page.tsx

import { MangaDetailPage } from "./components/MangaPage";

interface PageProps {
  params: {
    mangaId: string;
  };
}

const Page = ({ params }: PageProps) => {
  return <MangaDetailPage mangaId={params.mangaId} />;
};

export default Page;
