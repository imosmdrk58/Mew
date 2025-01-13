"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";

type Manga = {
  manga_id: number;
  title: string;
  cover_image: string;
  rating: number;
};

const MangaHomepage = () => {
  const [newManga, setNewManga] = useState<Manga[]>([]);
  const [popularManga, setPopularManga] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error("API URL is not configured");
        }

        const [newResponse, popularResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/manga?limit=6&sort_by=published_date&sort_order=desc`, {
            headers: {
              'Accept': 'application/json',
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/manga?limit=6&sort_by=rating&sort_order=desc`, {
            headers: {
              'Accept': 'application/json',
            },
          })
        ]);

        if (!newResponse.ok || !popularResponse.ok) {
          console.error('New Response Status:', newResponse.status);
          console.error('Popular Response Status:', popularResponse.status);
          throw new Error("Network response was not ok");
        }

        const newData = await newResponse.json();
        const popularData = await popularResponse.json();

        console.log('New Manga Data:', newData);
        console.log('Popular Manga Data:', popularData);

        setNewManga(Array.isArray(newData) ? newData : []);
        setPopularManga(Array.isArray(popularData) ? popularData : []);
      } catch (error) {
        console.error("Error fetching manga:", error);
        setNewManga([]);
        setPopularManga([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const MangaGrid = ({ mangas }: { mangas: Manga[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {isLoading
        ? [...Array(6)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="aspect-[3/4] rounded-lg bg-gray-700/50 animate-pulse" />
              <div className="h-4 bg-gray-700/50 rounded animate-pulse w-2/3" />
              <div className="h-3 bg-gray-700/50 rounded animate-pulse w-1/4" />
            </div>
          ))
        : mangas.map((manga) => (
            <Link
              href={`/manga/${manga.manga_id}`}
              key={manga.manga_id}
              className="space-y-2 group"
            >
              <div className="aspect-[3/4] rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src={manga.cover_image}
                  alt={manga.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-200 truncate">
                {manga.title}
              </p>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <span className="text-xs text-gray-400">
                  {manga.rating ? manga.rating.toFixed(1) : 'N/A'}
                </span>
              </div>
            </Link>
          ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gray-800/50 backdrop-blur border-gray-700 hover:bg-gray-800/70 transition-colors">
            <CardHeader>
              <CardTitle className="text-xl font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                En Yüksek Puanlı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MangaGrid mangas={popularManga} />
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur border-gray-700 hover:bg-gray-800/70 transition-colors">
            <CardHeader>
              <CardTitle className="text-xl font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                En Son Eklenenler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MangaGrid mangas={newManga} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MangaHomepage;