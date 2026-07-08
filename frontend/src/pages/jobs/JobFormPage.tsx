import { useParams, useNavigate } from 'react-router-dom'

export default function JobFormPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>{isEditMode ? 'Edit Job' : 'Add New Job'}</h1>
        <button onClick={() => navigate('/jobs')} className="btn-secondary">
          Cancel
        </button>
      </div>

      <div className="card">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input type="text" className="input-field" placeholder="Senior Engineer" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input type="text" className="input-field" placeholder="Company Name" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input type="text" className="input-field" placeholder="San Francisco, USA" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea className="input-field h-24" placeholder="Job description..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Required Experience (years)</label>
              <input type="number" className="input-field" placeholder="10" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Seniority Level</label>
              <select className="input-field">
                <option>Junior</option>
                <option>Mid</option>
                <option>Senior</option>
                <option>Lead</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hiring Urgency</label>
              <select className="input-field">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Required Skills</label>
            <input
              type="text"
              className="input-field"
              placeholder="Python, Go, Kubernetes (comma-separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nice-to-have Skills</label>
            <input
              type="text"
              className="input-field"
              placeholder="Rust, GraphQL (comma-separated)"
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary">
              {isEditMode ? 'Update' : 'Create'} Job
            </button>
            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
