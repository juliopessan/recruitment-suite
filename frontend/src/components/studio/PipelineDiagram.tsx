import { motion } from 'framer-motion'

interface Step {
  num: string
  title: string
  sub: string
}

interface EndpointBox {
  label: string
  title: string
  meta: string
}

interface PipelineDiagramProps {
  input: EndpointBox
  steps: Step[]
  output: EndpointBox
  liveLabel?: string
}

/**
 * DABBA-style "live pipeline" diagram: an input box and an output box
 * connected to a stack of stage cards via dashed SVG curves, all
 * positioned in percentage-space so the connectors track the boxes
 * at any container width.
 */
export function PipelineDiagram({ input, steps, output, liveLabel = 'LIVE PIPELINE' }: PipelineDiagramProps) {
  const n = steps.length
  const yFor = (i: number) => ((i + 0.5) / n) * 100

  return (
    <div className="studio-card relative overflow-hidden p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="eyebrow">{liveLabel}</span>
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-green-500"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative h-[420px]">
        {/* Connector layer */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {steps.map((_, i) => (
            <motion.path
              key={`in-${i}`}
              d={`M 19 50 C 28 50, 28 ${yFor(i)}, 37 ${yFor(i)}`}
              fill="none"
              stroke="rgba(22,20,15,0.25)"
              strokeWidth="0.4"
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}

          {/* Signal travelling along each input branch */}
          {steps.map((_, i) => (
            <motion.circle
              key={`pulse-${i}`}
              r="0.7"
              fill="#ff5b22"
              vectorEffect="non-scaling-stroke"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: i * 0.45,
                ease: 'easeInOut',
                times: [0, 0.1, 0.9, 1],
              }}
            >
              <animateMotion
                dur="2.4s"
                repeatCount="indefinite"
                begin={`${i * 0.45}s`}
                path={`M 19 50 C 28 50, 28 ${yFor(i)}, 37 ${yFor(i)}`}
              />
            </motion.circle>
          ))}
          {steps.map((_, i) => (
            <motion.path
              key={`out-${i}`}
              d={`M 63.5 ${yFor(i)} C 71 ${yFor(i)}, 71 50, 77.5 50`}
              fill="none"
              stroke="rgba(255,91,34,0.55)"
              strokeWidth="0.4"
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </svg>

        {/* Input */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[17%] min-w-[110px] z-10">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-ink/15 rounded-lg p-3 shadow-sm"
          >
            <p className="eyebrow text-primary-600 mb-1">{input.label}</p>
            <p className="font-bold text-lg leading-tight">{input.title}</p>
            <p className="text-xs text-ink-400 mt-1">{input.meta}</p>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="absolute left-[37%] top-0 w-[26%] min-w-[150px] h-full flex flex-col justify-between z-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative bg-white border border-ink/15 rounded-lg px-3 py-2.5 shadow-sm"
            >
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-primary-500" />
              <p className="text-[11px] font-bold text-primary-600 mb-0.5">{step.num}</p>
              <p className="font-bold text-sm leading-tight">{step.title}</p>
              <p className="text-xs text-ink-400">{step.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Output */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[22%] min-w-[140px] z-10">
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border-2 border-ink rounded-lg p-3 shadow-md"
          >
            <p className="eyebrow text-ink-500 mb-1">{output.label}</p>
            <p className="font-bold text-sm leading-snug break-words">{output.title}</p>
            <p className="text-[11px] text-ink-400 mt-1 leading-snug break-words">{output.meta}</p>
            <div className="mt-2 space-y-1">
              <motion.div
                className="h-1 rounded-full bg-ink/10"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
              />
              <motion.div
                className="h-1 rounded-full bg-ink/10"
                initial={{ width: 0 }}
                whileInView={{ width: '66%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink/10 text-xs text-ink-400">
        <span>The candidate travels the chain.</span>
        <span className="font-semibold text-ink">Every score stays traceable.</span>
      </div>
    </div>
  )
}
