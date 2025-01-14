// components/FavoriteButton.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";

interface FavoriteButtonProps {
  mangaId: string;
  username?: string; // You'll need to pass the current user's username
}

export const FavoriteButton = ({ mangaId, username }: FavoriteButtonProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/favorites/${mangaId}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to check favorite status");
        }

        const data = await response.json();
        setIsFavorited(data);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    if (username && mangaId) {
      checkFavoriteStatus();
    }
  }, [mangaId, username]);

  const handleToggleFavorite = async () => {
    if (!username) return; // Kullanıcı oturum açmamışsa işlem yapılmaz
    setIsLoading(true);

    try {
      if (isFavorited) {
        // Favorilerden kaldır
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/favorites/${mangaId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to remove from favorites");
        }
      } else {
        // Favorilere ekle

        console.log("hjere", mangaId);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/favorites/add`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ mangaId }),
          }
        );

        console.log("response", response);

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
