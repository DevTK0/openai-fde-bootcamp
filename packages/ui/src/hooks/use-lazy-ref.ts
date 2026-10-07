import * as React from "react"

function useLazyRef<T>(fn: () => T) {
  const ref = React.useRef<{ current: T } | null>(null)
  if (ref.current === null) ref.current = { current: fn() }
  return ref.current
}

export { useLazyRef }
