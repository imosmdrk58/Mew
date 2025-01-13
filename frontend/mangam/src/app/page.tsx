"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Heart, Search } from "lucide-react";
import Link from "next/link";
import NavigationBar from "./components/navbar/Navbar";

const MangaWebsite = () => {
  const [newManga, setNewManga] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewManga = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/manga?limit=6&sort_by=published_date&sort_order=desc`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setNewManga(data);
      } catch (error) {
        console.error("Error fetching new manga:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewManga();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navigation Bar */}
      <NavigationBar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* New Manga Section */}
          <Card className="bg-gray-800/50 backdrop-blur border-gray-700 hover:bg-gray-800/70 transition-colors">
            <CardHeader>
              <CardTitle className="text-xl font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                New Manga Releases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {isLoading
                  ? // Loading skeletons
                    [...Array(6)].map((_, index) => (
                      <div
                        key={index}
                        className="space-y-2 group cursor-pointer"
                      >
                        <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-gray-700 to-purple-800 animate-pulse group-hover:scale-105 transition-transform" />
                        <div className="h-4 bg-gradient-to-r from-gray-700 to-purple-800 rounded animate-pulse w-2/3" />
                      </div>
                    ))
                  : // Actual manga data
                    newManga.map((manga) => (
                      <Link
                        href={`/manga/${manga.manga_id}`}
                        key={manga.manga_id}
                        className="space-y-2 group cursor-pointer"
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
                      </Link>
                    ))}
              </div>
            </CardContent>
          </Card>

          {/* Most Read Section */}
          <Card className="bg-gray-800/50 backdrop-blur border-gray-700 hover:bg-gray-800/70 transition-colors">
            <CardHeader>
              <CardTitle className="text-xl font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Most Popular
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex space-x-3 group cursor-pointer"
                  >
                    <div className="w-16 h-20 bg-gradient-to-br from-gray-700 to-purple-800 rounded animate-pulse group-hover:scale-105 transition-transform" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gradient-to-r from-gray-700 to-purple-800 rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-gradient-to-r from-gray-700 to-purple-800 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MangaWebsite;
