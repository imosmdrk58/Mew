  
  interface MangaDetail {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    description: string;
    status: 'Ongoing' | 'Completed';
    genres: string[];
    chapters: Chapter[];
  }

  interface ChapterImage {
    id: number;
    url: string;
    page: number;
  }
  
  interface Chapter {
    id: number;
    title: string;
    number: number;
    uploadDate: string;
    images: ChapterImage[];
    nextChapter?: number;
    prevChapter?: number;
    mangaId: string;
  }