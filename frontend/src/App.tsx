import { Provider } from 'react-redux'
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { store } from '@/store'
import { useAppSelector } from '@/hooks/useRedux'
import { tab } from '@/lib/ledger'

// Layouts
import MainLayout from '@/components/layouts/MainLayout'
import AuthLayout from '@/components/layouts/AuthLayout'

// Pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import AnalyzePage from '@/pages/AnalyzePage'
import CandidatesPage from '@/pages/candidates/CandidatesPage'
import CandidateDetailPage from '@/pages/candidates/CandidateDetailPage'
import CandidateFormPage from '@/pages/candidates/CandidateFormPage'
import JobsPage from '@/pages/jobs/JobsPage'
import JobDetailPage from '@/pages/jobs/JobDetailPage'
import JobFormPage from '@/pages/jobs/JobFormPage'
import EvaluationsPage from '@/pages/evaluations/EvaluationsPage'
import EvaluationResultPage from '@/pages/evaluations/EvaluationResultPage'
import SettingsPage from '@/pages/SettingsPage'

/** Tab titles read `Page | Product`, page first so truncated tabs stay
    distinguishable. Set on every route change. */
function routeTitle(pathname: string, signedIn: boolean): string {
  if (pathname === '/') return signedIn ? 'Dashboard' : ''
  if (pathname === '/login') return 'Sign in'
  if (pathname === '/analyze') return 'Analyze'
  if (pathname === '/settings') return 'Settings'
  if (pathname.endsWith('/new')) return pathname.startsWith('/jobs') ? 'New job' : 'New candidate'
  if (pathname.endsWith('/edit')) return pathname.startsWith('/jobs') ? 'Edit job' : 'Edit candidate'
  if (pathname.startsWith('/evaluations/')) return 'Evaluation'
  if (pathname.startsWith('/evaluations')) return 'Evaluations'
  if (pathname.startsWith('/candidates/')) return 'Candidate'
  if (pathname.startsWith('/candidates')) return 'Candidates'
  if (pathname.startsWith('/jobs/')) return 'Job'
  if (pathname.startsWith('/jobs')) return 'Jobs'
  return ''
}

function RouteTitle({ signedIn }: { signedIn: boolean }) {
  const { pathname } = useLocation()
  useEffect(() => {
    tab.set({ title: routeTitle(pathname, signedIn) })
  }, [pathname, signedIn])
  return null
}

function AppContent() {
  const token = useAppSelector((state) => state.auth.token)

  return (
    <>
    <RouteTitle signedIn={!!token} />
    <Routes>
      {!token ? (
        <>
          <Route path="/" element={<LandingPage />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/candidates/new" element={<CandidateFormPage />} />
            <Route path="/candidates/:id" element={<CandidateDetailPage />} />
            <Route path="/candidates/:id/edit" element={<CandidateFormPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/new" element={<JobFormPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/jobs/:id/edit" element={<JobFormPage />} />
            <Route path="/evaluations" element={<EvaluationsPage />} />
            <Route path="/evaluations/:id" element={<EvaluationResultPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
    </>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </Provider>
  )
}
