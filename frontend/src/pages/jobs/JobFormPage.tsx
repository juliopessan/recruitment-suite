import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { Page, StaggerItem } from '@/components/motion'
import { PageHeader } from '@/components/studio/PageHeader'

export default function JobFormPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id

  return (
    <Page className="max-w-2xl">
      <PageHeader
        eyebrow="03 / Open roles"
        title={isEditMode ? ['Edit', { text: 'job.', italic: true }] : ['New', { text: 'job.', italic: true }]}
        subtitle="Roles are usually parsed from a pasted description — this is the manual path."
        action={
          <button onClick={() => navigate('/jobs')} className="btn-secondary">
            <ArrowLeft size={15} />
            Cancel
          </button>
        }
      />

      <StaggerItem className="studio-card">
        <div className="px-6 py-4 border-b border-ink/15">
          <p className="eyebrow">Details</p>
        </div>

        <form className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="field-label">Title</label>
              <input type="text" className="input-field" placeholder="Senior Data Engineer" />
            </div>
            <div>
              <label className="field-label">Company</label>
              <input type="text" className="input-field" placeholder="Company name" />
            </div>
          </div>

          <div>
            <label className="field-label">Location</label>
            <input type="text" className="input-field" placeholder="São Paulo, Brazil" />
          </div>

          <div>
            <label className="field-label">Description</label>
            <textarea
              className="input-field min-h-[140px] font-mono text-[13px] leading-relaxed"
              placeholder="Responsibilities, requirements, team context…"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="field-label">Experience — years</label>
              <input type="number" className="input-field" placeholder="8" />
            </div>
            <div>
              <label className="field-label">Seniority</label>
              <select className="input-field">
                <option>Junior</option>
                <option>Mid</option>
                <option>Senior</option>
                <option>Lead</option>
              </select>
            </div>
            <div>
              <label className="field-label">Urgency</label>
              <select className="input-field">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="field-label">
              Required skills <span className="text-ink-300">— comma-separated</span>
            </label>
            <input type="text" className="input-field" placeholder="Python, Spark, Azure" />
          </div>

          <div>
            <label className="field-label">
              Nice-to-have skills <span className="text-ink-300">— comma-separated</span>
            </label>
            <input type="text" className="input-field" placeholder="Terraform, dbt" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary">
              <Check size={15} />
              {isEditMode ? 'Save changes' : 'Create job'}
            </button>
            <button type="button" onClick={() => navigate('/jobs')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </StaggerItem>
    </Page>
  )
}
