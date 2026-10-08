import * as THREE from "three"
import { repairAreas, type RepairArea } from "@/lib/repairs/schema"

export class RepairBus extends THREE.Group {
  private readonly geometries = new Set<THREE.BufferGeometry>()
  private readonly materials = new Set<THREE.Material>()
  private readonly textures = new Set<THREE.Texture>()

  constructor(model: THREE.Object3D, areas: RepairArea[]) {
    super()
    const nodes = new Set(areas.flatMap((id) => repairAreas[id].nodes))
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      this.geometries.add(object.geometry)
      const part: unknown = object.userData.part_id
      const selected = typeof part === "string" && nodes.has(part)
      const highlight = (material: THREE.Material) => {
        this.materials.add(material)
        for (const value of Object.values(material))
          if (value instanceof THREE.Texture) this.textures.add(value)
        if (selected && material instanceof THREE.MeshStandardMaterial) {
          const highlighted = material.clone()
          this.materials.add(highlighted)
          highlighted.emissive.set(0xff8c32)
          highlighted.emissiveIntensity = 0.9
          return highlighted
        }
        return material
      }
      object.material = Array.isArray(object.material)
        ? object.material.map(highlight)
        : highlight(object.material)
    })
    this.add(model)
  }

  dispose() {
    for (const value of [
      ...this.geometries,
      ...this.materials,
      ...this.textures,
    ])
      value.dispose()
    this.geometries.clear()
    this.materials.clear()
    this.textures.clear()
    this.clear()
  }
}
