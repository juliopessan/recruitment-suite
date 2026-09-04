import { ReactNode } from 'react'
import { motion } from 'framer-motion'

/** Placeholder for lists with nothing in them yet. */
export function EmptyState({
  icon,
  message,
  hint,
  action,
}: {
  icon?: ReactNode
  message: string
  hint?: string
  action?: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="studio-card flex flex-col items-center justify-center text-center py-20 px-6"
    >
      {icon && (
        <div className="w-11 h-11 border border-ink/20 flex items-center justify-center text-ink-400 mb-5">
          {icon}
        </div>
      )}
      <p className="font-mono text-[11px] uppercase tracking-label text-ink-400 mb-2">
        {message}
      </p>
      {hint && <p className="text-ink-500 text-sm mb-6 max-w-sm">{hint}</p>}
      {action && <div className={hint ? '' : 'mt-4'}>{action}</div>}
    </motion.div>
  )
}
