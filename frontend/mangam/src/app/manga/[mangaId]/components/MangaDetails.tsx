import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

export const MangaDetails = ({
  title,
  author,
  genres,
  status,
  description,
}: {
  title: string;
  author: Author;
  genres: string[];
  status: string;
  description: string;
}) => (
  <div>
    <h1 className="text-3xl font-bold mb-2">{title}</h1>
    <div className="flex items-center gap-2 mb-4">
      <User className="w-4 h-4" />
      <span className="text-sm text-gray-600">by {author.name}</span>
    </div>
    <div className="flex flex-wrap gap-2 mb-4">
      {genres.map((genre) => (
        <Badge key={genre} variant="secondary">
          {genre}
        </Badge>
      ))}
    </div>
    <Badge className="mb-4">{status}</Badge>
    <p className="text-gray-700 mb-6">{description}</p>
  </div>
);
