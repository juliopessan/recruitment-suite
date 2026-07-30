import { ReactNode } from 'react'
import { motion } from 'framer-motion'

/** Placeholder card for lists with nothing in them yet. */
export function EmptyState({
  icon,
  message,
  action,
}: {
  icon?: ReactNode
  message: string
  action?: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="studio-card flex flex-col items-center justify-center text-center py-16 px-6"
    >
      {icon && (
        <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
          {icon}
        </div>
      )}
      <p className="text-ink-500 mb-6">{message}</p>
      {action}
    </motion.div>
  )
}
