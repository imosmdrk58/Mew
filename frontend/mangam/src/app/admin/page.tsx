"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const MangaListPage = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);

  useEffect(() => {
    // Manga listesini çek
    fetchMangas();
  }, []);

  const fetchMangas = async () => {
    try {
      const response = await fetch("http://localhost:8080/manga");
      const data = await response.json();
      data.manga_id = data.id;
      const MangaList: Manga[] = data.map((manga: any) => ({
        manga_id: manga.id ?? manga.manga_id,
        title: manga.title,
        description: manga.description,
        cover_image: manga.cover_image,
        status: manga.status,
        author: {
          author_id: manga.author_id,
          name: manga.author_name,
          bio: manga.author_bio,
        },
      }));
      setMangas(MangaList);
    } catch (error) {
      console.error("Error fetching mangas:", error);
    }
  };

  const deleteManga = async (mangaId: number) => {
    // api : 	router.HandleFunc("/manga/{id}", h.DeleteManga).Methods("DELETE")
    try {
      await fetch(`http://localhost:8080/manga/${mangaId}`, {
        method: "DELETE",
      });
      setMangas((prevMangas) =>
        prevMangas.filter((manga) => manga.manga_id !== mangaId)
      );
    } catch (error) {
      console.error("Error deleting manga:", error);
    }
  };

  return (
    <div className="p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manga Yönetimi</h1>
        <Link href="/admin/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Manga Ekle
          </Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Başlık</TableHead>
            <TableHead>Yazar</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Oluşturulma Tarihi</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mangas.map((manga) => (
            <TableRow key={manga.manga_id}>
              <TableCell>
                <Link
                  href={`/manga/${manga.manga_id}`}
                  className="text-blue-600 hover:underline"
                >
                  {manga.title}
                </Link>
              </TableCell>
              <TableCell>{manga.author.name}</TableCell>
              <TableCell>{manga.status}</TableCell>
              <TableCell>{manga.published_date}</TableCell>
              <TableCell className="space-x-2">
                <Link href={`/dashboard/manga/edit/${manga.manga_id}`}>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteManga(manga.manga_id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MangaListPage;
