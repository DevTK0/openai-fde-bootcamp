import * as THREE from "three"
import type { Exchange } from "./passenger-exchange"

// Lucide LogIn, LogOut and UserRoundX paths (lucide-react, ISC license).
const symbols = [
  {
    color: "#73ffce",
    paths: [
      "m10 17 5-5-5-5",
      "M15 12H3",
      "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",
    ],
    person: false,
  },
  {
    color: "#80dfff",
    paths: [
      "m16 17 5-5-5-5",
      "M21 12H9",
      "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
    ],
    person: false,
  },
  {
    color: "#ff8585",
    paths: ["m16.5 16.5 5 5", "M2 21a8 8 0 0 1 11.531-7.18", "m21.5 16.5-5 5"],
    person: true,
  },
]

export function passengerSymbols(event: Exchange) {
  const group = new THREE.Group()
  const canvas = document.createElement("canvas")
  canvas.width = 720
  canvas.height = 180
  const ctx = canvas.getContext("2d")
  if (!ctx) return group
  ctx.fillStyle = "#07111f"
  ctx.strokeStyle = "#a9bdd4"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(6, 6, 708, 156, 24)
  ctx.fill()
  ctx.stroke()
  const counts = [event.boarded, event.alighted, event.left]
  symbols.forEach((symbol, index) => {
    const x = index * 236 + 6
    if (index > 0) {
      ctx.strokeStyle = "#34445b"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, 32)
      ctx.lineTo(x, 136)
      ctx.stroke()
    }
    ctx.save()
    ctx.translate(x + 23, 49)
    ctx.scale(2.8, 2.8)
    ctx.strokeStyle = symbol.color
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    for (const path of symbol.paths) ctx.stroke(new Path2D(path))
    if (symbol.person) {
      ctx.beginPath()
      ctx.arc(10, 8, 5, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.restore()
    ctx.font = "700 65px sans-serif"
    ctx.textAlign = "center"
    ctx.fillStyle = symbol.color
    ctx.fillText(
      counts[index] == null ? "?" : String(counts[index]),
      x + 163,
      108
    )
  })
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: Math.min(1, (180 - event.age) / 150),
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    })
  )
  sprite.center.set(0.5, 0)
  sprite.scale.set(40, 10, 1)
  sprite.renderOrder = 105
  group.add(sprite)
  return group
}
