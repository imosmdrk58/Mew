"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Book, User, BookOpen, ArrowLeft } from "lucide-react";
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
    fetchMangas();
  }, []);

  const fetchMangas = async () => {
    try {
      const response = await fetch("http://localhost:8080/manga");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        data.manga_id = data.id;
        const MangaList: Manga[] = data.map((manga: any) => ({
          manga_id: manga.manga_id,
          title: manga.title,
          description: manga.description,
          cover_image: manga.cover_image,
          status: manga.status,
          author_id: manga.author_id,
          author_name: manga.author_name,
          author_bio: manga.author_bio,
        }));
        setMangas(MangaList);
      } else {
        setMangas([]);
      }
    } catch (error) {
      console.error("Error fetching mangas:", error);
    }
  };

  const navigateToMangaChapter = (mangaId: number) => {
    router.push(`/admin/add/manga/${mangaId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Üst Banner */}
      <div className="bg-white shadow-sm pt-20 fixed top-0 left-0 right-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            className="flex items-center gap-2 hover:bg-gray-50"
            variant="ghost"
            onClick={() => router.push("/admin")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Admin</span>
          </Button>
          <h1 className="text-2xl font-semibold text-gray-800">
            Content Management
          </h1>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="max-w-6xl mx-auto px-6 pt-60 pb-12 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Author Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <Button
                className="w-full h-40 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200/30 transition-all duration-300"
                variant="ghost"
                onClick={() => router.push("add/author")}
              >
                <User className="h-10 w-10 text-blue-600 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col items-center">
                  <span className="text-xl font-medium text-gray-800">
                    Add Author
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    Manage authors and their details
                  </span>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Add Manga Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <Button
                className="w-full h-40 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200/30 transition-all duration-300"
                variant="ghost"
                onClick={() => router.push("add/manga")}
              >
                <Book className="h-10 w-10 text-purple-600 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col items-center">
                  <span className="text-xl font-medium text-gray-800">
                    Add Manga
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    Create new manga series
                  </span>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Add Chapter Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <Button
                className="w-full h-40 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 border-2 border-emerald-200/30 transition-all duration-300"
                variant="ghost"
                onClick={() => setIsMangaListOpen(true)}
              >
                <BookOpen className="h-10 w-10 text-emerald-600 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col items-center">
                  <span className="text-xl font-medium text-gray-800">
                    Add Chapter
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    Upload new chapters
                  </span>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Manga List Dialog */}
        <Dialog open={isMangaListOpen} onOpenChange={setIsMangaListOpen}>
          <DialogContent className="max-w-4xl bg-white/95 backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-800">
                Select Manga Series
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 max-h-[70vh] overflow-y-auto px-2">
              {mangas.map((manga) => (
                <Card
                  key={manga.manga_id}
                  className="hover:bg-gray-50 cursor-pointer transition-all duration-300 border border-gray-200/50 hover:border-gray-300"
                  onClick={() => navigateToMangaChapter(manga.manga_id)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <img
                        src={manga.cover_image}
                        alt={manga.id?.toString() ?? manga.manga_id.toString()}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg text-gray-800">
                        {manga.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Click to add new chapter
                      </p>
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
