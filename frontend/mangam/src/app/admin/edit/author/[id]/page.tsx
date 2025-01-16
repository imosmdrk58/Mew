'use client'

import { useState,useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

const EditAuthorPage =({ params }: { params: { id: string } }) => {
  params=useParams();
    const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: ''
  })

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authors/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch author')
        const author = await response.json()
        setFormData({
          name: author.name,
          bio: author.bio
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load author data",
          variant: "destructive"
        })
      }
    }
    fetchAuthor()
  }, [params.id])





  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {

        const newData = {
        author_id: parseInt(params.id),
          name: formData.name,
          bio: formData.bio,
        
        }

        console.log('Form submitted with values:', JSON.stringify(newData));
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authors/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        throw new Error('Yazar güncellenirken bir hata oluştu')
      }

      const data = await response.json()
      
      toast({
        title: "Başarılı!",
        description: "Yazar başarıyla güncellendi.",
      })
      
      router.push(`/admin`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Yazar eklenirken bir hata oluştu.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Yeni Yazar Ekle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Yazar Adı
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Yazar adını giriniz"
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Biyografi
              </label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Yazar biyografisini giriniz"
                required
                className="w-full min-h-[150px]"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Güncelleniyor...' : 'Yazarı Güncelle'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};

export default EditAuthorPage;