"use client"

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { UserIcon, LockIcon, BookOpen, MailIcon } from 'lucide-react';

const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --color-background-start: #111827;
      --color-background-middle: #581C87;
      --color-background-end: #111827;
      --color-card-background: rgba(31, 41, 55, 0.5);
      --color-border: #4C1D95;
      --color-text-primary: #F3F4F6;
      --color-text-secondary: #9CA3AF;
      --color-gradient-start: #A78BFA;
      --color-gradient-end: #F472B6;
      --color-input-background: #1F2937;
      --color-input-border: #374151;
    }
  `}</style>
);

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
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
                {isLogin ? 'Welcome to MangaVerse' : 'Join MangaVerse'}
              </CardTitle>
              <p className="text-gray-400">
                {isLogin 
                  ? 'Sign in to continue your manga journey' 
                  : 'Create your account to start your manga journey'}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    className="pl-10 w-full bg-gray-800 border-gray-700 focus:border-purple-500 text-gray-200"
                    placeholder="Username"
                    type="text"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  className="pl-10 w-full bg-gray-800 border-gray-700 focus:border-purple-500 text-gray-200"
                  placeholder="Email address"
                  type="email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  className="pl-10 w-full bg-gray-800 border-gray-700 focus:border-purple-500 text-gray-200"
                  placeholder="Password"
                  type="password"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    className="pl-10 w-full bg-gray-800 border-gray-700 focus:border-purple-500 text-gray-200"
                    placeholder="Confirm password"
                    type="password"
                  />
                </div>
              </div>
            )}
            
            {isLogin ? (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-purple-500" />
                  <span className="text-sm text-gray-300">Remember me</span>
                </label>
                <a href="#" className="text-sm text-purple-400 hover:text-purple-300">
                  Forgot password?
                </a>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-purple-500" />
                <span className="text-sm text-gray-300">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </div>
            )}
            
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </CardContent>
          
          <CardFooter className="justify-center">
            <p className="text-gray-400 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleAuthMode}
                className="text-purple-400 hover:text-purple-300"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default AuthPage;