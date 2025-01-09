"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  author: z.string().min(1, "Yazar zorunludur"),
  description: z.string().min(1, "Açıklama zorunludur"),
  status: z.string().min(1, "Durum zorunludur"),
  coverImage: z.string().min(1, "Kapak görseli zorunludur"),
});

export default function AddMangaPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      status: "",
      coverImage: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // API çağrısı yapılacak
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <Card className="max-w-2xl mx-auto shadow-xl hover:shadow-2xl transition-shadow duration-300 border-none">
        <CardHeader className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold tracking-tight">
            ✨ deneme
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Başlık
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-11 rounded-lg border-gray-200 focus:border-violet-500 focus:ring-violet-500 transition-all duration-200"
                        placeholder="Manga başlığını girin..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Yazar
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-11 rounded-lg border-gray-200 focus:border-violet-500 focus:ring-violet-500 transition-all duration-200"
                        placeholder="Manga yazarını girin..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Açıklama
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-11 rounded-lg border-gray-200 focus:border-violet-500 focus:ring-violet-500 transition-all duration-200"
                        placeholder="Manga açıklamasını girin..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Durum
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-lg border-gray-200 focus:border-violet-500 focus:ring-violet-500">
                          <SelectValue placeholder="Durum seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white rounded-lg shadow-lg border-gray-200">
                        <SelectItem
                          value="ongoing"
                          className="hover:bg-violet-50"
                        >
                          Devam Ediyor
                        </SelectItem>
                        <SelectItem
                          value="completed"
                          className="hover:bg-violet-50"
                        >
                          Tamamlandı
                        </SelectItem>
                        <SelectItem
                          value="dropped"
                          className="hover:bg-violet-50"
                        >
                          Bırakıldı
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Manga Ekle
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
