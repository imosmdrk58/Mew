import { Card, CardContent } from "@/components/ui/card";

export const MangaImage = ({
  coverImage,
  title,
}: {
  coverImage: string;
  title: string;
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="relative aspect-[2/3] w-full">
        <img src={coverImage} alt={title} className="object-cover rounded-lg" />
      </div>
    </CardContent>
  </Card>
);
