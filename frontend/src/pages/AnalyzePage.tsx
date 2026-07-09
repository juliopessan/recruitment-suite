import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { FileText, Linkedin, Sparkles, UploadCloud, X } from 'lucide-react'
import { Page, StaggerItem } from '@/components/motion'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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
    <Page className="space-y-6 max-w-3xl">
      <StaggerItem>
        <h1 className="flex items-center gap-2">
          <Sparkles className="text-primary-500" /> Agentic Analysis
        </h1>
        <p className="text-gray-600">
          Upload a CV, add a LinkedIn profile and paste the job description — six agents
          evaluate profile, skills, culture fit and references.
        </p>
      </StaggerItem>

      <form onSubmit={handleSubmit} className="space-y-6">
        <StaggerItem className="card space-y-4">
          <h3>Candidate</h3>

          {/* CV dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
              dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
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
              <div className="flex items-center gap-3 text-gray-800">
                <FileText className="text-primary-500" />
                <span className="font-medium">{cvFile.name}</span>
                <span className="text-sm text-gray-500">({(cvFile.size / 1024).toFixed(0)} KB)</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCvFile(null) }}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <UploadCloud size={32} className="text-gray-400" />
                <p className="font-medium text-gray-700">Drop the CV here or click to upload</p>
                <p className="text-sm text-gray-500">PDF, DOCX, TXT — max 10 MB</p>
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1.5">
              <Linkedin size={16} className="text-[#0a66c2]" /> LinkedIn URL
              <span className="text-gray-400 font-normal">(enriched via Exa)</span>
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
        </StaggerItem>

        <StaggerItem className="card space-y-4">
          <h3>Job Description</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="input-field"
                placeholder="Senior Data Engineer"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company <span className="text-gray-400 font-normal">(optional)</span></label>
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
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="input-field min-h-[180px] font-mono text-sm"
              placeholder="Paste the full job description here — skills, years of experience, seniority and languages are extracted automatically…"
              disabled={isRunning}
            />
          </div>
        </StaggerItem>

        <StaggerItem>
          <motion.button
            type="submit"
            disabled={isRunning}
            whileHover={{ scale: isRunning ? 1 : 1.02 }}
            whileTap={{ scale: isRunning ? 1 : 0.98 }}
            className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block"
                >
                  <Sparkles size={18} />
                </motion.span>
                Agents evaluating…
              </>
            ) : (
              <>
                <Sparkles size={18} /> Run Agentic Analysis
              </>
            )}
          </motion.button>
        </StaggerItem>
      </form>

      <AnimatePresence>
        {notes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card bg-gray-900 text-gray-100 font-mono text-sm overflow-hidden"
          >
            {notes.map((note, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <span className="text-green-400">✓</span> {note}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  )
}
