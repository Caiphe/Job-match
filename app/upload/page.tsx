import CvUpload from '@/components/cv/CvUpload'

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Upload Your CV</h1>
      <p className="mb-8 text-gray-500">
        We&apos;ll extract your skills with Claude AI and find matching jobs from thousands of listings.
      </p>
      <CvUpload />
    </div>
  )
}
