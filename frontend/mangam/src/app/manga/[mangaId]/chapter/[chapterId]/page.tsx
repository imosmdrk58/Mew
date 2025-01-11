// app/manga/[params.mangaId]/chapter/[params.chapterId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import ErrorPage from '@/components/ui/ErrorPage';



  const getNewChapter = async (mangaId: string, chapterNumber: string): Promise<Chapter | null> => {
    const response = await fetch(`http://localhost:8080/manga/${mangaId}/chapters/${chapterNumber}`);
    if (response.ok) {
      const data = await response.json();

      const chapter :Chapter  =
      {
        chapter_id: data.id,
        manga_id: data.manga_id,
        title: data.title,
        chapter_number: data.chapter_number,
        release_date: data.release_date,
        pages: data.pages.map((page: any) => ({
          page_id: page.id,
          chapter_id: page.chapter_id,
          url: page.image_url,
          page_number: page.page_number
        })),
        nextChapter: parseInt(chapterNumber) + 1,
        prevChapter: parseInt(chapterNumber) - 1
      };

      return chapter;
      
    }
    return null;
  };


  const ChapterPage =  ({ params }: { params: { mangaId: string; chapterId: string } }) =>{
    const [currentPage, setCurrentPage] = useState(1);
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [resolvedParams, setResolvedParams] = useState<{ mangaId: string; chapterId: string } | null>(null);

    
    useEffect(() => {
        const resolveParams = async () => {
          const unwrappedParams = await params;
          setResolvedParams(unwrappedParams);
        };
        resolveParams();
      }, [params]);
  
      useEffect(() => {
        if (!resolvedParams) return;
  
        const fetchChapter = async () => {
          try {
            console.log("paramasv Ş " ,resolvedParams);
            const chapterData = await getNewChapter(resolvedParams.mangaId, resolvedParams.chapterId);
            setChapter(chapterData);
          } catch (error) {
            console.error('Failed to fetch chapter:', error);
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchChapter();
      }, [resolvedParams]);
      useEffect(() => {
        if (!resolvedParams || !chapter) return;
  
        const handleKeyPress = (e: KeyboardEvent) => {
          if (e.key === 'ArrowRight' && chapter?.nextChapter) {
            window.location.href = `/manga/${resolvedParams.mangaId}/chapter/${chapter.nextChapter}`;
          }
          if (e.key === 'ArrowLeft' && chapter?.prevChapter) {
            window.location.href = `/manga/${resolvedParams.mangaId}/chapter/${chapter.prevChapter}`;
          }
        };
    
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
      }, [chapter, resolvedParams]);
  
      if (!resolvedParams || isLoading) {
        return <LoadingSpinner />;
      }
  
    if (!chapter) {
      return <ErrorPage errorMessage="Chapter not found" />
    }

    
if (isLoading) {
  return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Chapter Navigation */}
        <div className="flex justify-between items-center mb-6 text-white">
          <div className="flex gap-4">
            {chapter.prevChapter && (
              <a
                href={`/manga/${resolvedParams.mangaId}/chapter/${chapter.prevChapter}`}
                className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition"
              >
                Previous Chapter
              </a>
            )}
            {chapter.nextChapter && (
              <a
                href={`/manga/${resolvedParams.mangaId}/chapter/${chapter.nextChapter}`}
                className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition"
              >
                Next Chapter
              </a>
            )}
          </div>
          <h1 className="text-xl font-bold">{chapter.title}</h1>
        </div>

        {/* Chapter Images */}
        <div className="flex flex-col items-center space-y-0">
          {chapter.pages.map((page) => (
            <div
              key={page.page_id}
              className="w-full relative"
            >
              {/* Once backend is ready, replace src with actual image URL */}
              <img
                src={page.url}
                alt={`Page ${page.page_number}`}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center mt-6 text-white">
          <div className="flex gap-4">
            {chapter.prevChapter && (
              <a
                href={`/manga/${resolvedParams.mangaId}/chapter/${chapter.prevChapter}`}
                className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition"
              >
                Previous Chapter
              </a>
            )}
            {chapter.nextChapter && (
              <a
                href={`/manga/${resolvedParams.mangaId}/chapter/${chapter.nextChapter}`}
                className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition"
              >
                Next Chapter
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


export default ChapterPage;