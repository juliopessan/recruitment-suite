import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { Page, StaggerItem } from '@/components/motion'
import { PageHeader } from '@/components/studio/PageHeader'

const FIELDS: { label: string; type: string; placeholder: string; hint?: string }[] = [
  { label: 'Name', type: 'text', placeholder: 'Full name' },
  { label: 'Email', type: 'email', placeholder: 'email@example.com' },
  { label: 'Phone', type: 'tel', placeholder: '+55 11 90000-0000' },
  { label: 'Location', type: 'text', placeholder: 'City, Country' },
  { label: 'Years of experience', type: 'number', placeholder: '10' },
  { label: 'Languages', type: 'text', placeholder: 'English, Portuguese', hint: 'comma-separated' },
  { label: 'Education', type: 'text', placeholder: "Master's in Computer Science" },
  {
    label: 'Certifications',
    type: 'text',
    placeholder: 'AWS Solutions Architect',
    hint: 'comma-separated',
  },
]

export default function CandidateFormPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id

  return (
    <Page className="max-w-2xl">
      <PageHeader
        eyebrow="02 / Talent pool"
        title={isEditMode ? ['Edit', { text: 'candidate.', italic: true }] : ['New', { text: 'candidate.', italic: true }]}
        subtitle="Most candidates arrive through an analysis — this is the manual path."
        action={
          <button onClick={() => navigate('/candidates')} className="btn-secondary">
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
          {FIELDS.map((field) => (
            <div key={field.label}>
              <label className="field-label">
                {field.label}
                {field.hint && <span className="text-ink-300"> — {field.hint}</span>}
              </label>
              <input type={field.type} className="input-field" placeholder={field.placeholder} />
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary">
              <Check size={15} />
              {isEditMode ? 'Save changes' : 'Create candidate'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/candidates')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </StaggerItem>
    </Page>
  )
}
