"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { release } from "os";

const formSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  authorId: z.string().min(1, "Yazar zorunludur"),
  description: z.string().min(1, "Açıklama zorunludur"),
  status: z.string().min(1, "Durum zorunludur"),
  coverImage: z.string().optional(),
  publishedDate: z.string().min(1, "Yayın tarihi zorunludur"),
});



const EditMangaPage = () => {
  const {id} = useParams();
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<Manga | null>(null);
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
    let mangaData: Manga | null = null;
    let authorsData: Author[] = [];

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch manga and authors in parallel
        const [mangaResponse, authorsResponse,chaptersResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/manga/${id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/authors`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/manga/${id}/chapters`)
        ]);

        if (!mangaResponse.ok || !authorsResponse.ok) {
          throw new Error("Veri yüklenirken hata oluştu");
        }

        // Get both responses
        const mangaResult = await mangaResponse.json();
        const authorsResult = await authorsResponse.json();
        const chaptersData = await chaptersResponse.json();

        // Process authors data
        authorsData = authorsResult.map((author: any) => ({
          author_id: author.author_id,
          name: author.name,
          bio: author.bio,
        }));

        if (mangaResult) {
          mangaData = {
            manga_id: mangaResult.manga_id,
            title: mangaResult.title,
            genre: "",
            description: mangaResult.description,
            cover_image: mangaResult.cover_image,
            status: mangaResult.status,
            published_date: mangaResult.published_date,
            last_updated: mangaResult.last_updated,
            genres: [],
            chapters: [],
            author: { author_id: mangaResult.author_id, name: "", bio: "" },
          }
          const author = authorsData.find((author) => author.author_id === mangaResult?.author_id);
          if (author) {
            mangaData.author = {
              author_id: author.author_id,
              name: author.name,
              bio: author.bio,
            };
          }
        }
        
        if (!mangaData) {
          throw new Error("Manga verisi bulunamadı");
        }

        // Set states
        setOriginalData(mangaData);
        setAuthors(authorsData);
        const sentChapters = chaptersData.map((chapter: any) => ({
          chapter_id: chapter.id,
          manga_id: chapter.manga_id,
          chapter_number: chapter.chapter_number,
          title: chapter.title,
          release_date: chapter.release_date,
        }));
        setChapters(sentChapters);

        // Format the date
        const formattedDate = new Date(mangaData.published_date)
          .toISOString()
          .split("T")[0];
        // Reset form with all data
        form.reset({
          title: mangaData.title,
          authorId: mangaData.author.author_id.toString(),
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
  }, [id, form]);

  // Watch form changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (originalData) {
        const formValues = form.getValues();
        const hasFormChanges =
          formValues.title !== originalData.title ||
          formValues.authorId !== originalData.author.author_id.toString() ||
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
      router.push("/admin");
      return;
    }

    try {
      setSubmitError(null);
      if (id == undefined || Array.isArray(id)) {
        return;
      }
      const formData = {
        manga_id: parseInt(id, 10),
        title: values.title,
        description: values.description,
        status: values.status,
        cover_image: values.coverImage,
        author_id: parseInt(values.authorId, 10),
        published_date: values.publishedDate,
      };

      console.log("Form submitted with values:", JSON.stringify(formData));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/manga/${id}`,
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

      router.push("/admin");
    } catch (error) {
      console.error("Error updating manga:", error);
      setSubmitError("Manga güncellenirken bir hata oluştu.");
    }
  }

  const handleEditChapter = (chapterId: number) => {
    router.push(`/admin/edit/manga/${id}/chapter/${chapterId}`);
  };

  const handleDeleteChapter = async (chapterId: number) => {
    if (!confirm("Bu bölümü silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chapters/${chapterId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Bölüm silinirken bir hata oluştu");
      }

      setChapters(chapters.filter(chapter => chapter.chapter_id !== chapterId));
    } catch (error) {
      console.error("Error deleting chapter:", error);
      setSubmitError("Bölüm silinirken bir hata oluştu.");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8 pt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Manga Edit Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
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

        {/* Chapters List */}
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <CardHeader className="space-y-1 border-b border-gray-100 p-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-medium text-gray-900">
                  Bölümler
                </CardTitle>
                <Button
                  onClick={() => router.push(`/admin/add/manga/${id}/`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  size="sm"
                > 
                  Yeni Bölüm
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {chapters.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Bölüm</TableHead>
                        <TableHead>Başlık</TableHead>
                        <TableHead className="w-24">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chapters.map((chapter) => (
                        <TableRow key={chapter.chapter_number}>
                          <TableCell className="font-medium">{chapter.chapter_number}</TableCell>
                          <TableCell>{chapter.title}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditChapter(chapter.chapter_number)}
                                className="h-8 w-8 text-blue-500 hover:text-blue-600"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteChapter(chapter.chapter_id)}
                                className="h-8 w-8 text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  Henüz bölüm eklenmemiş
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditMangaPage;
