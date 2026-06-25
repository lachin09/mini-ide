import type { ButtonHTMLAttributes } from 'react'

type MiniIDEButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function MiniIDEButton({ className = '', type = 'button', ...props }: MiniIDEButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={className}
      style={{
        alignItems: 'center',
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: 6,
        color: '#f8fafc',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        fontSize: 14,
        fontWeight: 500,
        justifyContent: 'center',
        minHeight: 36,
        opacity: props.disabled ? 0.55 : 1,
        padding: '0 12px',
        ...props.style,
      }}
    />
  )
}
