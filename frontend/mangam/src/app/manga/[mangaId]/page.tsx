'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, BookOpen, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

async function fetchMangaDetail(mangaId: string): Promise<MangaDetail> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: mangaId,
    title: 'One Piece',
    author: 'Eiichiro Oda',
    coverImage: '/api/placeholder/350/500',
    description: 'Follow Monkey D. Luffy and his pirate crew in their search for the ultimate treasure, the One Piece.',
    status: 'Ongoing',
    genres: ['Action', 'Adventure', 'Comedy', 'Fantasy'],
    chapters: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      number: i + 1,
      title: `Chapter ${i + 1}`,
      uploadDate: new Date().toISOString(),
      images: [],
      mangaId: mangaId,
    }))
  };
}

export default function MangaDetail({ params }: { params: { mangaId: string } }) {

  // Mock data (remove when backend is ready)
  
  const manga = use(fetchMangaDetail(params.mangaId));
  

  if (!manga) {
    return <div>Manga not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Cover Image */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="relative aspect-[2/3] w-full">
                <Image
                  src={manga.coverImage}
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
                  by {manga.author}
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
                variant={manga.status === 'Ongoing' ? 'default' : 'secondary'}
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
                      key={chapter.id}
                      href={`/manga/${manga.id}/chapter/${chapter.number}`}
                      className="block"
                    >
                      <Card>
                        <CardContent className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              Chapter {chapter.number}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(chapter.uploadDate).toLocaleDateString()}
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
