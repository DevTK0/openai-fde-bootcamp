import { readFile } from "node:fs/promises"
import { expect, it } from "vitest"
import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { repairAreas } from "@/lib/repairs/schema"

it("can highlight actual geometry for every supported repair area", async () => {
  const bytes = await readFile(
    "public/assets/lionlink-bus/lionlink-maintenance.glb"
  )
  const model = await new GLTFLoader().parseAsync(
    Uint8Array.from(bytes).buffer,
    ""
  )
  const nodes = new Set<string>()
  model.scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return
    const part: unknown = object.userData.part_id
    if (
      typeof part === "string" &&
      object.geometry.getAttribute("position").count > 0 &&
      [object.material]
        .flat()
        .some((m) => m instanceof THREE.MeshStandardMaterial)
    )
      nodes.add(part)
  })
  for (const area of Object.values(repairAreas))
    for (const node of area.nodes)
      expect(
        nodes.has(node),
        `${area.label} must have highlightable ${node} geometry`
      ).toBe(true)
  model.scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return
    object.geometry.dispose()
    for (const material of [object.material].flat()) material.dispose()
  })
})

it("highlights only the selected centre door despite shared source materials", async () => {
  const { RepairBus } = await import("@/components/repairs/repair-bus")
  const bytes = await readFile(
    "public/assets/lionlink-bus/lionlink-maintenance.glb"
  )
  const model = await new GLTFLoader().parseAsync(
    Uint8Array.from(bytes).buffer,
    ""
  )
  const baseline = new Map<string, number[]>()
  model.scene.traverse((object) => {
    if (object instanceof THREE.Mesh)
      baseline.set(
        object.uuid,
        [object.material]
          .flat()
          .filter((m) => m instanceof THREE.MeshStandardMaterial)
          .map((m) => m.emissive.getHex())
      )
  })
  const bus = new RepairBus(model.scene, ["centre_door"])
  let highlighted = 0
  bus.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return
    const materials = [object.material]
      .flat()
      .filter((m) => m instanceof THREE.MeshStandardMaterial)
    if (object.userData.part_id === "centre_door") {
      for (const material of materials) {
        expect(material.emissive.getHex()).toBe(0xff8c32)
        highlighted++
      }
    } else
      expect(
        materials.map((m) => m.emissive.getHex()),
        `Unselected ${object.name}`
      ).toEqual(baseline.get(object.uuid))
  })
  expect(highlighted).toBe(5)
  const materials = new Set<THREE.Material>()
  bus.traverse((object) => {
    if (object instanceof THREE.Mesh)
      for (const material of [object.material].flat()) materials.add(material)
  })
  bus.setAreas(["roof_ac"])
  bus.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return
    for (const material of [object.material].flat()) {
      expect(materials.has(material)).toBe(true)
      if (
        object.userData.part_id === "roof_ac" &&
        material instanceof THREE.MeshStandardMaterial
      )
        expect(material.emissive.getHex()).toBe(0xff8c32)
    }
  })
  bus.setAreas([])
  bus.traverse((object) => {
    if (object instanceof THREE.Mesh)
      expect(
        [object.material]
          .flat()
          .filter((m) => m instanceof THREE.MeshStandardMaterial)
          .map((m) => m.emissive.getHex())
      ).toEqual(baseline.get(object.uuid))
  })
  bus.dispose()
})
