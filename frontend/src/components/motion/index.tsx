import { useEffect, useRef, ReactNode } from 'react'
import {
  motion,
  useInView,
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

/* Reveal: like Page, but triggers when scrolled into view instead of on
   mount — use for any section below the fold so it doesn't burn its
   entrance animation off-screen before the user ever sees it. -------- */

export function Reveal({
  children,
  className,
  amount = 0.2,
}: {
  children: ReactNode
  className?: string
  amount?: number
}) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      whileInView="enter"
      viewport={{ once: true, amount }}
      className={className}
    >
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
      whileHover={{ y: -3 }}
      whileTap={onClick ? { scale: 0.99 } : undefined}
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
  countOnView = false,
}: {
  value: number
  decimals?: number
  suffix?: string
  className?: string
  /** Start counting when scrolled into view rather than on mount. */
  countOnView?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const raw = useMotionValue(0)
  const spring = useSpring(raw, { stiffness: 80, damping: 20 })
  const display = useTransform(spring, (v) => `${v.toFixed(decimals)}${suffix}`)

  useEffect(() => {
    if (!countOnView || inView) raw.set(value)
  }, [value, raw, countOnView, inView])

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  )
}

/* Animated score bar --------------------------------------------------- */

export function ScoreBar({ value, colorClass }: { value: number; colorClass?: string }) {
  return (
    <div className="meter-track">
      <motion.div
        className={`h-full ${colorClass ?? scoreColor(value)}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
    </div>
  )
}

/** Bar colour for a 0–100 score: mint passes, ochre holds, rust fails. */
export function scoreColor(value: number): string {
  if (value >= 75) return 'bg-mint-600'
  if (value >= 50) return 'bg-ochre-500'
  return 'bg-rust-500'
}
