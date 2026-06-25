export type MiniIDEResizeHandleProps = {
  className?: string
  direction: 'horizontal' | 'vertical'
  target: string
  min?: number
  max?: number
  invert?: boolean
  style?: React.CSSProperties
}

export function MiniIDEResizeHandle({
  className = '',
  direction,
  target,
  min = 120,
  max = 640,
  invert = false,
  style,
}: MiniIDEResizeHandleProps) {
  function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    const layout = event.currentTarget.closest<HTMLElement>('[data-mini-ide-layout]')

    if (!layout) {
      return
    }
    const targetLayout = layout

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)

    const startPosition = direction === 'horizontal' ? event.clientX : event.clientY
    const rawValue = targetLayout.style.getPropertyValue(target)
    const startValue = Number.parseFloat(rawValue) || min

    function handlePointerMove(moveEvent: PointerEvent) {
      const currentPosition = direction === 'horizontal' ? moveEvent.clientX : moveEvent.clientY
      const delta = (currentPosition - startPosition) * (invert ? -1 : 1)
      const nextValue = Math.min(max, Math.max(min, startValue + delta))

      targetLayout.style.setProperty(target, `${nextValue}px`)
    }

    function stopResize() {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', stopResize)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopResize)
  }

  return (
    <button
      type="button"
      aria-label="Resize panel"
      className={className}
      onPointerDown={handlePointerDown}
      style={{
        background: 'transparent',
        border: 0,
        cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
        minHeight: 0,
        padding: 0,
        touchAction: 'none',
        ...style,
      }}
    />
  )
}
