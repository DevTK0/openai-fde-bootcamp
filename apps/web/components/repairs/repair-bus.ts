import * as THREE from "three"
import { repairAreas, type RepairArea } from "@/lib/repairs/schema"

export class RepairBus extends THREE.Group {
  private readonly geometries = new Set<THREE.BufferGeometry>()
  private readonly materials = new Set<THREE.Material>()
  private readonly textures = new Set<THREE.Texture>()
  private readonly parts: {
    id: unknown
    material: THREE.MeshStandardMaterial
    emissive: THREE.Color
    intensity: number
  }[] = []

  constructor(model: THREE.Object3D, areas: RepairArea[]) {
    super()
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      this.geometries.add(object.geometry)
      const prepare = (material: THREE.Material) => {
        this.materials.add(material)
        for (const value of Object.values(material))
          if (value instanceof THREE.Texture) this.textures.add(value)
        if (!(material instanceof THREE.MeshStandardMaterial)) return material
        const owned = material.clone()
        this.materials.add(owned)
        this.parts.push({
          id: object.userData.part_id,
          material: owned,
          emissive: owned.emissive.clone(),
          intensity: owned.emissiveIntensity,
        })
        return owned
      }
      object.material = Array.isArray(object.material)
        ? object.material.map(prepare)
        : prepare(object.material)
    })
    this.add(model)
    this.setAreas(areas)
  }

  setAreas(areas: RepairArea[]) {
    const nodes = new Set(areas.flatMap((id) => repairAreas[id].nodes))
    for (const part of this.parts) {
      const selected = typeof part.id === "string" && nodes.has(part.id)
      part.material.emissive.copy(part.emissive)
      if (selected) part.material.emissive.set(0xff8c32)
      part.material.emissiveIntensity = selected ? 0.9 : part.intensity
    }
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
    this.parts.length = 0
    this.clear()
  }
}
