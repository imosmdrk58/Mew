"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { UserIcon, LockIcon, BookOpen, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { GlobalStyles } from "@/gloabalStyles";
import { useAuthStore } from "@/store/userStore";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit");
    e.preventDefault();
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: isLogin ? undefined : formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      const data = await response.json();
      setUser(data); // Set the user data in the store

      if (data.is_admin) {
        router.push("/admin");
        return;
      }

      router.push("/mangalist");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur border-gray-700">
          <CardHeader className="space-y-6 items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {isLogin ? "Welcome to MangaVerse" : "Join MangaVerse"}
              </CardTitle>
              <p className="text-gray-400">
                {isLogin
                  ? "Sign in to continue your manga journey"
                  : "Create your account to start your manga journey"}
              </p>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div className="space-y-2">
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-10 w-full bg-gray-800 border-gray-700 focus:border-purple-500 text-gray-200"
                    placeholder="Username"
                    type="text"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 w-full bg-gray-800 border-gray-700 focus:border-purple-500 text-gray-200"
                      placeholder="Email address"
                      type="email"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 w-full bg-gray-800 border-gray-700 focus:border-purple-500 text-gray-200"
                    placeholder="Password"
                    type="password"
                    required
                  />
                </div>
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 w-full bg-gray-800 border-gray-700 focus:border-purple-500 text-gray-200"
                      placeholder="Confirm password"
                      type="password"
                      required
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </CardContent>
          </form>

          <CardFooter className="justify-center">
            <p className="text-gray-400 text-sm">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={toggleAuthMode}
                className="text-purple-400 hover:text-purple-300"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default AuthPage;
