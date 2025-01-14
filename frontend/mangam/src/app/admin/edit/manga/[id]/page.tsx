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
import { useParams, useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  authorId: z.string().min(1, "Yazar zorunludur"),
  description: z.string().min(1, "Açıklama zorunludur"),
  status: z.string().min(1, "Durum zorunludur"),
  coverImage: z.string().optional(),
  publishedDate: z.string().min(1, "Yayın tarihi zorunludur"),
});

interface Author {
  author_id: number;
  name: string;
  bio: string;
}

interface MangaData {
  manga_id: number;
  title: string;
  description: string;
  status: string;
  cover_image: string;
  author_id: number;
  published_date: string;
}

const EditMangaPage = ({ params }: { params: { id: string } }) => {
  params = useParams();
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<MangaData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      authorId: "",
      description: "",
      status: "",
      coverImage: "",
      publishedDate: "",
    },
  });

  // Fetch authors
  useEffect(() => {
    let mangaData: MangaData | null = null;
    let authorsData: Author[] = [];

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch manga and authors in parallel
        const [mangaResponse, authorsResponse] = await Promise.all([
          fetch(`http://localhost:8080/manga/${params.id}`),
          fetch("http://localhost:8080/authors"),
        ]);

        if (!mangaResponse.ok || !authorsResponse.ok) {
          throw new Error("Veri yüklenirken hata oluştu");
        }

        // Get both responses
        mangaData = await mangaResponse.json();
        const authorsResult = await authorsResponse.json();

        // Process authors data
        authorsData = authorsResult.map((author: any) => ({
          author_id: author.author_id,
          name: author.name,
          bio: author.bio,
        }));

        // Set states
        setOriginalData(mangaData);
        setAuthors(authorsData);
        if (!mangaData) {
          throw new Error("Manga verisi bulunamadı");
        }

        // Format the date
        const formattedDate = new Date(mangaData.published_date)
          .toISOString()
          .split("T")[0];
        // Reset form with all data
        form.reset({
          title: mangaData.title,
          authorId: mangaData.author_id.toString(),
          description: mangaData.description,
          status: mangaData.status,
          coverImage: mangaData.cover_image || "",
          publishedDate: formattedDate,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setSubmitError("Veriler yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, form]);

  // Watch form changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (originalData) {
        const formValues = form.getValues();
        const hasFormChanges =
          formValues.title !== originalData.title ||
          formValues.authorId !== originalData.author_id.toString() ||
          formValues.description !== originalData.description ||
          formValues.status !== originalData.status ||
          formValues.coverImage !== originalData.cover_image ||
          formValues.publishedDate !== originalData.published_date;

        setHasChanges(hasFormChanges);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, originalData]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!hasChanges) {
      router.push("/admin/manga");
      return;
    }

    try {
      setSubmitError(null);

      const formData = {
        manga_id: parseInt(params.id, 10),
        title: values.title,
        description: values.description,
        status: values.status,
        cover_image: values.coverImage,
        author_id: parseInt(values.authorId, 10),
        published_date: values.publishedDate,
      };

      console.log("Form submitted with values:", JSON.stringify(formData));

      const response = await fetch(
        `http://localhost:8080/manga/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Unknown error");
      }

      router.push("/admin/manga");
    } catch (error) {
      console.error("Error updating manga:", error);
      setSubmitError("Manga güncellenirken bir hata oluştu.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8 pt-16">
      <Card className="max-w-3xl mx-auto bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
        <CardHeader className="space-y-1 border-b border-gray-100 p-6">
          <CardTitle className="text-2xl font-medium text-gray-900">
            Manga Düzenle
          </CardTitle>
          <p className="text-sm text-gray-500">Manga bilgilerini güncelleyin</p>
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
                      {authors.length > 0 && ( // Sadece yazarlar yüklendiğinde Select'i render et
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400">
                              <SelectValue placeholder="Yazar seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {authors.map((author) => (
                              <SelectItem
                                key={author.author_id}
                                value={author.author_id.toString()}
                              >
                                {author.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
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
                          value={field.value}
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
                        value={field.value}
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

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/manga")}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-md transition-colors duration-200 border border-gray-200"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={!hasChanges}
                  className={`w-full font-medium py-2.5 rounded-md transition-colors duration-200 ${
                    hasChanges
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {hasChanges ? "Güncelle" : "Değişiklik Yok"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditMangaPage;
