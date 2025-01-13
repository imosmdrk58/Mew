'use client'
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, Mail, Star, BookOpen, Clock, Shield, Heart, MessageCircle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const UserProfile = () => { //zaman kalırsa kullanıcı için detay bilgiler
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const user = {
    username: "MangaLover",
    email: "manga@example.com",
    isAdmin: true,
    createdAt: "2024-01-13",
    stats: {
      readCount: 142,
      favoriteCount: 23,
      commentsCount: 56
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    <div className="pt-24 md:pt-32">
      <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8">
          {/* Ana Profil Kartı */}
          <Card className="backdrop-blur-xl bg-gray-800/80 border-2 border-gray-700">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-bold text-white">{user.username[0].toUpperCase()}</span>
                  </div>
                  {user.isAdmin && (
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-400 to-pink-400 p-2 rounded-full shadow-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Kullanıcı Bilgileri */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {user.username}
                  </h1>
                  <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-gray-100">
                    <div className="flex items-center gap-2 hover:text-purple-400 transition-colors">
                      <Mail className="w-4 h-4 text-purple-400" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-purple-400 transition-colors">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* İstatistikler */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <StatCard icon={<BookOpen className="w-6 h-6" />} value={user.stats.readCount} label="Okunan Manga" />
                <StatCard icon={<Heart className="w-6 h-6" />} value={user.stats.favoriteCount} label="Favori" />
                <StatCard icon={<MessageCircle className="w-6 h-6" />} value={user.stats.commentsCount} label="Yorum" />
                <StatCard icon={<Clock className="w-6 h-6" />} value="24 saat" label="Okuma Süresi" />
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg"
                >
                  <LogOut className="w-5 h-5" />
                  Çıkış Yap
                </button>
              </div>
            </CardContent>
          </Card>

          

          {/* Son Aktiviteler */}
          <Card className="backdrop-blur-xl bg-gray-800/80 border border-gray-700">
            <CardHeader>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Son Aktiviteler
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800/80 transition-all duration-300"
                  >
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg">
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-100 group-hover:text-purple-400 transition-colors">
                        One Piece Chapter 1089
                      </h3>
                      <p className="text-sm text-gray-400">2 saat önce okundu</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  value,
  label
}: {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  value: string | number;
  label: string;
}) => (
  <div className="p-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800/80 transition-all duration-300">
    <div className="flex flex-col items-center gap-2">
      <div className="p-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg">
        {React.cloneElement(icon, { className: 'text-white' })}
      </div>
      <span className="text-2xl font-bold text-gray-100">{value}</span>
      <span className="text-sm text-gray-400">{label}</span>
    </div>
  </div>
);

export default UserProfile;