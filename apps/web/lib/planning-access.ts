import { timingSafeEqual } from "node:crypto"

export function planningAuthorized(request: Request) {
  const expected = process.env.OPS_PLANNING_ACCESS_KEY
  if (!expected) return false
  const supplied =
    request.headers.get("authorization")?.replace(/^Bearer /, "") ??
    request.headers
      .get("cookie")
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("ops-planning-access="))
      ?.slice("ops-planning-access=".length) ??
    ""
  const left = Buffer.from(supplied)
  const right = Buffer.from(expected)
  return left.length === right.length && timingSafeEqual(left, right)
}
