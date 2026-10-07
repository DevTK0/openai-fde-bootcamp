import * as THREE from "three"

export function busPositionMarker(color: THREE.ColorRepresentation) {
  // Keep position and status visible while the detailed model loads or fails.
  const marker = new THREE.Group()
  const material = new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide,
  })
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.7, 24), material)
  ring.rotation.x = -Math.PI / 2
  marker.add(ring)
  const arrow = new THREE.Shape()
  arrow.moveTo(-0.6, 3.3)
  arrow.lineTo(0, 4.2)
  arrow.lineTo(0.6, 3.3)
  arrow.closePath()
  const front = new THREE.Mesh(new THREE.ShapeGeometry(arrow), material)
  front.rotation.x = Math.PI / 2
  marker.add(front)
  return marker
}
