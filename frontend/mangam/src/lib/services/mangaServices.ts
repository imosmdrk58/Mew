import { transformChaptersData } from "../utils";

// services/mangaService.ts
export const mangaService = {
  async getMangaDetails(mangaId: string): Promise<Manga> {
    try {
      const [mangaResponse, chaptersResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/manga/${mangaId}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/manga/${mangaId}/chapters`),
      ]);

      if (!mangaResponse.ok || !chaptersResponse.ok) {
        throw new Error("Failed to fetch manga data");
      }

      const mangaData = await mangaResponse.json();
      const chaptersData = (await chaptersResponse.json()) || [];

      return transformMangaData(mangaData, chaptersData);
    } catch (error) {
      console.error("Error fetching manga details:", error);
      throw error;
    }
  },

  async getUserRating(mangaId: string, userId: string): Promise<number> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/manga/${mangaId}/rating`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user rating");
      }

      const data = await response.json();
      return data.rating;
    } catch (error) {
      console.error("Error fetching user rating:", error);
      throw error;
    }
  },

  async rateManga(
    mangaId: string,
    userId: string,
    rating: number,
    review: string
  ): Promise<void> {
    try {
      console.log("mangaId", mangaId);
      console.log("userId", userId);
      console.log("rating", rating);
      console.log("review", review);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/manga/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            manga_id: mangaId,
            rating,
            review,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to rate manga");
      }
    } catch (error) {
      console.error("Error rating manga:", error);
      throw error;
    }
  },
};

// utils/transformers.ts
export const transformMangaData = (
  mangaData: any,
  chaptersData: any[]
): Manga => ({
  manga_id: mangaData.id ?? mangaData.manga_id,
  title: mangaData.title,
  description: mangaData.description,
  cover_image: mangaData.cover_image,
  status: mangaData.status,
  published_date: mangaData.published_date,
  last_updated: mangaData.last_updated,
  genres: [],
  chapters: transformChaptersData(chaptersData, mangaData.id),
  author: {
    author_id: mangaData.author_id,
    name: mangaData.author_name,
    bio: mangaData.author_bio,
  },
});
