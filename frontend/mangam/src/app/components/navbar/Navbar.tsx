"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Search, Users } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/userStore";

const NavigationBar = () => {
  const user = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  interface Manga {
    manga_id: string;
    cover_image: string;
    title: string;
    author_name: string;
  }

  const [searchResults, setSearchResults] = useState<Manga[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchSearch = async () => {
      if (searchTerm.length === 0) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/manga/search?search=${encodeURIComponent(searchTerm)}`
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce işlemi için timeout
    const timeoutId = setTimeout(() => {
      fetchSearch();
    }, 300); // 300ms bekle

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <nav className="border-b border-purple-900 bg-gray-900/75 backdrop-blur-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href={user && user.is_admin ? "/admin" : "/"}>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent cursor-pointer">
                MangaVerse
              </h1>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/mangalist">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 hover:bg-gray-800"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Manga List</span>
                </Button>
              </Link>
              {user && (
                <>
                  {user.is_admin ? (
                    <Link href="/admin/users">
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-2 text-gray-300 hover:text-pink-400 hover:bg-gray-800"
                      >
                        <Users className="h-4 w-4" />
                        <span>Users</span>
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/mangalist/favorites">
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-2 text-gray-300 hover:text-pink-400 hover:bg-gray-800"
                      >
                        <Heart className="h-4 w-4" />
                        <span>Favorites</span>
                      </Button>
                    </Link>
                  )}
                </>
              )}

              {user && user.is_admin && (
                <Link href="/admin/logs">
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-gray-300 hover:text-pink-400 hover:bg-gray-800"
                  >
                    <span className="text-red-500">!</span>
                    <span>See Logs</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10 w-64 bg-gray-800 border-gray-700 focus:border-purple-500 text-gray-200 placeholder:text-gray-500"
                placeholder="Search manga..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* Arama sonuçları dropdown */}
              {searchResults && searchResults.length > 0 && (
                <div className="absolute mt-2 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                  {searchResults.map((manga) => (
                    <Link
                      key={manga.manga_id}
                      href={`/manga/${manga.manga_id}`}
                    >
                      <div className="flex items-center p-2 hover:bg-gray-700 cursor-pointer">
                        <img
                          src={manga.cover_image}
                          alt={manga.title}
                          className="w-10 h-14 object-cover rounded mr-2"
                        />
                        <div>
                          <div className="text-sm text-gray-200">
                            {manga.title}
                          </div>
                          <div className="text-xs text-gray-400">
                            {manga.author_name}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <Link href="/profile">
                <span className="text-gray-200 hover:text-purple-400 cursor-pointer transition-colors">
                  {user.username}
                </span>
              </Link>
            ) : (
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
