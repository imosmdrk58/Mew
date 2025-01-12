// app/manga/[mangaId]/add-chapter/page.tsx
"use client"

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster';


const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  chapter_number: z.number().min(0, 'Chapter number must be positive'),
  release_date: z.string(),
  pages: z.array(z.object({
    url: z.string().url('Must be a valid URL'),
    page_number: z.number().min(1)
  }))
})

const addPageToChapter = async (chapterId: number, page: {url: string, page_number: number}) => {
        const sentData= {
            "chapter_id": chapterId,
            "page_number": page.page_number,
            "image_url": page.url,
        }
        console.log('Form submitted with values:', JSON.stringify(sentData));
      const response = await fetch(`http://localhost:8080/chapters/${chapterId}/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sentData),
      });
      
      return response;
};


const AddChapterPage= () => {
  const params = useParams()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      chapter_number: 0,
      release_date: new Date().toISOString(),
      pages: []
    }
  })

  const { watch, setValue } = form
  const pages = watch('pages')

  const addPage = () => {
    const newPageNumber = pages.length + 1
    const newPages = [...pages, { url: '', page_number: newPageNumber }]
    setValue('pages', newPages)
  }

  const removePage = (index: number) => {
    const newPages = pages.filter((_, i) => i !== index)
    setValue('pages', newPages)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const sentData = {
            "title": values.title,
            "chapter_number": values.chapter_number,
            "release_date": values.release_date,
            "manga_id": Number(params.mangaId),
        }
        console.log('Form submitted with values:', JSON.stringify(sentData));
    
      const response = await fetch(`http://localhost:8080/manga/${params.mangaId}/chapters/create-chapter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sentData),
      })

      if (!response.ok) {
        console.error('Failed to create chapter')
        throw new Error('Failed to create chapter')
      }
      const result = await response.json()
      const chapterId = result.id
      console.log(values.pages)

      for (const page of values.pages) {

       const pageResponde = await addPageToChapter(chapterId, page)
       if (!pageResponde.ok) {
        console.error('Failed to create pages')
        throw new Error('Failed to create pages')
       }
      }
      toast({
        title: 'Success',
        description: 'Chapter has been created successfully',
      })

       router.push(`/manga/${params.mangaId}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create chapter. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add New Chapter</CardTitle>
          <CardDescription>Create a new chapter for your manga</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chapter Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter chapter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chapter_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chapter Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter chapter number"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="release_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Pages</h3>
                  <Button type="button" onClick={addPage}>
                    Add Page
                  </Button>
                </div>

                {pages.map((page, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <FormItem className="flex-1">
                      <FormLabel>Page {index + 1} URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter page URL"
                          value={page.url}
                          onChange={(e) => {
                            const newPages = [...pages]
                            newPages[index].url = e.target.value
                            newPages[index].page_number = index + 1
                            setValue('pages', (newPages))
                          }}
                        />
                      </FormControl>
                    </FormItem>
                    <Button 
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removePage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button type="submit">Create Chapter</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Toaster />
    </div>
  )
}

export default AddChapterPage;