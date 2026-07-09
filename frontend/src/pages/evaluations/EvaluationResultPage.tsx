import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchEvaluation } from '@/store/slices/evaluationsSlice'

export default function EvaluationResultPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const evaluation = useAppSelector((state) => state.evaluations.currentEvaluation)

  useEffect(() => {
    if (id) {
      dispatch(fetchEvaluation(id))
    }
  }, [dispatch, id])

  if (!evaluation) {
    return (
      <div className="card text-center">
        <p className="text-gray-500">Evaluation not found</p>
        <button onClick={() => navigate('/evaluations')} className="btn-primary mt-4">
          Back to Evaluations
        </button>
      </div>
    )
  }

  const getRecommendationColor = (status: string) => {
    switch (status) {
      case 'GO':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'HOLD':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'NO_GO':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>Evaluation Result</h1>
        <button onClick={() => navigate('/evaluations')} className="btn-secondary">
          Back
        </button>
      </div>

      <div className={`card border-l-4 border-primary-500 ${getRecommendationColor(evaluation.recommendation_status)}`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold">{evaluation.final_score.toFixed(1)}</h2>
            <p className="text-sm">Overall Score</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{evaluation.recommendation_status}</p>
            <p className="text-sm">Recommendation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-gray-600">Profile Score</p>
          <p className="text-2xl font-bold">{evaluation.profile_score.toFixed(1)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Technical Score</p>
          <p className="text-2xl font-bold">{evaluation.technical_score.toFixed(1)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Culture Score</p>
          <p className="text-2xl font-bold">{evaluation.culture_score.toFixed(1)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Reference Score</p>
          <p className="text-2xl font-bold">{evaluation.reference_score.toFixed(1)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Confidence</p>
          <p className="text-2xl font-bold">{evaluation.confidence}%</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Strategic Bonus</p>
          <p className="text-2xl font-bold">+{evaluation.strategic_bonus.toFixed(1)}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4">Rationale</h3>
        <p className="text-gray-700">{evaluation.rationale}</p>
      </div>

      {evaluation.strengths.length > 0 && (
        <div className="card">
          <h3 className="mb-4">Strengths</h3>
          <ul className="space-y-2">
            {evaluation.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {evaluation.gaps.length > 0 && (
        <div className="card">
          <h3 className="mb-4">Addressable Gaps</h3>
          <ul className="space-y-2">
            {evaluation.gaps.map((gap, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-yellow-600 mr-2">⚠</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {evaluation.critical_flags.length > 0 && (
        <div className="card bg-red-50 border-l-4 border-red-500">
          <h3 className="mb-4 text-red-900">Critical Flags</h3>
          <ul className="space-y-2">
            {evaluation.critical_flags.map((flag, idx) => (
              <li key={idx} className="flex items-start text-red-800">
                <span className="mr-2">⚡</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
