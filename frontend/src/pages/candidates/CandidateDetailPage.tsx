import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchCandidate } from '@/store/slices/candidatesSlice'

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
      <div className="card text-center">
        <p className="text-gray-500">Candidate not found</p>
        <button onClick={() => navigate('/candidates')} className="btn-primary mt-4">
          Back to Candidates
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>{candidate.name}</h1>
          <p className="text-gray-600">{candidate.email}</p>
        </div>
        <div className="space-x-2">
          <button onClick={() => navigate(`/candidates/${id}/edit`)} className="btn-primary">
            Edit
          </button>
          <button onClick={() => navigate('/candidates')} className="btn-secondary">
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="mb-4">Profile Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{candidate.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{candidate.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium">{candidate.location || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Years of Experience</p>
              <p className="font-medium">{candidate.total_years_experience} years</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4">Actions</h3>
          <button className="btn-primary w-full mb-2">
            Run Evaluation
          </button>
          <button className="btn-secondary w-full mb-2">
            View History
          </button>
          <button className="btn-danger w-full">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
