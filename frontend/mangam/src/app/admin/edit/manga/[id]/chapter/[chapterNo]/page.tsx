"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  chapter_number: z.number().min(0, "Chapter number must be positive"),
  release_date: z.string(),
  pages: z
    .array(
      z.object({
        url: z.string().url("Must be a valid URL"),
        page_number: z.number().min(1),
      })
    )
    .min(1, "At least one page is required"),
});

const updatePageInChapter = async (
  chapterId: number,
  page: { url: string; page_number: number }
) => {
  const sentData = {
    chapter_id: chapterId,
    page_number: page.page_number,
    image_url: page.url,
  };
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pages/update`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sentData),
    }
  );

  return response;
};

const EditChapterPage = () => {
  const {id,chapterNo} = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [chapterId, setChapterId] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      chapter_number: 0,
      release_date: new Date().toISOString(),
      pages: [],
    },
  });

  const { watch, setValue } = form;
  const pages = watch("pages");

  // Fetch chapter data
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/manga/${id}/chapters/${chapterNo}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch chapter");
        }
        const chapter = await response.json();
        // Format the date to YYYY-MM-DD for input[type="date"]
        const formattedDate = new Date(chapter.release_date)
          .toISOString()
          .split("T")[0];

        // Transform pages data to match form schema
        const formattedPages = chapter.pages.map((page: any) => ({
          url: page.image_url,
          page_number: page.page_number,
        }));

        // Set form values
        form.reset({
          title: chapter.title,
          chapter_number: chapter.chapter_number,
          release_date: formattedDate,
          pages: formattedPages,
        });
        
        setChapterId(chapter.id);
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch chapter data",
          variant: "destructive",
        });
        router.push(`/admin/edit/manga/${id}`);
      }
    };

    fetchChapter();
  }, [id,chapterNo]);

  const addPage = () => {
    const newPageNumber = pages.length + 1;
    const newPages = [...pages, { url: "", page_number: newPageNumber }];
    setValue("pages", newPages);
  };

  const removePage = (index: number) => {
    const newPages = pages.filter((_, i) => i !== index);
    // Update page numbers after removal
    const updatedPages = newPages.map((page, idx) => ({
      ...page,
      page_number: idx + 1,
    }));
    setValue("pages", updatedPages);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (values.pages.length === 0 || values.pages.every((page) => !page.url)) {
        toast({
          title: "Error",
          description: "Please add at least one page with a valid URL",
          variant: "destructive",
        });
        return;
      }

      const sentData = {
        id: chapterId,
        title: values.title,
        chapter_number: values.chapter_number,
        release_date: values.release_date,
        manga_id: Number(id),
      };
      
      console.log(sentData);
      // Update chapter details
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/manga/${id}/chapters/${chapterNo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sentData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update chapter");
      }

      // Update pages
      for (const page of values.pages) {
        const pageResponse = await updatePageInChapter(Number(chapterId), page);
        if (!pageResponse.ok) {
          throw new Error("Failed to update pages");
        }
      }

      toast({
        title: "Success",
        description: "Chapter has been updated successfully",
      });

      router.push(`/admin/edit/manga/${id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update chapter. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="space-y-2 border-b border-gray-100 pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Edit Chapter
          </CardTitle>
          <CardDescription className="text-gray-500">
            Update chapter details and pages
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Chapter Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter chapter title"
                          className="rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chapter_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Chapter Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter chapter number"
                          className="rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="release_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Release Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <h3 className="text-lg font-medium text-gray-900">Pages</h3>
                  <Button
                    type="button"
                    onClick={addPage}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 text-sm transition-colors"
                  >
                    Add New Page
                  </Button>
                </div>

                <div className="space-y-4">
                  {pages.map((page, index) => (
                    <div
                      key={index}
                      className="flex gap-4 items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Page {index + 1} URL
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter page URL"
                              className="rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                              value={page.url}
                              onChange={(e) => {
                                const newPages = [...pages];
                                newPages[index].url = e.target.value;
                                newPages[index].page_number = index + 1;
                                setValue("pages", newPages);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="hover:bg-red-600 transition-colors mt-6"
                        onClick={() => removePage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
                  disabled={pages.length === 0 || pages.every((page) => !page.url)}
                >
                  Update Chapter
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Toaster />
    </div>
  );
};

export default EditChapterPage;