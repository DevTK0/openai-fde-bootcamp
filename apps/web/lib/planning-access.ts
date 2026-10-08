import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"

const lifetime = 8 * 60 * 60
function equal(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}
function signature(value: string, key: string) {
  return createHmac("sha256", key)
    .update("ops-planning-session:" + value)
    .digest("base64url")
}

export function planningSessionCookie() {
  const key = process.env.OPS_PLANNING_ACCESS_KEY
  if (!key) throw new Error("Planner access is not configured.")
  const value = `${Math.floor(Date.now() / 1000) + lifetime}.${randomBytes(16).toString("base64url")}`
  return `ops-planning-access=${value}.${signature(value, key)}; HttpOnly; Secure; SameSite=Strict; Path=/api/planning; Max-Age=${lifetime}`
}

export function planningAuthorized(request: Request) {
  const expected = process.env.OPS_PLANNING_ACCESS_KEY
  if (!expected) return false
  const bearer = request.headers.get("authorization")
  if (bearer) return equal(bearer, `Bearer ${expected}`)
  const supplied =
    request.headers
      .get("cookie")
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("ops-planning-access="))
      ?.slice("ops-planning-access=".length) ?? ""
  if (!/^\d+\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}$/.test(supplied))
    return false
  const [expires, nonce, signed] = supplied.split(".")
  return (
    Number(expires) > Math.floor(Date.now() / 1000) &&
    equal(signature(`${expires}.${nonce}`, expected), signed ?? "")
  )
}
