import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchCandidates } from '@/store/slices/candidatesSlice'
import { fetchJobs } from '@/store/slices/jobsSlice'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const candidates = useAppSelector((state) => state.candidates.items)
  const jobs = useAppSelector((state) => state.jobs.items)

  useEffect(() => {
    dispatch(fetchCandidates({ skip: 0, limit: 5 }))
    dispatch(fetchJobs({ skip: 0, limit: 5 }))
  }, [dispatch])

  return (
    <div className="space-y-8">
      <div>
        <h1>Dashboard</h1>
        <p className="text-gray-600">Welcome to the Recruitment Suite</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Candidates</p>
          <p className="text-3xl font-bold text-gray-900">{candidates.length}</p>
        </div>
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Total Jobs</p>
          <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Evaluations</p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500">
          <p className="text-sm text-gray-600">Success Rate</p>
          <p className="text-3xl font-bold text-gray-900">0%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="mb-4">Recent Candidates</h3>
          <div className="space-y-2">
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <div key={candidate.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span className="font-medium">{candidate.name}</span>
                  <span className="text-sm text-gray-500">{candidate.email}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No candidates yet</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4">Recent Jobs</h3>
          <div className="space-y-2">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span className="font-medium">{job.title}</span>
                  <span className="text-sm text-gray-500">{job.company}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No jobs yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
