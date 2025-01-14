import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// utils/transformers.ts
export const transformChaptersData = (
  chaptersData: Chapter[],
  mangaId: string
): Chapter[] => {
  return chaptersData.map((chapter: any, index: number) => ({
    chapter_id: chapter.id,
    manga_id: parseInt(mangaId, 10),
    chapter_number: chapter.chapter_number,
    title: chapter.title || `Chapter ${chapter.chapter_number}`,
    release_date: chapter.release_date || new Date().toISOString(),
    genres: chapter.genres || [],
    pages: chapter.pages || [],
    nextChapter:
      index < chaptersData.length - 1
        ? chaptersData[index + 1].chapter_number
        : undefined,
    prevChapter: index > 0 ? chaptersData[index - 1].chapter_number : undefined,
    mangaId: mangaId,
  }));
};
