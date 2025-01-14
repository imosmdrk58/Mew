// components/manga/ChapterItem.tsx
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ChapterItemProps {
  chapter: Chapter;
  mangaId: string;
}

const ChapterItem = ({ chapter, mangaId }: ChapterItemProps) => {
  const formattedDate = new Date(chapter.release_date).toLocaleDateString();

  return (
    <Link
      href={`/manga/${mangaId}/chapter/${chapter.chapter_number}`}
      className="block"
    >
      <Card>
        <CardContent className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
          <div>
            <div className="font-medium">
              Chapter {chapter.chapter_number} - {chapter.title}
            </div>
            <div className="text-sm text-gray-500">{formattedDate}</div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </CardContent>
      </Card>
    </Link>
  );
};

export default ChapterItem;
