"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { toast } from 'sonner';

export default function FollowButton({ checkMangaFollowed, handleMangaFollowed, mangaId, email }) {
    const [followed, setFollowed] = useState(false);

    const handleOnClick = async () => {
        toast.error("Manga ID:", mangaId);
        toast.error("Email:", email);

        try {
            const checkFollowed = await checkMangaFollowed(mangaId, email);
            console.log("Followed status before click:", checkFollowed);
            setFollowed(checkFollowed);

            let respond;
            if (!checkFollowed) {
                respond = await handleMangaFollowed(mangaId, email);
                console.log("Follow Manga Response:", respond);
                if (respond) {
                    toast.success("This manga has been added to Favorite List.");
                    setFollowed(true);
                } else {
                    toast.error("respond:"+respond); 
                }
            } else {
                respond = await handleMangaFollowed(mangaId, email);
                console.log("Unfollow Manga Response:", respond);
                if (respond) {
                    toast.success("This manga has been removed from Favorite List.");
                    setFollowed(false);
                } else {
                    toast.error("Failed to cancel following manga.");
                }
            }
        } catch (error) {
            console.error("Error during follow/unfollow operation:", error);
            toast.error("An unexpected error occurred.");
        }
    };

    return (
        <Button
            onClick={handleOnClick}
            className={`py-2 px-5 ml-5 ${followed ? "bg-red-500" : "bg-[#2f2f2f]"} font-bold hover:text-opacity-75 text-white lg:hover:bg-red-500`}
        >
            <Image
                className="w-full h-full"
                src={"https://img.icons8.com/?size=100&id=25157&format=png&color=D9DFE9"}
                width={0}
                height={0}
                alt="mark"
            />
        </Button>
    );
}
