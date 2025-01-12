'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Book, User, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AddPage = () => {
  const router = useRouter();
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [isMangaListOpen, setIsMangaListOpen] = useState(false);

  useEffect(() => {
    // Manga listesini çek
    fetchMangas();
  }, []);

  const fetchMangas = async () => {
    try {
      const response = await fetch('http://localhost:8080/manga');
      const data = await response.json();
      data.manga_id=data.id
      const MangaList: Manga[] = data.map((manga: any) => ({
        manga_id: manga.id,
        title: manga.title,
        description: manga.description,
        cover_image_url: manga.cover_image,
        status: manga.status,
        author_id: manga.author_id,
        author_name: manga.author_name,
        author_bio: manga.author_bio,
      }));
      setMangas(MangaList);
    } catch (error) {
      console.error('Error fetching mangas:', error);
    }
  };

  const navigateToMangaChapter = (mangaId: number) => {
    router.push(`/admin/add/manga/${mangaId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add Content</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Author Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Button 
                className="w-full h-32 flex flex-col items-center justify-center gap-2"
                variant="outline"
                onClick={() => router.push('add/author')}
              >
                <User className="h-8 w-8" />
                <span className="text-lg font-medium">Add Author</span>
              </Button>
            </CardContent>
          </Card>

          {/* Add Manga Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Button 
                className="w-full h-32 flex flex-col items-center justify-center gap-2"
                variant="outline"
                onClick={() => router.push('add/manga')}
              >
                <Book className="h-8 w-8" />
                <span className="text-lg font-medium">Add Manga</span>
              </Button>
            </CardContent>
          </Card>

          {/* Add Chapter Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Button 
                className="w-full h-32 flex flex-col items-center justify-center gap-2"
                variant="outline"
                onClick={() => setIsMangaListOpen(true)}
              >
                <BookOpen className="h-8 w-8" />
                <span className="text-lg font-medium">Add Chapter</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Manga List Dialog */}
        <Dialog open={isMangaListOpen} onOpenChange={setIsMangaListOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Select Manga to Add Chapter</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 max-h-[60vh] overflow-y-auto">
              {mangas.map((manga) => (
                <Card 
                  key={manga.manga_id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigateToMangaChapter(manga.manga_id)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Book className="h-8 w-8 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">{manga.title}</h3>
                     {/*  <p className="text-sm text-gray-500">{manga.chapters || 0} Chapters</p> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AddPage;