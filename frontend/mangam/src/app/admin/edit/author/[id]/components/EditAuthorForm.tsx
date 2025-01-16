"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'


interface EditAuthorFormProps {
  authorId: string;
  onSuccess: () => void;
  apiBaseUrl?: string;
}

const EditAuthorForm: React.FC<EditAuthorFormProps> = ({ 
  authorId, 
  onSuccess, 
  apiBaseUrl,
}) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    bio: ''
  })

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/authors/${authorId}`)
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
    
    if (authorId) {
      fetchAuthor()
    }
  }, [authorId, apiBaseUrl, toast])

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
    if (!authorId || Array.isArray(authorId)) {
      return;
    }
    e.preventDefault()
    setIsLoading(true)
    try {
      const newData = {
        author_id: parseInt(authorId),
        name: formData.name,
        bio: formData.bio,
      }

      const response = await fetch(`${apiBaseUrl}/authors/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        throw new Error('Yazar güncellenirken bir hata oluştu')
      }

      await response.json()
      
      toast({
        title: "Başarılı!",
        description: "Yazar başarıyla güncellendi.",
      })
      
      if (onSuccess) {
        onSuccess()
      }
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
                className="w-full min-h-32"
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

export default EditAuthorForm;