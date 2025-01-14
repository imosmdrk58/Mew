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
import { useRouter } from "next/navigation";

// Form schema with validation
const formSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  authorId: z.string().min(1, "Yazar zorunludur"),
  description: z.string().min(1, "Açıklama zorunludur"),
  status: z.string().min(1, "Durum zorunludur"),
  coverImage: z.string().optional(),
  publishedDate: z.string().min(1, "Yayın tarihi zorunludur"), // Yeni eklenen alan
});

const AddMangaPage = () => {
  const router = useRouter();
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
      publishedDate: "", // Yeni eklenen alan
    },
  });

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch("http://localhost:8080/authors");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data) {
          const newAuthors: Author[] = data.map((author: any) => ({
            author_id: author.author_id,
            name: author.name,
            bio: author.bio,
          }));
          setAuthors(newAuthors);
        } else {
          setAuthors([]);
        }
      } catch (error) {
        console.error("Error fetching authors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitError(null);

      const formData = {
        ...values,
        authorId: parseInt(values.authorId, 10),
      };

      const data = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        cover_image: formData.coverImage,
        author_id: formData.authorId,
        published_date: formData.publishedDate,
      };

      console.log("Form submitted with values:", JSON.stringify(data));

      const response = await fetch("http://localhost:8080/manga/create-manga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          `API call failed: ${errorResponse.message || "Unknown error"}`
        );
      }

      const result = await response.json();
      console.log("API response:", result);

      router.push(`/admin/add`);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError("Form gönderilirken bir hata oluştu.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <Card className="max-w-3xl mx-auto bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
        <CardHeader className="space-y-1 border-b border-gray-100 p-6">
          <CardTitle className="text-2xl font-medium text-gray-900">
            Yeni Manga Ekle
          </CardTitle>
          <p className="text-sm text-gray-500">
            Manga koleksiyonunuza yeni bir eser ekleyin
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {submitError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <p className="text-red-700 text-sm">{submitError}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          className="h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                          placeholder="Manga başlığı..."
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
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
                          <SelectTrigger className="h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400">
                            <SelectValue placeholder="Yazar seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white rounded-md shadow-lg">
                          {authors.map((author) => (
                            <SelectItem
                              key={author.author_id}
                              value={author.author_id.toString()}
                              className="hover:bg-gray-50"
                            >
                              {author.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Açıklama
                    </FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        className="w-full h-24 rounded-md border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors resize-none"
                        placeholder="Manga hakkında kısa bir açıklama..."
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="publishedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Yayın Tarihi
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
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
                          <SelectTrigger className="h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400">
                            <SelectValue placeholder="Durum seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ongoing">Devam Ediyor</SelectItem>
                          <SelectItem value="completed">Tamamlandı</SelectItem>
                          <SelectItem value="dropped">Bırakıldı</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Kapak Görseli URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                        placeholder="https://..."
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-md transition-colors duration-200"
                >
                  Kaydet
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMangaPage;
