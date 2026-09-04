import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Page, StaggerItem } from '@/components/motion'
import { PageHeader } from '@/components/studio/PageHeader'
import { logout } from '@/store/slices/authSlice'

export default function SettingsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const sections = [
    {
      title: 'Account',
      items: [
        { label: 'Name', value: user?.name || '—' },
        { label: 'Email', value: user?.email || '—' },
        { label: 'Role', value: user?.role || '—' },
      ],
    },
    {
      title: 'Output',
      items: [
        { label: 'Report languages', value: 'EN-US · PT-BR' },
        { label: 'Report format', value: 'HTML — print to PDF' },
        { label: 'CV formats', value: 'PDF · DOCX · TXT' },
      ],
    },
    {
      title: 'Pipeline',
      items: [
        { label: 'Agents in the chain', value: '05' },
        { label: 'People Analytics variant', value: 'Auto-detected from the role' },
        { label: 'Profile enrichment', value: 'Exa — LinkedIn' },
      ],
    },
  ]

  return (
    <Page className="max-w-3xl">
      <PageHeader
        eyebrow="— / Settings"
        title={['Workspace', { text: 'settings.', italic: true }]}
        subtitle="How this workspace is configured, and how to sign out of it."
      />

      <div className="space-y-8">
        {sections.map((section) => (
          <StaggerItem key={section.title} className="studio-card">
            <div className="px-6 py-4 border-b border-ink/15">
              <p className="eyebrow">{section.title}</p>
            </div>
            <dl>
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="px-6 py-4 border-b border-ink/10 last:border-b-0 flex items-baseline justify-between gap-6"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-label text-ink-400 shrink-0">
                    {item.label}
                  </dt>
                  <dd className="font-medium text-right truncate">{item.value}</dd>
                </div>
              ))}
            </dl>
          </StaggerItem>
        ))}

        <StaggerItem className="border border-rust-500/40 bg-rust-50">
          <div className="px-6 py-4 border-b border-rust-500/25">
            <p className="eyebrow text-rust-600">Session</p>
          </div>
          <div className="p-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-ink-700">
              Signing out clears this browser session. Evaluations stay on the server.
            </p>
            <button onClick={handleLogout} className="btn-danger shrink-0">
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </StaggerItem>
      </div>
    </Page>
  )
}
