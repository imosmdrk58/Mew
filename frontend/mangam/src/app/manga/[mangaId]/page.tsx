'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { ChevronRight, BookOpen, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {LoadingSpinner} from '@/components/ui/LoadingSpinner';

async function fetchMangaDetail(mangaId: string): Promise<Manga> {
  try {
    // API'den veriyi çek
    const response = await fetch(`http://localhost:8080/manga/${mangaId}`);
    const responseChapters = await fetch(`http://localhost:8080/manga/${mangaId}/chapters`);
    const responseAuthors = await fetch(`http://localhost:8080/authors/manga/${mangaId}`);
    
    // Eğer cevap başarılı değilse hata fırlat
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    if (!responseChapters.ok)
    {
      throw new Error(`HTTPChapterda error! status: ${responseChapters.status}`);
    }
    if (!responseAuthors.ok)
      {
        throw new Error(`HTTPAuthorsda error! status: ${responseAuthors.status}`);
      }

    // JSON verisini al
    const data = await response.json();
    const dataChapters = await responseChapters.json();
    const dataAuthors = await responseAuthors.json();

    console.log('API Response:', data); // API yanıtını logla
    console.log('Chapter API Response:', dataChapters); // API yanıtını logla
    console.log('Author API Response:', dataAuthors); // API yanıtını logla

    // API'den gelen veriyi Manga tipine dönüştür
    const manga: Manga = {
      manga_id: data.id,
      title: data.title,
      description: data.description,
      cover_image_url: data.cover_image,
      status: data.status,
      published_date: data.published_date,
      last_updated: data.last_updated,
      genres: [],
      chapters: dataChapters.map((chapter: any, index: number) => ({
        chapter_id: chapter.id,
        manga_id: data.id,
        chapter_number: chapter.chapter_number,
        title: chapter.title || `Chapter ${chapter.chapter_number}`,
        release_date: chapter.release_date || new Date().toISOString(),
        genres: [],
        pages: chapter.pages || [],
        nextChapter: index < dataChapters.length - 1 ? dataChapters[index + 1].chapter_number : undefined,
        prevChapter: index > 0 ? dataChapters[index - 1].chapter_number : undefined,
        mangaId: data.id,
      })),
      author: {
        author_id: dataAuthors.id,
        name: dataAuthors.name,
        bio: dataAuthors.bio
      },
    };

    return manga;
  } catch (error) {
    console.error('Error fetching manga details:', error);
    throw error; // Hata durumunda hatayı fırlat
  }
}

export default function MangaDetail({ params }: { params: { mangaId: string } }) {

  // Mock data (remove when backend is ready)
  const [manga, setManga] = useState<Manga | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ mangaId: string; } | null>(null);

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
            const mangaData = await fetchMangaDetail(resolvedParams.mangaId);
            setManga(mangaData);
          } catch (error) {
            console.error('Failed to fetch chapter:', error);
          } finally {
            setIsLoading(false);
          }
        };
        fetchChapter();
      }, [resolvedParams]);

      if (!resolvedParams || isLoading) {
        return <LoadingSpinner />;
      }
  

  if (!manga) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <span className="text-xl font-semibold">Manga not found</span>
        </div>
        <Button className="mt-4" onClick={() => window.location.href = '/'}>
          Go to Home
        </Button>
      </div>
    );
  }
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Cover Image */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="relative aspect-[2/3] w-full">
                <Image
                  src={manga.cover_image_url}
                  alt={manga.title}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold mb-2">{manga.title}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4" />
                <span className="text-sm text-gray-600">
                  by {manga.author.name}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {manga.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>

              <Badge 
                
                className="mb-4"
              >
                {manga.status}
              </Badge>

              <p className="text-gray-700 mb-6">{manga.description}</p>

              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Chapters
              </h2>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {manga.chapters.map((chapter) => (
                    <Link
                      key={chapter.chapter_id}
                      href={`/manga/${manga.manga_id}/chapter/${chapter.chapter_id}`}
                      className="block"
                    >
                      <Card>
                        <CardContent className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              Chapter {chapter.chapter_number} - {chapter.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(chapter.release_date).toLocaleDateString()}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <Skeleton className="aspect-[2/3] w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-20" />
                ))}
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
