# Phase 3 Implementation Plan: Web UI & Dashboard

## Overview

Build a modern React web UI with candidate/job management, real-time dashboards, and analytics.

**Estimated Duration:** 2-3 weeks  
**Status:** Planning  
**Target:** Production-ready web application

## Architecture

```
recruitment-suite/
├── backend/                 # Python FastAPI (existing)
│   ├── src/api/
│   ├── src/database/
│   └── api.py
│
└── frontend/                # React (NEW)
    ├── public/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Page components
    │   ├── hooks/           # Custom React hooks
    │   ├── services/        # API client
    │   ├── store/           # Redux state management
    │   ├── styles/          # Global styles
    │   ├── types/           # TypeScript types
    │   └── App.tsx          # Root component
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    └── docker/              # Docker configuration
```

## Tech Stack

### Frontend
- **Framework:** React 18.2.0
- **Language:** TypeScript
- **Build Tool:** Vite 5.0.0 (fast, modern)
- **Package Manager:** npm
- **Styling:** TailwindCSS 3.3.0 (utility-first CSS)
- **State Management:** Redux Toolkit 1.9.7
- **HTTP Client:** axios 1.6.2
- **Routing:** React Router v6
- **UI Components:** Headless UI + custom components
- **Forms:** React Hook Form 7.48.0
- **Notifications:** react-toastify 9.1.3
- **Date Handling:** date-fns 2.30.0
- **Charts:** Recharts 2.10.3 (for dashboard)
- **Icons:** Heroicons 2.0.18

### Development
- **Linting:** ESLint
- **Formatting:** Prettier
- **Testing:** Vitest + React Testing Library
- **Type Safety:** TypeScript
- **Dev Server:** Vite (hot reload)

## Phase 3 Scope - Release 1 (MVP)

### Feature 1: Authentication & User Management ✅ Priority: HIGH
- Login/logout
- Protected routes
- Session management
- JWT token handling
- Role-based access (admin, manager, recruiter)

### Feature 2: Candidate Management ✅ Priority: HIGH
- Candidate list with pagination
- Add new candidate form
- View candidate details
- Edit candidate profile
- Delete candidate
- Search & filter by name/email
- Export candidates (CSV)

### Feature 3: Job Management ✅ Priority: HIGH
- Job list with pagination
- Create new job
- View job details
- Edit job
- Delete job
- Search & filter
- Archive jobs

### Feature 4: Evaluation Dashboard ✅ Priority: HIGH
- Run evaluation for candidate/job
- View evaluation results
- Evaluation history per candidate
- Job results analytics
- Recommendation status display (GO/HOLD/NO_GO)
- Score visualization

### Feature 5: Analytics Dashboard ✅ Priority: MEDIUM
- Total candidates count
- Total jobs count
- Evaluations performed
- Success rate (GO recommendations)
- Score distribution chart
- Recommendation breakdown

### Feature 6: Batch Operations ✅ Priority: MEDIUM
- Bulk import candidates (CSV)
- Bulk import jobs
- Batch evaluation
- Bulk export results

## Component Architecture

### Layout Components
```
App/
├── Navbar                   # Top navigation
├── Sidebar                  # Left sidebar menu
└── MainContent              # Page content area
```

### Page Components
```
/candidates
├── CandidatesList           # List view with table
├── CandidateDetail          # Single candidate view
├── CandidateForm            # Add/edit form
└── CandidateBulkImport      # CSV upload

/jobs
├── JobsList                 # List view with table
├── JobDetail                # Single job view
├── JobForm                  # Add/edit form
└── JobArchive               # Archive management

/evaluations
├── EvaluationDashboard      # Main evaluation view
├── RunEvaluation            # Evaluation form
├── EvaluationResult         # Results display
├── EvaluationHistory        # History view
└── JobResults               # Job-specific results

/dashboard
├── AnalyticsDashboard       # Analytics overview
├── ScoreChart               # Score distribution
├── RecommendationChart      # GO/HOLD/NO_GO breakdown
├── MetricsCards             # KPI cards
└── RecentEvaluations        # Recent activity
```

### Shared Components
```
common/
├── Button                   # Button variants
├── Card                     # Card container
├── Modal                    # Modal dialog
├── Table                    # Data table
├── Pagination               # Pagination controls
├── SearchBar                # Search input
├── FilterBar                # Filter controls
├── LoadingSpinner           # Loading indicator
├── EmptyState               # Empty state display
├── ErrorBoundary            # Error handling
└── Toast                    # Toast notifications
```

## API Integration

### Services Layer
```typescript
// services/api.ts
- CandidateService
  - list()
  - get(id)
  - create(data)
  - update(id, data)
  - delete(id)
  
- JobService
  - list()
  - get(id)
  - create(data)
  - update(id, data)
  - delete(id)
  
- EvaluationService
  - run(candidateId, jobId, playbook)
  - get(id)
  - list(filters)
  - getCandidateHistory(candidateId)
  - getJobResults(jobId)
```

## State Management (Redux)

```typescript
// store/
├── candidatesSlice.ts       # Candidates state
├── jobsSlice.ts             # Jobs state
├── evaluationsSlice.ts      # Evaluations state
├── authSlice.ts             # Authentication state
├── uiSlice.ts               # UI state (modals, toasts)
└── store.ts                 # Redux store configuration
```

## Routes

```
/                           Home/Dashboard
/login                      Login page
/candidates                 Candidates list
/candidates/new             Create candidate
/candidates/:id             View candidate
/candidates/:id/edit        Edit candidate
/jobs                       Jobs list
/jobs/new                   Create job
/jobs/:id                   View job
/jobs/:id/edit              Edit job
/evaluations                Evaluations list
/evaluations/:id            View evaluation
/dashboard                  Analytics dashboard
/settings                   User settings
/profile                    User profile
```

## Styling Strategy

### TailwindCSS
- Utility-first approach
- Custom component classes
- Responsive design (mobile-first)
- Dark mode support
- Consistent spacing/colors

### Design System
- Avanade brand colors (orange #FF5800 to magenta)
- Typography hierarchy
- Component library
- Icon system (Heroicons)

## Form Validation

### Candidate Form
- Name (required, min 2 chars)
- Email (required, valid email)
- Phone (optional, valid format)
- Location (optional)
- Years of experience (required, number)
- Languages (array)
- Education (array)
- Certifications (array)

### Job Form
- Title (required)
- Company (required)
- Location (optional)
- Description (required)
- Required skills (array)
- Nice-to-have skills (array)
- Years required (number)
- Seniority level (dropdown)
- Hiring urgency (dropdown)

## Authentication Flow

```
1. User visits app
   ↓
2. Check localStorage for JWT token
   ↓
3. If token exists:
   - Validate token with backend
   - If valid: Load user profile → Redirect to dashboard
   - If invalid: Clear token → Redirect to login
   ↓
4. User logs in:
   - Submit email/password
   - Backend returns JWT token
   - Store token in localStorage
   - Redirect to dashboard
   ↓
5. All API requests include JWT in Authorization header
```

## Performance Optimization

### Code Splitting
- Route-based code splitting
- Lazy load dashboard components
- Bundle optimization with Vite

### Caching
- React Query for server state
- localStorage for user preferences
- Memoization of expensive components

### Pagination
- Default 10-20 items per page
- Lazy load on scroll
- Cache previous pages

## Testing Strategy

### Unit Tests
- Component rendering
- State management
- API client functions
- Form validation

### Integration Tests
- Login flow
- CRUD operations
- Evaluation workflow
- Navigation

### E2E Tests (Future)
- Complete user workflows
- Cross-browser testing
- Performance testing

## Accessibility (a11y)

- ARIA labels on interactive elements
- Keyboard navigation
- Screen reader support
- Sufficient color contrast
- Focus indicators

## Security Considerations

### Frontend
- XSS protection (React's built-in escaping)
- CSRF tokens if needed
- Secure token storage
- Input validation
- Output encoding

### Backend Integration
- JWT authentication
- HTTPS/TLS
- CORS configuration
- Rate limiting
- Input validation

## Deployment

### Development
```bash
npm run dev              # Vite dev server
npm run build           # Production build
npm run preview         # Preview build
```

### Production
- Build: `npm run build` → `/dist`
- Serve: static hosting or Node.js proxy
- Environment variables: `.env.production`
- Docker container option
- CDN for static assets

## Development Workflow

```
1. Setup project
   npm install
   cp .env.example .env
   npm run dev

2. Create feature branch
   git checkout -b feature/candidate-management

3. Develop component
   - Create component file
   - Add TypeScript types
   - Write tests
   - Add styles with TailwindCSS

4. Test locally
   npm run test
   Manual testing in browser

5. Commit & push
   git add .
   git commit -m "feat: add candidate list"
   git push origin feature/candidate-management

6. Create PR
   Review & merge to main
```

## Milestone Breakdown

### Week 1: Setup & Authentication
- [ ] Project setup (Vite + React + TypeScript)
- [ ] TailwindCSS configuration
- [ ] Redux store setup
- [ ] API client layer
- [ ] Login/logout flow
- [ ] Protected routes

### Week 2: Core Features
- [ ] Candidate management (CRUD)
- [ ] Job management (CRUD)
- [ ] Search & filter
- [ ] Pagination
- [ ] Forms & validation

### Week 3: Evaluations & Analytics
- [ ] Run evaluation
- [ ] View results
- [ ] Evaluation history
- [ ] Analytics dashboard
- [ ] Charts & visualizations

### Post-MVP Enhancements
- [ ] Bulk operations (import/export)
- [ ] Real-time updates (WebSocket)
- [ ] Email notifications
- [ ] User roles & permissions
- [ ] Advanced analytics
- [ ] Mobile responsive

## Success Criteria

✅ Setup and build complete  
✅ Authentication working  
✅ Candidate management functional  
✅ Job management functional  
✅ Evaluation execution working  
✅ Dashboard displaying data  
✅ Tests passing (>80% coverage)  
✅ Mobile responsive  
✅ Performance <3s load time  
✅ Accessibility audit passing  

## Known Constraints

- Backend already has all required APIs
- No external services needed (self-contained)
- Single-page application (SPA)
- Browser support: Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile: Responsive web, not native apps

## Next Steps

1. Create React project with Vite
2. Setup TailwindCSS and project structure
3. Create API client service layer
4. Implement Redux store
5. Build authentication flow
6. Create candidate management UI
7. Create job management UI
8. Build evaluation dashboard
9. Add analytics
10. Testing and deployment

---

**Phase 3 Status:** Planning ✅  
**Start Date:** Next session  
**Estimated Duration:** 2-3 weeks  
**Complexity:** Medium (React + TypeScript + API integration)
