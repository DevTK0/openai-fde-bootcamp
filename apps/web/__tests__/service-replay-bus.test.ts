import { readFile } from "node:fs/promises"
import { describe, expect, it } from "vitest"
import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { BusFleet } from "@/components/service-replay/bus-fleet"

async function fleet() {
  const bytes = await readFile("public/assets/lionlink-bus/lionlink-bus.glb")
  const model = await new GLTFLoader().parseAsync(
    Uint8Array.from(bytes).buffer,
    ""
  )
  return new BusFleet(model.scene)
}

function partBounds(buses: BusFleet, name: string, index = 0) {
  const part = buses.getObjectByName(name)
  if (!(part instanceof THREE.InstancedMesh))
    throw new Error(`Missing bus part: ${name}`)
  const matrix = new THREE.Matrix4()
  part.getMatrixAt(index, matrix)
  return new THREE.Box3()
    .setFromBufferAttribute(part.geometry.getAttribute("position"))
    .applyMatrix4(matrix)
}

describe("LionLink buses on the route map", () => {
  it("grounds the real model and points its headlights along the route heading", async () => {
    const buses = await fleet()
    buses.update([
      { key: "north", x: 10, z: 20, heading: 0 },
      { key: "east", x: 30, z: 40, heading: Math.PI / 2 },
    ])
    buses.updateMatrixWorld(true)
    const front = partBounds(buses, "Headlamp_LED").max
    const rear = partBounds(buses, "Tail_lamps").getCenter(new THREE.Vector3())
    expect(front.z).toBeGreaterThan(22)
    expect(rear.z).toBeLessThan(18)
    const turnedFront = partBounds(buses, "Headlamp_LED", 1).max
    expect(turnedFront.x).toBeGreaterThan(32)
    expect(partBounds(buses, "Tail_lamps", 1).max.x).toBeLessThan(28)
    const bounds = new THREE.Box3().setFromObject(buses)
    expect(bounds.min.y).toBeCloseTo(3.6)
    expect(bounds.max.y).toBeLessThan(6)
    buses.dispose()
  })

  it("picks current bus identities after moving, growing and removing the fleet", async () => {
    const buses = await fleet()
    const ray = (x: number, z: number) =>
      new THREE.Raycaster(
        new THREE.Vector3(x, 20, z),
        new THREE.Vector3(0, -1, 0)
      )
    buses.update([{ key: "first", x: 0, z: 0 }])
    buses.updateMatrixWorld(true)
    expect(buses.pick(ray(0, 0))).toBe("first")
    buses.update([
      { key: "moved", x: 10, z: 20 },
      { key: "added", x: 30, z: 40 },
    ])
    buses.updateMatrixWorld(true)
    expect(buses.pick(ray(0, 0))).toBeUndefined()
    expect(buses.pick(ray(10, 20))).toBe("moved")
    expect(buses.pick(ray(30, 40))).toBe("added")
    buses.update([])
    expect(buses.pick(ray(10, 20))).toBeUndefined()
    buses.dispose()
  })

  it("releases owned geometry when the map closes, not when markers move", async () => {
    const buses = await fleet()
    const released: string[] = []
    for (const child of buses.children) {
      if (child instanceof THREE.InstancedMesh)
        child.geometry.addEventListener("dispose", () =>
          released.push(child.name)
        )
    }
    buses.update([{ key: "first", x: 0, z: 0 }])
    buses.update([
      { key: "first", x: 5, z: 5 },
      { key: "second", x: 10, z: 10 },
    ])
    expect(released).toEqual([])
    buses.dispose()
    expect(released).toContain("Headlamp_LED")
    expect(released).toContain("Tail_lamps")
    expect(buses.children).toHaveLength(0)
  })
})
