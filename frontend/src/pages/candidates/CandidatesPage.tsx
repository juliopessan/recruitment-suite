import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchCandidates } from '@/store/slices/candidatesSlice'

export default function CandidatesPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items: candidates, isLoading } = useAppSelector((state) => state.candidates)

  useEffect(() => {
    dispatch(fetchCandidates())
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Candidates</h1>
          <p className="text-gray-600">Manage and view all candidates</p>
        </div>
        <button
          onClick={() => navigate('/candidates/new')}
          className="btn-primary"
        >
          Add Candidate
        </button>
      </div>

      {isLoading ? (
        <div className="card">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      ) : candidates.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left table-cell font-semibold">Name</th>
                <th className="text-left table-cell font-semibold">Email</th>
                <th className="text-left table-cell font-semibold">Experience</th>
                <th className="text-left table-cell font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="border-b hover:bg-gray-50">
                  <td className="table-cell">{candidate.name}</td>
                  <td className="table-cell">{candidate.email}</td>
                  <td className="table-cell">{candidate.total_years_experience} years</td>
                  <td className="table-cell">
                    <button
                      onClick={() => navigate(`/candidates/${candidate.id}`)}
                      className="text-primary-500 hover:text-primary-700 font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card text-center">
          <p className="text-gray-500 mb-4">No candidates yet</p>
          <button
            onClick={() => navigate('/candidates/new')}
            className="btn-primary"
          >
            Create First Candidate
          </button>
        </div>
      )}
    </div>
  )
}
