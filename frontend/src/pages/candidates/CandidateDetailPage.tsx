import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { ArrowLeft, Pencil, Play, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchCandidate } from '@/store/slices/candidatesSlice'
import { Page, StaggerItem } from '@/components/motion'
import { PageHeader } from '@/components/studio/PageHeader'
import { EmptyState } from '@/components/studio/EmptyState'

export default function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const candidate = useAppSelector((state) => state.candidates.items.find((c) => c.id === id))

  useEffect(() => {
    if (id) {
      dispatch(fetchCandidate(id))
    }
  }, [dispatch, id])

  if (!candidate) {
    return (
      <Page className="max-w-3xl">
        <EmptyState
          message="Candidate not found"
          action={
            <button onClick={() => navigate('/candidates')} className="btn-primary">
              <ArrowLeft size={16} />
              Back to candidates
            </button>
          }
        />
      </Page>
    )
  }

  const fields: [string, string][] = [
    ['Email', candidate.email],
    ['Phone', candidate.phone || '—'],
    ['Location', candidate.location || '—'],
    ['Experience', `${candidate.total_years_experience} years`],
  ]

  return (
    <Page>
      <PageHeader
        eyebrow="02 / Candidate"
        title={[candidate.name]}
        subtitle={candidate.email}
        action={
          <div className="flex gap-3">
            <button onClick={() => navigate(`/candidates/${id}/edit`)} className="btn-secondary">
              <Pencil size={15} />
              Edit
            </button>
            <button onClick={() => navigate('/candidates')} className="btn-secondary">
              <ArrowLeft size={15} />
              Back
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-8">
        <StaggerItem className="studio-card">
          <div className="px-6 py-4 border-b border-ink/15">
            <p className="eyebrow">Profile</p>
          </div>
          <dl>
            {fields.map(([label, value]) => (
              <div
                key={label}
                className="px-6 py-4 border-b border-ink/10 last:border-b-0 flex items-baseline justify-between gap-6"
              >
                <dt className="font-mono text-[11px] uppercase tracking-label text-ink-400 shrink-0">
                  {label}
                </dt>
                <dd className="font-medium text-right truncate">{value}</dd>
              </div>
            ))}
          </dl>
        </StaggerItem>

        <StaggerItem className="studio-card">
          <div className="px-6 py-4 border-b border-ink/15">
            <p className="eyebrow">Actions</p>
          </div>
          <div className="p-6 space-y-3">
            <button onClick={() => navigate('/analyze')} className="btn-primary w-full">
              <Play size={15} />
              Run an evaluation
            </button>
            <button onClick={() => navigate('/evaluations')} className="btn-secondary w-full">
              View evaluations
            </button>
            <button className="btn-danger w-full">
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        </StaggerItem>
      </div>
    </Page>
  )
}
