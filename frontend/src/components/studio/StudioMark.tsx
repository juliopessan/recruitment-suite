export function StudioMark({ size = 22 }: { size?: number }) {
  const cell = size / 2 - 1

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <rect x="0" y="0" width={cell} height={cell} fill="#16140f" />
      <rect x={cell + 2} y="0" width={cell} height={cell} fill="#ff5b22" />
      <rect x="0" y={cell + 2} width={cell} height={cell} fill="#ff5b22" />
      <rect x={cell + 2} y={cell + 2} width={cell} height={cell} fill="#16140f" />
    </svg>
  )
}
