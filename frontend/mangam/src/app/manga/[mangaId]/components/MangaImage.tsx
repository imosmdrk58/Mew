import { Card, CardContent } from "@/components/ui/card";

export const MangaImage = ({
  coverImage,
  title,
}: {
  coverImage: string;
  title: string;
}) => (
  <Card className="p-0">
    <CardContent className="p-0">
      <div className="relative aspect-[2/3] w-full">
        <img src={coverImage} alt={title} className="object-cover w-full h-full rounded-lg" />
      </div>
    </CardContent>
  </Card>
);
