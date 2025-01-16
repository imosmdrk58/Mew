// app/manga/[params.mangaId]/chapter/[params.chapterId]/page.tsx
"use client";

import { useEffect, useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import ErrorPage from "@/components/ui/ErrorPage";
import { useParams } from "next/navigation";



import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  HomeIcon, 
  BookOpen,
  Settings2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const getNewChapter = async (
  mangaId: string,
  chapterNumber: string
): Promise<Chapter | null> => {
  const response = await fetch(
    `http://localhost:8080/manga/${mangaId}/chapters/${chapterNumber}`
  );
  if (response.ok) {
    const data = await response.json();

    const chapter: Chapter = {
      chapter_id: data.id,
      manga_id: data.manga_id ?? data.id,
      title: data.title,
      chapter_number: data.chapter_number,
      release_date: data.release_date,
      pages: data.pages.map((page: any) => ({
        page_id: page.id,
        chapter_id: page.chapter_id,
        url: page.image_url,
        page_number: page.page_number,
      })),
      nextChapter: parseInt(chapterNumber) + 1,
      prevChapter: parseInt(chapterNumber) - 1,
    };

    return chapter;
  }
  return null;
};

const ChapterPage = () => {
    const { mangaId, chapterId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mangaId || !chapterId || Array.isArray(mangaId) || Array.isArray(chapterId)) {
      return;
    }
    const fetchChapter = async () => {
      try {
        const chapterData = await getNewChapter(
          mangaId,
          chapterId
        );
        setChapter(chapterData);
      } catch (error) {
        console.error("Failed to fetch chapter:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapter();
  }, [mangaId, chapterId]);

  useEffect(() => {
    if (!mangaId || !chapterId || Array.isArray(mangaId) || Array.isArray(chapterId)) {
      return;
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && chapter?.nextChapter) {
        window.location.href = `/manga/${mangaId}/chapter/${chapter.nextChapter}`;
      }
      if (e.key === "ArrowLeft" && chapter?.prevChapter) {
        window.location.href = `/manga/${mangaId}/chapter/${chapter.prevChapter}`;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [chapter, mangaId]);

  if (!mangaId || !chapterId || Array.isArray(mangaId) || Array.isArray(chapterId) || isLoading) {
    return <LoadingSpinner />;
  }

  if (!chapter) {
    return <ErrorPage errorMessage="Chapter not found" />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }



  
  const NavigationButtons = () => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="bg-black hover:bg-zinc-900 text-white border-zinc-800"
        disabled={!chapter.prevChapter}
        onClick={() => window.location.href = `/manga/${mangaId}/chapter/${chapter.prevChapter}`}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous Chapter
      </Button>
      <Button
        variant="outline"
        className="bg-black hover:bg-zinc-900 text-white border-zinc-800"
        disabled={!chapter.nextChapter}
        onClick={() => window.location.href = `/manga/${mangaId}/chapter/${chapter.nextChapter}`}
      >
        Next Chapter
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );


  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8">
          <NavigationButtons />
          <h1 className="text-xl font-medium text-white">{chapter.title}</h1>
        </div>

        {/* Manga Pages */}
        <div className="flex flex-col items-center bg-black">
          {chapter.pages.map((page) => (
            <div 
              key={page.page_id} 
              className="w-full mb-1"
            >
              <img
                src={page.url}
                alt={`Page ${page.page_number}`}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-center mt-8">
          <NavigationButtons />
        </div>
      </div>
    </main>
  );
};

export default ChapterPage;
