'use client'
import React, { useState } from 'react';
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
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MoreVertical, Trash2, UserCog } from "lucide-react";

const UserManagement = () => {
  // Örnek kullanıcı verisi
  const [users, setUsers] = useState([
    { id: 1, name: "Ahmet Yılmaz", email: "ahmet@ornek.com", role: "user" },
    { id: 2, name: "Mehmet Demir", email: "mehmet@ornek.com", role: "admin" },
    { id: 3, name: "Ayşe Kaya", email: "ayse@ornek.com", role: "user" },
  ]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    setDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, var(--color-background-start), var(--color-background-middle), var(--color-background-end))' }}>
      <Card className="w-full max-w-6xl mx-auto" style={{ backgroundColor: 'var(--color-card-background)', borderColor: 'var(--color-border)' }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Kullanıcı Yönetimi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ color: 'var(--color-text-primary)' }}>Kullanıcı Adı</TableHead>
                <TableHead style={{ color: 'var(--color-text-primary)' }}>E-posta</TableHead>
                <TableHead style={{ color: 'var(--color-text-primary)' }}>Rol</TableHead>
                <TableHead style={{ color: 'var(--color-text-primary)' }}>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell style={{ color: 'var(--color-text-primary)' }}>{user.name}</TableCell>
                  <TableCell style={{ color: 'var(--color-text-secondary)' }}>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin' 
                          ? 'bg-purple-900 text-purple-100' 
                          : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
                          className="flex items-center"
                        >
                          <UserCog className="mr-2 h-4 w-4" />
                          Rolü Değiştir
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setDeleteDialogOpen(true);
                          }}
                          className="flex items-center text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcıyı Silme</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.name} adlı kullanıcıyı silmek istediğinize emin misiniz?
              Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteUser(selectedUser?.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;