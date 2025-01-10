// app/manga/[params.mangaId]/chapter/[params.chapterId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"


async function getChapter(mangaId: string, chapterId: string): Promise<Chapter | null> {
    const mockChapter: Chapter = {
      chapter_id: parseInt(chapterId),
      manga_id: parseInt(mangaId),
      title: "The Beginning",
      chapter_number: 1,
      release_date: new Date().toISOString(),
      pages: [
        { page_id: 1, chapter_id:parseInt(chapterId),url: "https://placehold.co/800x1200", page_number: 1 },
        { page_id: 2,chapter_id:parseInt(chapterId), url: "https://placehold.co/800x1200", page_number: 2 },
        { page_id: 3, chapter_id:parseInt(chapterId),url: "https://placehold.co/800x1200", page_number: 3 },
      ],
      nextChapter: 2,
      prevChapter: undefined
    };
    
    return mockChapter;
  }


export default function ChapterPage({
  params
}: {
  params: Promise<{ mangaId: string; chapterId: string }>
}) {
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
            const chapterData = await getChapter(resolvedParams.mangaId, resolvedParams.chapterId);
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
        return <div>Loading...</div>;
      }
  
    if (!chapter) {
      return <div>Loading...</div>;
    }

    
if (isLoading) {
    return <div>Loading...</div>;
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
                loading="lazy"
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