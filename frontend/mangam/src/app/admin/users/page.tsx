'use client';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MoreVertical, Trash2, UserCog, Shield, User } from "lucide-react";

const UserManagement = () => {
  interface User {
    username: string;
    email: string;
    is_admin: boolean;
  }
  
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Kullanıcıları yüklerken hata oluştu: ${errorText}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const handleDeleteUser = async (username: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Kullanıcı silinirken hata oluştu: ${errorText}`);
        }
        
        setUsers(users.filter(user => user.username !== username));
    } catch (error) {
        console.error("Delete Error:", error);
    }
};

const handleRoleChange = async (username: string, newIsAdmin: boolean) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/role`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_admin: newIsAdmin }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Rol değiştirilirken hata oluştu: ${errorText}`);
        }


        setUsers(users.map(user =>
            user.username === username ? { ...user, is_admin: newIsAdmin } : user
        ));
    } catch (error) {
        console.error("Role Change Error:", error);
    }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <main className="pt-12 pb-8 px-6 max-w-7xl mx-auto">
        <Card className="bg-gray-800/50 backdrop-blur border-gray-700 hover:bg-gray-800/70 transition-colors shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Kullanıcı Yönetimi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ color: 'white', fontWeight: '600' }}>Kullanıcı Adı</TableHead>
                  <TableHead style={{ color: 'white', fontWeight: '600' }}>E-posta</TableHead>
                  <TableHead style={{ color: 'white', fontWeight: '600' }}>Rol</TableHead>
                  <TableHead style={{ color: 'white', fontWeight: '600' }}>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.username} className="hover:bg-gray-800 transition duration-200">
                    <TableCell style={{ color: 'white' }}>{user.username}</TableCell>
                    <TableCell style={{ color: 'white' }}>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center w-fit gap-1 ${
                          user.is_admin
                            ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white'
                            : 'bg-gradient-to-r from-gray-500 to-gray-700 text-white'
                        }`}
                      >
                        {user.is_admin ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        {user.is_admin ? 'Admin' : 'User'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4 text-white" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 bg-gray-800 border-gray-700">
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(user.username, !user.is_admin)}
                            className="flex items-center gap-2 text-white hover:bg-gray-700 cursor-pointer"
                          >
                            <UserCog className="h-4 w-4" />
                            {user.is_admin ? "User Yap" : "Admin Yap"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-700" />
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user.username)}
                            className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-gray-700 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                            Kullanıcıyı Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UserManagement;