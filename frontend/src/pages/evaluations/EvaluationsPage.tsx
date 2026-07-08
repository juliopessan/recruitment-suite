import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchEvaluations } from '@/store/slices/evaluationsSlice'

export default function EvaluationsPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items: evaluations, isLoading } = useAppSelector((state) => state.evaluations)

  useEffect(() => {
    dispatch(fetchEvaluations({}))
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Evaluations</h1>
          <p className="text-gray-600">View all candidate evaluations</p>
        </div>
      </div>

      {isLoading ? (
        <div className="card">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      ) : evaluations.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left table-cell font-semibold">ID</th>
                <th className="text-left table-cell font-semibold">Final Score</th>
                <th className="text-left table-cell font-semibold">Recommendation</th>
                <th className="text-left table-cell font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((evaluation) => (
                <tr key={evaluation.id} className="border-b hover:bg-gray-50">
                  <td className="table-cell font-medium">{evaluation.id}</td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="text-lg font-bold text-gray-900">
                        {evaluation.final_score.toFixed(1)}
                      </div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${evaluation.final_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`badge ${
                        evaluation.recommendation_status === 'GO'
                          ? 'badge-success'
                          : evaluation.recommendation_status === 'HOLD'
                            ? 'badge-warning'
                            : 'badge-danger'
                      }`}
                    >
                      {evaluation.recommendation_status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => navigate(`/evaluations/${evaluation.id}`)}
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
          <p className="text-gray-500">No evaluations yet</p>
        </div>
      )}
    </div>
  )
}
