import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

type Placement = { key: string; x: number; z: number; heading?: number }

export class BusFleet extends THREE.Group {
  private readonly parts: THREE.InstancedMesh[] = []
  private keys: string[] = []

  constructor(model: THREE.Object3D) {
    super()
    // The Blender bus faces -X; route headings use +Z as forward.
    model.rotation.y += Math.PI / 2
    model.updateMatrixWorld(true)
    const bounds = new THREE.Box3().setFromObject(model)
    const center = bounds.getCenter(new THREE.Vector3())
    // Exaggerate the vehicle size so it remains readable on the route map.
    const scale = 6 / (bounds.max.z - bounds.min.z)
    const normalize = new THREE.Matrix4()
      .makeScale(scale, scale, scale)
      .multiply(
        new THREE.Matrix4().makeTranslation(-center.x, -bounds.min.y, -center.z)
      )
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      object.geometry.applyMatrix4(
        new THREE.Matrix4().multiplyMatrices(normalize, object.matrixWorld)
      )
      const part = new THREE.InstancedMesh(object.geometry, object.material, 1)
      part.name = object.name
      part.count = 0
      part.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      this.parts.push(part)
      this.add(part)
    })
  }

  update(placements: readonly Placement[]) {
    this.keys = placements.map((placement) => placement.key)
    const transform = new THREE.Matrix4()
    for (let index = 0; index < this.parts.length; index++) {
      let part = this.parts[index]
      if (!part) continue
      if (placements.length > part.instanceMatrix.count) {
        const replacement = new THREE.InstancedMesh(
          part.geometry,
          part.material,
          placements.length
        )
        replacement.name = part.name
        replacement.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
        this.remove(part)
        part.dispose()
        this.parts[index] = replacement
        this.add(replacement)
        part = replacement
      }
      part.count = placements.length
      for (const [index, placement] of placements.entries()) {
        transform.makeRotationY(placement.heading ?? 0)
        transform.setPosition(placement.x, 3.6, placement.z)
        part.setMatrixAt(index, transform)
      }
      part.instanceMatrix.needsUpdate = true
      part.computeBoundingSphere()
    }
  }

  pick(raycaster: THREE.Raycaster) {
    const hit = raycaster.intersectObjects(this.children)[0]
    if (hit?.instanceId === undefined) return undefined
    const key = this.keys[hit.instanceId]
    return key === undefined ? undefined : { key, distance: hit.distance }
  }

  dispose() {
    const geometries = new Set<THREE.BufferGeometry>()
    const materials = new Set<THREE.Material>()
    const textures = new Set<THREE.Texture>()
    for (const part of this.parts) {
      geometries.add(part.geometry)
      for (const material of [part.material].flat()) materials.add(material)
      part.dispose()
    }
    for (const material of materials) {
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) textures.add(value)
      }
      material.dispose()
    }
    for (const texture of textures) texture.dispose()
    for (const geometry of geometries) geometry.dispose()
    this.parts.length = 0
    this.keys = []
    this.clear()
  }
}

export async function loadBusFleet() {
  const model = await new GLTFLoader().loadAsync(
    "/assets/lionlink-bus/lionlink-bus.glb"
  )
  return new BusFleet(model.scene)
}
