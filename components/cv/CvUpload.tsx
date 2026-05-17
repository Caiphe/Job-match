'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

type Step = 'idle' | 'uploading' | 'analysing' | 'searching' | 'done' | 'error'

const stepLabel: Record<Step, string> = {
  idle: '',
  uploading: 'Extracting text from your CV...',
  analysing: 'Claude is analysing your skills...',
  searching: 'Searching and matching jobs...',
  done: 'Done!',
  error: '',
}

export default function CvUpload() {
  const [step, setStep] = useState<Step>('idle')
  const [error, setError] = useState('')
  const [location, setLocation] = useState('')
  const [keywords, setKeywords] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  const handleFile = useCallback((f: File) => {
    if (f.type !== 'application/pdf') {
      setError('Please upload a PDF file.')
      return
    }
    setError('')
    setFile(f)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const f = e.dataTransfer.files[0]
      if (f) handleFile(f)
    },
    [handleFile],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !location.trim() || !keywords.trim()) {
      setError('Please fill in all fields and select a PDF.')
      return
    }

    setError('')

    try {
      setStep('uploading')
      const form = new FormData()
      form.append('file', file)
      const uploadRes = await fetch('/api/upload-cv', { method: 'POST', body: form })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error)
      const { resumeId } = uploadData

      setStep('analysing')
      const analyseRes = await fetch('/api/analyse-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId }),
      })
      const analyseData = await analyseRes.json()
      if (!analyseRes.ok) throw new Error(analyseData.error)
      const profile: SkillProfile = analyseData.skillProfile

      setStep('searching')
      const kwList = keywords.split(',').map((k) => k.trim()).filter(Boolean)
      const searchRes = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId, location, keywords: kwList }),
      })
      const searchData = await searchRes.json()
      if (!searchRes.ok) throw new Error(searchData.error)
      const { jobSearchId, jobs } = searchData

      const matchRes = await fetch('/api/match-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobSearchId, profile, jobs }),
      })
      const matchData = await matchRes.json()
      if (!matchRes.ok) throw new Error(matchData.error)

      setStep('done')
      router.push(`/results?jobSearchId=${jobSearchId}`)
    } catch (err) {
      setStep('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const busy = step !== 'idle' && step !== 'error' && step !== 'done'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
        }`}
        onClick={() => document.getElementById('cv-file-input')?.click()}
      >
        <input
          id="cv-file-input"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
        <svg className="mb-3 h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {file ? (
          <p className="text-sm font-medium text-blue-600">{file.name}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-700">Drop your CV here or click to browse</p>
            <p className="mt-1 text-xs text-gray-500">PDF only, max 5MB</p>
          </>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            placeholder="e.g. New York, NY"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Keywords</label>
          <input
            type="text"
            placeholder="e.g. React, TypeScript, Node"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">Comma-separated</p>
        </div>
      </div>

      {busy && (
        <div className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {stepLabel[step]}
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <Button type="submit" loading={busy} size="lg" className="w-full">
        {busy ? 'Working...' : 'Find Matching Jobs'}
      </Button>
    </form>
  )
}
