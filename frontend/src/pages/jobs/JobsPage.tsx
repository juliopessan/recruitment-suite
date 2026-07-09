import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchJobs } from '@/store/slices/jobsSlice'

export default function JobsPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items: jobs, isLoading } = useAppSelector((state) => state.jobs)

  useEffect(() => {
    dispatch(fetchJobs({}))
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Jobs</h1>
          <p className="text-gray-600">Manage and view all job openings</p>
        </div>
        <button onClick={() => navigate('/jobs/new')} className="btn-primary">
          Add Job
        </button>
      </div>

      {isLoading ? (
        <div className="card">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left table-cell font-semibold">Title</th>
                <th className="text-left table-cell font-semibold">Company</th>
                <th className="text-left table-cell font-semibold">Required Exp</th>
                <th className="text-left table-cell font-semibold">Level</th>
                <th className="text-left table-cell font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="table-cell">{job.title}</td>
                  <td className="table-cell">{job.company}</td>
                  <td className="table-cell">{job.years_experience_required} years</td>
                  <td className="table-cell">{job.seniority_level}</td>
                  <td className="table-cell">
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
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
          <p className="text-gray-500 mb-4">No jobs yet</p>
          <button onClick={() => navigate('/jobs/new')} className="btn-primary">
            Create First Job
          </button>
        </div>
      )}
    </div>
  )
}
