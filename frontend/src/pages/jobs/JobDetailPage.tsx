import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { ArrowLeft, Pencil, Play, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchJob } from '@/store/slices/jobsSlice'
import { Page, StaggerItem } from '@/components/motion'
import { PageHeader } from '@/components/studio/PageHeader'
import { EmptyState } from '@/components/studio/EmptyState'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const job = useAppSelector((state) => state.jobs.items.find((j) => j.id === id))

  useEffect(() => {
    if (id) {
      dispatch(fetchJob(id))
    }
  }, [dispatch, id])

  if (!job) {
    return (
      <Page className="max-w-3xl">
        <EmptyState
          message="Job not found"
          action={
            <button onClick={() => navigate('/jobs')} className="btn-primary">
              <ArrowLeft size={16} />
              Back to jobs
            </button>
          }
        />
      </Page>
    )
  }

  const fields: [string, string][] = [
    ['Company', job.company],
    ['Location', job.location || '—'],
    ['Seniority', job.seniority_level],
    ['Required experience', `${job.years_experience_required} years`],
  ]

  return (
    <Page>
      <PageHeader
        eyebrow="03 / Role"
        title={[job.title]}
        subtitle={job.company}
        action={
          <div className="flex gap-3">
            <button onClick={() => navigate(`/jobs/${id}/edit`)} className="btn-secondary">
              <Pencil size={15} />
              Edit
            </button>
            <button onClick={() => navigate('/jobs')} className="btn-secondary">
              <ArrowLeft size={15} />
              Back
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-8">
        <StaggerItem className="studio-card">
          <div className="px-6 py-4 border-b border-ink/15">
            <p className="eyebrow">Requirements</p>
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
                <dd className="font-medium text-right capitalize truncate">{value}</dd>
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
              Evaluate a candidate
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
