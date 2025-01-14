import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";
import ChapterItem from "./ChapterItem";

export const ChapterList = ({
  chapters,
  mangaId,
}: {
  chapters: Chapter[];
  mangaId: string;
}) => (
  <div>
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <BookOpen className="w-5 h-5" />
      Chapters
    </h2>
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-2">
        {chapters.map((chapter) => (
          <ChapterItem
            key={chapter.chapter_id}
            chapter={chapter}
            mangaId={mangaId}
          />
        ))}
      </div>
    </ScrollArea>
  </div>
);
