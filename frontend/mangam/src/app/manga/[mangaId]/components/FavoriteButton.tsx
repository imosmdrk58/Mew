// components/FavoriteButton.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";

interface FavoriteButtonProps {
  mangaId: string;
  userId?: string; // username yerine userId kullanıyoruz
}

export const FavoriteButton = ({ mangaId, userId }: FavoriteButtonProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/favorites/check/${mangaId}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to check favorite status");
        }

        const data = await response.json();
        setIsFavorited(data.is_favorited); // API'den dönen yapıya göre düzeltildi
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    if (userId && mangaId) {
      checkFavoriteStatus();
    }
  }, [mangaId, userId]);

  const handleToggleFavorite = async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      if (isFavorited) {
        // Favorilerden kaldır
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/favorites/remove/${mangaId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to remove from favorites");
        }
      } else {
        // Favorilere ekle
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/favorites/add/${mangaId}`,
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add to favorites");
        }
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      variant={isFavorited ? "default" : "outline"}
      className="flex items-center gap-2"
    >
      {isFavorited ? (
        <>
          <Heart className="w-5 h-5 fill-current" />
          Remove from Favorites
        </>
      ) : (
        <>
          <HeartOff className="w-5 h-5" />
          Add to Favorites
        </>
      )}
    </Button>
  );
};
