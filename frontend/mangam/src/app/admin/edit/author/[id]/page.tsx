'use client'

import { useParams } from 'next/navigation'
import EditAuthorForm from './components/EditAuthorForm'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const EditAuthorPage = () => {
  const { id } = useParams()
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/admin')
  }

  if (!id || Array.isArray(id)) {
    return <LoadingSpinner />
  }

  return (
    <EditAuthorForm 
      authorId={id} 
      onSuccess={handleSuccess}
      apiBaseUrl="http://localhost:8080" // opsiyonel, varsayılan değeri var
    />
  )
}

export default EditAuthorPage