// components/FavoriteButton.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";
import { useAuthStore } from "@/store/userStore";

interface FavoriteButtonProps {
  mangaId: string;
  userId?: string; // username yerine userId kullanıyoruz
}

export const FavoriteButton = ({ mangaId, userId }: FavoriteButtonProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites/user/${userId}/manga/${mangaId}`,
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
      const sentData = {
        manga_id: parseInt(mangaId),
        user_id: userId,
      };
      if (isFavorited) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites/remove`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sentData),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to remove from favorites");
        }

      } else {
        // Favorilere ekle
       
        console.log("sent ", JSON.stringify(sentData));
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites/add`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sentData),
          });
          const data = await response.json();
          console.log(data);
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
        <HeartOff className="w-5 h-5" />
          Remove from Favorites
        </>
      ) : (
        <>
          <Heart className="w-5 h-5 fill-current" />
          Add to Favorites
        </>
      )}
    </Button>
  );
};
