import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant: 'green' | 'orange' | 'red' | 'blue'
}

const variantClasses: Record<BadgeProps['variant'], string> = {
  green: 'badge badge--green',
  orange: 'badge badge--orange',
  red: 'badge badge--red',
  blue: 'badge badge--blue',
}

export function Badge({ children, variant }: BadgeProps) {
  return <span className={variantClasses[variant]}>{children}</span>
}
