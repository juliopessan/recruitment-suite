import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { ArrowRight, FileText, Linkedin, UploadCloud, X } from 'lucide-react'
import { Page, StaggerItem } from '@/components/motion'
import { PageHeader } from '@/components/studio/PageHeader'

const API_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:8000')

interface AnalysisResponse {
  evaluation_id: string
  candidate_name: string
  final_score: number
  recommendation_status: string
  use_people_analytics: boolean
  detected_skills: string[]
  pipeline_notes: string[]
}

export default function AnalyzePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [language, setLanguage] = useState<'en-US' | 'pt-BR'>('en-US')
  const [isRunning, setIsRunning] = useState(false)
  const [notes, setNotes] = useState<string[]>([])
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) setCvFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (jobDescription.trim().length < 30) {
      toast.error('Paste the job description (at least a few lines)')
      return
    }
    if (!cvFile && !linkedinUrl) {
      toast.error('Upload a CV and/or provide a LinkedIn URL')
      return
    }

    setIsRunning(true)
    setNotes(['Starting agent pipeline…'])
    try {
      const form = new FormData()
      form.append('job_description', jobDescription)
      form.append('job_title', jobTitle)
      form.append('company', company)
      form.append('linkedin_url', linkedinUrl)
      form.append('language', language)
      if (cvFile) form.append('cv_file', cvFile)

      const res = await fetch(`${API_URL}/api/analyze/run`, { method: 'POST', body: form })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Analysis failed (${res.status})`)
      }
      const data: AnalysisResponse = await res.json()
      setNotes(data.pipeline_notes)
      toast.success(
        `${data.candidate_name}: ${data.final_score}/100 — ${data.recommendation_status}`
      )
      setTimeout(() => navigate(`/evaluations/${data.evaluation_id}`), 900)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Analysis failed')
      setNotes([])
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Page className="max-w-3xl">
      <PageHeader
        eyebrow="01 / Run the pipeline"
        title={['Agentic', { text: 'analysis.', italic: true }]}
        subtitle="A CV, a LinkedIn profile and a job description. Five agents score profile fit, technical depth, culture signals and how verifiable the record is."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Candidate */}
        <StaggerItem className="studio-card">
          <div className="px-6 py-4 border-b border-ink/15 flex items-center justify-between">
            <p className="eyebrow">Candidate</p>
            <span className="font-mono text-[11px] uppercase tracking-label text-ink-300">
              CV and / or LinkedIn
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* CV dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-2.5 border border-dashed p-10 cursor-pointer transition-colors ${
                dragOver
                  ? 'border-rust-500 bg-rust-50'
                  : 'border-ink/25 hover:border-ink hover:bg-ink/[0.02]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.md"
                className="hidden"
                onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
              />
              {cvFile ? (
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-rust-500 shrink-0" />
                  <span className="font-semibold text-sm truncate">{cvFile.name}</span>
                  <span className="font-mono text-[11px] text-ink-400 shrink-0">
                    {(cvFile.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCvFile(null)
                    }}
                    className="p-1 text-ink-400 hover:text-rust-600 transition-colors"
                    title="Remove"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud size={26} className="text-ink-300" />
                  <p className="font-semibold text-sm">Drop the CV here, or click to upload</p>
                  <p className="font-mono text-[11px] uppercase tracking-label text-ink-400">
                    PDF · DOCX · TXT — max 10 MB
                  </p>
                </>
              )}
            </div>

            <div>
              <label className="field-label flex items-center gap-2">
                <Linkedin size={13} />
                LinkedIn URL
                <span className="text-ink-300">— enriched via Exa</span>
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="input-field"
                placeholder="https://linkedin.com/in/candidate"
                disabled={isRunning}
              />
            </div>
          </div>
        </StaggerItem>

        {/* Job */}
        <StaggerItem className="studio-card">
          <div className="px-6 py-4 border-b border-ink/15 flex items-center justify-between">
            <p className="eyebrow">Job description</p>
            <span className="font-mono text-[11px] uppercase tracking-label text-ink-300">
              Parsed automatically
            </span>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="field-label">
                  Title <span className="text-ink-300">— optional</span>
                </label>
                <input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="input-field"
                  placeholder="Senior Data Engineer"
                  disabled={isRunning}
                />
              </div>
              <div>
                <label className="field-label">
                  Company <span className="text-ink-300">— optional</span>
                </label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="input-field"
                  placeholder="Avanade"
                  disabled={isRunning}
                />
              </div>
            </div>

            <div>
              <label className="field-label">Description — required</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="input-field min-h-[200px] font-mono text-[13px] leading-relaxed"
                placeholder="Paste the full job description. Skills, years of experience, seniority and languages are extracted automatically…"
                disabled={isRunning}
              />
            </div>

            <div>
              <label className="field-label">
                Output language <span className="text-ink-300">— report &amp; recommendation</span>
              </label>
              <div className="inline-flex border border-ink/20">
                {(['en-US', 'pt-BR'] as const).map((lang, i) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    disabled={isRunning}
                    className={`px-5 py-2.5 font-mono text-[11px] uppercase tracking-label transition-colors ${
                      i === 1 ? 'border-l border-ink/20' : ''
                    } ${
                      language === lang
                        ? 'bg-ink text-paper'
                        : 'text-ink-500 hover:bg-ink/[0.04]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <button type="submit" disabled={isRunning} className="btn-studio-primary w-full">
            {isRunning ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  className="inline-block w-3 h-3 border-2 border-paper/30 border-t-paper rounded-full"
                />
                Agents evaluating…
              </>
            ) : (
              <>
                Run the chain
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </StaggerItem>
      </form>

      {/* Pipeline console */}
      <AnimatePresence>
        {notes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-6"
          >
            <div className="panel p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-mint-500"
                  animate={{ opacity: [1, 0.25, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <span className="panel-label">Pipeline trace</span>
              </div>
              <div className="space-y-1.5">
                {notes.map((note, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className="font-mono text-[13px] text-white/75 flex gap-3"
                  >
                    <span className="text-mint-500 shrink-0">✓</span>
                    <span>{note}</span>
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  )
}
