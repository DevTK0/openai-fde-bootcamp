export function serviceColor(service: string) {
  let hash = 0
  for (const character of service)
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  return `hsl(${(hash * 137.508) % 360}, 80%, 68%)`
}
