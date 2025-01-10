interface Manga {
  manga_id: number;
  title: string;
  description: string;
  cover_image_url: string;
  status: "ongoing" | "completed" | "hiatus";
  published_date: string;
  last_updated: string;
  genres: string[];
  chapters: Chapter[];
}

interface Author {
  author_id: number;
  name: string;
  bio: string;
}

interface AuthorManga {
  author_id: number;
  manga_id: number;
}

interface Page {
  page_id: number;
  chapter_id: number;
  url: string;
  page_number: number;
}

interface Chapter {
  chapter_id: number;
  manga_id: number;
  chapter_number: number;
  title: string;
  release_date: string;
  pages: Page[];
  nextChapter?: number;
  prevChapter?: number;
}
