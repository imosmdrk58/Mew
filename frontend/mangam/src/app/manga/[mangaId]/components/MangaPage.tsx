"use client";
import ErrorPage from "@/components/ui/ErrorPage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

import { Card, CardContent } from "@/components/ui/card";
import { mangaService } from "@/lib/services/mangaServices";
import { useState, useEffect } from "react";
import { MangaDetails } from "./MangaDetails";
import { ChapterList } from "./ChapterList";
import { MangaImage } from "./MangaImage";
import { FavoriteButton } from "./FavoriteButton";
import { useAuthStore } from "@/store/userStore";
import { RatingComponent } from "./RatingComponent";

export const MangaDetailPage = ({ mangaId }: { mangaId: string }) => {
  const [manga, setManga] = useState<Manga | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const userId = useAuthStore((state) => state.user?.userId);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const data = await mangaService.getMangaDetails(mangaId);
        setManga(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchManga();
  }, [mangaId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorPage errorMessage={error.message} />;
  if (!manga) return <ErrorPage errorMessage="Manga not found" />;

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <MangaImage coverImage={manga.cover_image} title={manga.title} />
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mt-4">
                <RatingComponent mangaId={mangaId} />
                <FavoriteButton mangaId={mangaId} userId={userId} />
              </div>
              <MangaDetails
                title={manga.title}
                author={manga.author}
                genres={manga.genres}
                status={manga.status}
                description={manga.description}
              />
              <ChapterList
                chapters={manga.chapters}
                mangaId={manga.manga_id.toString()}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
