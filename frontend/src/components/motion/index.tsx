import { useEffect, ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  Variants,
} from 'framer-motion'

/* Shared variants ---------------------------------------------------- */

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.06 },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export const itemVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

/* Page wrapper: fade+slide in, staggers its StaggerItem children ------ */

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit" className={className}>
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}

/* Card with hover lift ------------------------------------------------ */

export function LiftCard({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(15, 23, 42, 0.15)' }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

/* Animated number: springs from 0 to value ---------------------------- */

export function AnimatedNumber({
  value,
  decimals = 0,
  suffix = '',
  className,
}: {
  value: number
  decimals?: number
  suffix?: string
  className?: string
}) {
  const raw = useMotionValue(0)
  const spring = useSpring(raw, { stiffness: 80, damping: 20 })
  const display = useTransform(spring, (v) => `${v.toFixed(decimals)}${suffix}`)

  useEffect(() => {
    raw.set(value)
  }, [value, raw])

  return <motion.span className={className}>{display}</motion.span>
}

/* Animated score bar --------------------------------------------------- */

export function ScoreBar({ value, colorClass = 'bg-primary-500' }: { value: number; colorClass?: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${colorClass}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
    </div>
  )
}

export function scoreColor(value: number): string {
  if (value >= 75) return 'bg-green-500'
  if (value >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}
