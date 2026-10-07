import * as THREE from "three"
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js"
import { z } from "zod"

const coordinate = z.tuple([z.number(), z.number()])
const polygon = z.array(z.array(coordinate))
const citySchema = z.object({
  roads: z.array(z.object({ class: z.string(), points: z.array(coordinate) })),
  buildings: z.array(
    z.object({ rings: polygon, height: z.number(), minimum: z.number() })
  ),
  water: z.array(polygon),
  parks: z.array(polygon),
})
type City = z.infer<typeof citySchema>
let request: Promise<City> | undefined
export function loadCity() {
  request ??= fetch("/prototype-map/streets.json")
    .then((r) => {
      if (!r.ok) throw new Error("Street data unavailable")
      return r.json()
    })
    .then((data) => citySchema.parse(data))
    .catch((error) => {
      request = undefined
      throw error
    })
  return request
}
function shape(rings: z.infer<typeof polygon>) {
  const [outer, ...holes] = rings
  const result = new THREE.Shape(
    (outer ?? []).map(([x, z]) => new THREE.Vector2(x, -z))
  )
  result.holes = holes.map(
    (ring) => new THREE.Path(ring.map(([x, z]) => new THREE.Vector2(x, -z)))
  )
  return result
}
export function addCity(scene: THREE.Scene, city: City) {
  const surfaces: [typeof city.water, number, number][] = [
    [city.parks, 0x294e46, 1.8],
    [city.water, 0x102e40, 1.9],
  ]
  for (const [polygons, color, height] of surfaces) {
    const pieces = polygons.map((rings) => {
      const geometry = new THREE.ShapeGeometry(shape(rings))
      geometry.rotateX(-Math.PI / 2)
      geometry.translate(0, height, 0)
      return geometry
    })
    if (pieces.length) {
      const merged = mergeGeometries(pieces)
      pieces.forEach((g) => g.dispose())
      if (merged)
        scene.add(
          new THREE.Mesh(
            merged,
            new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
          )
        )
    }
  }
  const buildings = city.buildings.map((building) => {
    // One map unit is about 31.5 metres. OSM height attributes may be inferred upstream.
    const base = Math.max(0, building.minimum) / 31.54
    const height = Math.max(3, building.height - building.minimum) / 31.54
    const geometry = new THREE.ExtrudeGeometry(shape(building.rings), {
      depth: height,
      bevelEnabled: false,
    })
    geometry.rotateX(-Math.PI / 2)
    geometry.translate(0, 2 + base, 0)
    return geometry
  })
  if (buildings.length) {
    const merged = mergeGeometries(buildings)
    buildings.forEach((g) => g.dispose())
    if (merged)
      scene.add(
        new THREE.Mesh(
          merged,
          new THREE.MeshStandardMaterial({ color: 0x71909a, roughness: 0.95 })
        )
      )
  }
  for (const major of [false, true]) {
    const points: THREE.Vector3[] = []
    for (const road of city.roads) {
      if (
        ["motorway", "trunk", "primary", "secondary"].includes(road.class) !==
        major
      )
        continue
      for (let i = 1; i < road.points.length; i++) {
        const a = road.points[i - 1],
          b = road.points[i]
        if (a && b)
          points.push(
            new THREE.Vector3(a[0], 2.1, a[1]),
            new THREE.Vector3(b[0], 2.1, b[1])
          )
      }
    }
    scene.add(
      new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: major ? 0x95a4a6 : 0x546f78,
          transparent: true,
          opacity: major ? 0.7 : 0.55,
        })
      )
    )
  }
}
