"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import ErrorPage from "@/components/ui/ErrorPage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuthStore } from "@/store/userStore";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";



const handleRemoveFromFavorites = (mangaId: string) => {
    // Burada favori kaldırma işlemi yapılacak
    console.log(`Removing manga with id: ${mangaId}`);
  };

const FavoritesPage = () => {
    const [userFavoriteMangas, setUserFavoriteMangas] = useState<Manga[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const userId = useAuthStore((state) => state.user?.userId);


    useEffect(() => {
        if (!userId) return;
        
        const fetchFavorites = async () => {
            try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}favorites/user/${userId}`);
            console.log(response.ok);
            const data = await response.json();
            console.log(data);
            const mangas = data.map((manga: any) => ({
                manga_id: manga.manga_id,
                title: manga.title,
                description: manga.description,
                cover_image: manga.cover_image,
                status: manga.status,
                published_date: manga.published_date,
                last_updated: manga.last_updated,
                rating: manga.rating,
            }));
            setUserFavoriteMangas(data);
               
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
        };

        fetchFavorites();
    }, [userId]);


    if (!userFavoriteMangas) return <ErrorPage errorMessage="No favourite manga" />;
    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto py-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Favori Mangalarım</CardTitle>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userFavoriteMangas.map((manga) => (
                    <Card key={manga.manga_id} className="flex flex-col group hover:shadow-lg transition-shadow">
                    <Link href={`/manga/${manga.manga_id}`} className="flex-1">
                        <CardContent className="p-4 cursor-pointer">
                        <div className="aspect-[2/3] relative mb-4 overflow-hidden rounded-lg">
                            <img
                            src={manga.cover_image}
                            alt={manga.title}
                            className="object-cover w-full h-full transition-transform group-hover:scale-105"
                            />
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                            {manga.title}
                        </h3>
                        </CardContent>
                    </Link>
                    <CardFooter className="flex justify-end mt-auto p-4">
                        <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                            e.preventDefault();
                            handleRemoveFromFavorites(manga.manga_id.toString());
                        }}
                        >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Favorilerden Kaldır
                        </Button>
                    </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
      );
};

export default FavoritesPage;
