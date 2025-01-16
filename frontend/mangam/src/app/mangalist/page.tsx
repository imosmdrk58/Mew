"use client";
import React, { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import { GlobalStyles } from "@/gloabalStyles";
import Link from "next/link";

const categories = ["Tümü", "Shounen", "Shoujo", "Seinen", "Kodomo"];

// Manga tipini tanımlayalım
interface Manga {
  manga_id: number;
  id?: number;  // Eski ID alanı için opsiyonel
  title: string;
  cover_image: string;
  genre?: string;
  rating: number;
}

const MangaListPage = () => {
  const [mangaData, setMangaData] = useState<Manga[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const filteredManga = mangaData.filter((manga) => {
    const matchesSearch = manga.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tümü" || manga.genre === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const fetchMangaData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manga`);
        console.log("response", response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        console.log("data", data);
        setMangaData(data || []);
      } catch (error) {
        console.error("Error fetching manga data:", error);
      }
    };

    fetchMangaData();
  }, []);

  return (
    <>
      <GlobalStyles />
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(to bottom, var(--color-background-start), var(--color-background-middle), var(--color-background-end))`,
        }}
      >
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <h1
            className="text-2xl font-bold mb-6"
            style={{ color: "var(--color-text-primary)" }}
          >
            Manga Listesi
          </h1>

          {/* Search and Filter Section */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px] relative">
              <Search
                className="absolute left-3 top-2"
                style={{ color: "var(--color-text-secondary)" }}
                size={16}
              />
              <input
                type="text"
                placeholder="Manga ara..."
                className="w-full p-1 pl-9 rounded-lg text-sm"
                style={{
                  backgroundColor: "var(--color-input-background)",
                  borderColor: "var(--color-input-border)",
                  color: "var(--color-text-primary)",
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter
                size={16}
                style={{ color: "var(--color-text-secondary)" }}
              />
              <select
                className="p-1 rounded-lg text-sm"
                style={{
                  backgroundColor: "var(--color-input-background)",
                  borderColor: "var(--color-input-border)",
                  color: "var(--color-text-primary)",
                }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Manga Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredManga.map((manga) => (
              <Link
                href={`/manga/${manga.manga_id ?? manga.id}`}
                key={manga.manga_id ?? manga.id}
                className="rounded-lg p-2 transition-transform hover:scale-105"
                style={{
                  backgroundColor: "var(--color-card-background)",
                  borderColor: "var(--color-border)",
                  borderWidth: "1px",
                }}
              >
                <img
                  src={manga.cover_image}
                  alt={manga.title}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h3
                  className="text-sm font-bold truncate"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {manga.title}
                </h3>
                <div className="flex justify-between items-center mt-1">
                  {manga.genre && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{
                        background: `linear-gradient(to right, var(--color-gradient-start), var(--color-gradient-end))`,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {manga.genre}
                    </span>
                  )}
                  <span
                    className="text-xs flex items-center gap-1"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    ⭐{" "}
                    {manga.rating ? (manga.rating * 1).toFixed(1) : "N/A"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MangaListPage;
