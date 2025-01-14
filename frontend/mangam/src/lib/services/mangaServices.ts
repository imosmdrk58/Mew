import { transformChaptersData } from "../utils";

// services/mangaService.ts
export const mangaService = {
  async getMangaDetails(mangaId: string): Promise<Manga> {
    try {
      const [mangaResponse, chaptersResponse] = await Promise.all([
        fetch(`http://localhost:8080/manga/${mangaId}`),
        fetch(`http://localhost:8080/manga/${mangaId}/chapters`),
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
