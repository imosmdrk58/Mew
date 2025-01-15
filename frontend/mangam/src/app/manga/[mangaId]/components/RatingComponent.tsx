// components/RatingComponent.tsx
"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useAuthStore } from "@/store/userStore";
import { mangaService } from "@/lib/services/mangaServices";

interface RatingProps {
  mangaId: string;
  initialRating?: number;
}

export const RatingComponent = ({ mangaId, initialRating }: RatingProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useAuthStore((state) => state.user?.userId);

  useEffect(() => {
    const fetchUserRating = async () => {
      if (!userId) return;

      try {
        const userRating = await mangaService.getUserRating(mangaId, userId);
        if (userRating) {
          setRating(userRating);
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    fetchUserRating();
  }, [mangaId, userId]);

  const handleRating = async (value: number) => {
    if (!userId) {
      alert("Please login to rate this manga");
      return;
    }

    setIsLoading(true);
    try {
      await mangaService.rateManga(mangaId, userId, value, "Deneme");
      setRating(value);
    } catch (error) {
      console.error("Error rating manga:", error);
      alert("Failed to rate manga. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            disabled={isLoading}
            onClick={() => handleRating(value)}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(0)}
            className="relative p-1 transition-colors"
          >
            <Star
              className={`w-6 h-6 ${
                (hoveredRating ? value <= hoveredRating : value <= rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-none text-gray-300"
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-500">
        {rating ? `Your rating: ${rating}/5` : "Rate this manga"}
      </span>
    </div>
  );
};
