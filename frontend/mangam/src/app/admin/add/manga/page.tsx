"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

// Form schema with validation
const formSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  authorId: z.string().min(1, "Yazar zorunludur"),
  description: z.string().min(1, "Açıklama zorunludur"),
  status: z.string().min(1, "Durum zorunludur"),
  coverImage: z.string().optional(), // coverImage'i opsiyonel yaptık
});


export default function AddMangaPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      authorId: "",
      description: "",
      status: "",
      coverImage: "",
    },
  });

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch('http://localhost:8080/authors');
        const data = await response.json();
        const newAuthors: Author[] = data.map((author: any) => ({
          author_id: author.author_id,
          name: author.name,
          bio: author.bio,
        }));
        setAuthors(newAuthors);
      } catch (error) {
        console.error('Error fetching authors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitError(null);
      
      // authorId'yi sayıya dönüştür
      const formData = {
        ...values,
        authorId: parseInt(values.authorId, 10),
      };
  
      const data = {
        "title": formData.title,
        "description": formData.description,
        "status": formData.status,
        "cover_image": formData.coverImage,
        "author_id": formData.authorId,
      };
      
      console.log('Form submitted with values:', JSON.stringify(data));
    
      const response = await fetch('http://localhost:8080/manga/create-manga', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorResponse = await response.json(); // API'den gelen hata mesajını oku
        throw new Error(`API call failed: ${errorResponse.message || 'Unknown error'}`);
      }
  
      const result = await response.json();
      console.log('API response:', result);
  
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Form gönderilirken bir hata oluştu.');
    }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <Card className="max-w-2xl mx-auto shadow-xl hover:shadow-2xl transition-shadow duration-300 border-none">
        <CardHeader className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold tracking-tight">
            ✨ Manga Ekle
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {submitError}
            </div>
          )}
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
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Yazar
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-lg border-gray-200 focus:border-violet-500 focus:ring-violet-500">
                          <SelectValue placeholder="Yazar seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white rounded-lg shadow-lg border-gray-200">
                        {authors.map((author) => (
                          <SelectItem
                            key={author.author_id}
                            value={author.author_id.toString()}
                            className="hover:bg-violet-50"
                          >
                            {author.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
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
                    <FormMessage className="text-red-500" />
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
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Kapak Görseli (Opsiyonel)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-11 rounded-lg border-gray-200 focus:border-violet-500 focus:ring-violet-500 transition-all duration-200"
                        placeholder="Kapak görseli URL'sini girin..."
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
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