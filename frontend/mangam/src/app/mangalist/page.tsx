"use client"
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --color-background-start: #111827;
      --color-background-middle: #581C87;
      --color-background-end: #111827;
      --color-card-background: rgba(31, 41, 55, 0.5);
      --color-border: #4C1D95;
      --color-text-primary: #F3F4F6;
      --color-text-secondary: #9CA3AF;
      --color-gradient-start: #A78BFA;
      --color-gradient-end: #F472B6;
      --color-input-background: #1F2937;
      --color-input-border: #374151;
    }
  `}</style>
);

const mangaData = [
  { id: 1, title: "Naruto", category: "Shounen", rating: 4.5, image: "/api/placeholder/150/200", description: "Ninja dünyasında geçen bir macera." },
  { id: 2, title: "Sailor Moon", category: "Shoujo", rating: 4.3, image: "/api/placeholder/150/200", description: "Magical girl serisi." },
  { id: 3, title: "Monster", category: "Seinen", rating: 4.8, image: "/api/placeholder/150/200", description: "Psikolojik gerilim." },
  { id: 4, title: "Chi's Sweet Home", category: "Kodomo", rating: 4.2, image: "/api/placeholder/150/200", description: "Sevimli bir kedi hikayesi." },
  { id: 5, title: "Berserk", category: "Seinen", rating: 4.9, image: "/api/placeholder/150/200", description: "Karanlık fantezi dünyası." },
  { id: 6, title: "One Piece", category: "Shounen", rating: 4.7, image: "/api/placeholder/150/200", description: "Korsan macerası." }
];

const categories = ["Tümü", "Shounen", "Shoujo", "Seinen", "Kodomo"];

const MangaListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const filteredManga = mangaData.filter(manga => {
    const matchesSearch = manga.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tümü" || manga.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen" style={{
        background: `linear-gradient(to bottom, var(--color-background-start), var(--color-background-middle), var(--color-background-end))`
      }}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Manga Listesi
          </h1>

          {/* Search and Filter Section */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-2" style={{ color: 'var(--color-text-secondary)' }} size={16} />
              <input
                type="text"
                placeholder="Manga ara..."
                className="w-full p-1 pl-9 rounded-lg text-sm"
                style={{
                  backgroundColor: 'var(--color-input-background)',
                  borderColor: 'var(--color-input-border)',
                  color: 'var(--color-text-primary)'
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={16} style={{ color: 'var(--color-text-secondary)' }} />
              <select
                className="p-1 rounded-lg text-sm"
                style={{
                  backgroundColor: 'var(--color-input-background)',
                  borderColor: 'var(--color-input-border)',
                  color: 'var(--color-text-primary)'
                }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Manga Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredManga.map(manga => (
              <div
                key={manga.id}
                className="rounded-lg p-2 transition-transform hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-card-background)',
                  borderColor: 'var(--color-border)',
                  borderWidth: '1px'
                }}
              >
                <img
                  src={manga.image}
                  alt={manga.title}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h3 className="text-sm font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>
                  {manga.title}
                </h3>
                <div className="flex justify-between items-center mt-1">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{
                      background: `linear-gradient(to right, var(--color-gradient-start), var(--color-gradient-end))`,
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {manga.category}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    ⭐ {manga.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MangaListPage;