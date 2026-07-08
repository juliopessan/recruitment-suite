import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchJob } from '@/store/slices/jobsSlice'

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
      <div className="card text-center">
        <p className="text-gray-500">Job not found</p>
        <button onClick={() => navigate('/jobs')} className="btn-primary mt-4">
          Back to Jobs
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>{job.title}</h1>
          <p className="text-gray-600">{job.company}</p>
        </div>
        <div className="space-x-2">
          <button onClick={() => navigate(`/jobs/${id}/edit`)} className="btn-primary">
            Edit
          </button>
          <button onClick={() => navigate('/jobs')} className="btn-secondary">
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="mb-4">Job Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Company</p>
              <p className="font-medium">{job.company}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium">{job.location || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Seniority Level</p>
              <p className="font-medium">{job.seniority_level}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Required Experience</p>
              <p className="font-medium">{job.years_experience_required} years</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4">Actions</h3>
          <button className="btn-primary w-full mb-2">
            Evaluate Candidate
          </button>
          <button className="btn-secondary w-full mb-2">
            View Evaluations
          </button>
          <button className="btn-danger w-full">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
