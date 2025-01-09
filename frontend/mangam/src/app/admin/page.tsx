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
import { useState } from "react";

interface Manga {
  id: string;
  title: string;
  author: string;
  status: string;
  createdAt: string;
}

export default function MangaListPage() {
  const [mangas, setMangas] = useState<Manga[]>([
    {
      id: "1",
      title: "One Piece",
      author: "Eiichiro Oda",
      status: "Ongoing",
      createdAt: "2024-01-09",
    },
  ]);

  return (
    <div className="p-6">
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
            <TableRow key={manga.id}>
              <TableCell>{manga.title}</TableCell>
              <TableCell>{manga.author}</TableCell>
              <TableCell>{manga.status}</TableCell>
              <TableCell>{manga.createdAt}</TableCell>
              <TableCell className="space-x-2">
                <Link href={`/dashboard/manga/edit/${manga.id}`}>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="destructive" size="icon">
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
