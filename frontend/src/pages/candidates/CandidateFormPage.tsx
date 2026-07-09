import { useParams, useNavigate } from 'react-router-dom'

export default function CandidateFormPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const isEditMode = !!id

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>{isEditMode ? 'Edit Candidate' : 'Add New Candidate'}</h1>
        <button onClick={() => navigate('/candidates')} className="btn-secondary">
          Cancel
        </button>
      </div>

      <div className="card">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input type="text" className="input-field" placeholder="Full name" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" className="input-field" placeholder="email@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input type="tel" className="input-field" placeholder="+1 (555) 000-0000" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input type="text" className="input-field" placeholder="City, Country" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Years of Experience</label>
            <input type="number" className="input-field" placeholder="10" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Languages</label>
            <input type="text" className="input-field" placeholder="English, Spanish" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Education</label>
            <input type="text" className="input-field" placeholder="Master's in CS" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Certifications</label>
            <input type="text" className="input-field" placeholder="AWS Solution Architect" />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary">
              {isEditMode ? 'Update' : 'Create'} Candidate
            </button>
            <button
              type="button"
              onClick={() => navigate('/candidates')}
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
