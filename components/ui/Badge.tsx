import { ReactNode } from 'react'

type Variant = 'default' | 'green' | 'blue' | 'yellow' | 'red'

const variants: Record<Variant, string> = {
  default: 'bg-gray-100 text-gray-700',
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red: 'bg-red-100 text-red-700',
}

type BadgeProps = {
  children: ReactNode
  variant?: Variant
  className?: string
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
