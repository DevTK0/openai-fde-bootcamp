import { createContext, useContext, type ReactNode, type SVGProps } from "react"
export const DiagramTextContext = createContext<Record<string, string>>({})
export function useDiagramText(original: string) {
  const edits = useContext(DiagramTextContext)
  return Object.hasOwn(edits, original) ? edits[original]! : original
}
function plain(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number")
    return String(children)
  if (Array.isArray(children)) return children.map(plain).join("")
  return ""
}
export function SvgText({ children, ...props }: SVGProps<SVGTextElement>) {
  const original = plain(children)
  const text = useDiagramText(original)
  return (
    <text {...props} data-original-text={original}>
      {original ? text : children}
    </text>
  )
}
