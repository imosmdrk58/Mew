"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Search } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/userStore";

const NavigationBar = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="border-b border-purple-900 bg-gray-900/75 backdrop-blur-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {/* Site Name */}
            <Link href={user?.is_admin ? "/admin" : "/"}>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent cursor-pointer">
                MangaVerse
              </h1>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link href="/mangalist">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 hover:bg-gray-800"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Manga List</span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-gray-300 hover:text-pink-400 hover:bg-gray-800"
              >
                <Heart className="h-4 w-4" />
                <span>Favorites</span>
              </Button>
            </div>
          </div>

          {/* Search and Login/Username */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10 w-64 bg-gray-800 border-gray-700 focus:border-purple-500 text-gray-200 placeholder:text-gray-500"
                placeholder="Search manga..."
              />
            </div>

            {/* Conditional rendering based on user state */}
            {user ? (
              <span className="text-gray-200">{user.username}</span>
            ) : (
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
