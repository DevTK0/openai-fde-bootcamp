"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Button } from "@workspace/ui/components/button"
import { Plus, Minus, LocateFixed } from "lucide-react"
import { serviceColor } from "./service-color"
import { passengerSymbols } from "./passenger-symbols"
import type { Exchange } from "./passenger-exchange"
import { addCity, loadCity } from "./city"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import type { Route } from "./route-geometry"
import { mapData, point, type Point } from "./geometry"

export type Marker = Point & {
  key: string
  kind: "bus" | "queue"
  count: number | null
  exchange?: Exchange
  estimated?: boolean
  heading?: number
  service?: string
}

function dispose(object: THREE.Object3D) {
  object.traverse((child) => {
    if (
      child instanceof THREE.Mesh ||
      child instanceof THREE.Line ||
      child instanceof THREE.Sprite
    ) {
      if ("geometry" in child) child.geometry.dispose()
      if (child instanceof THREE.InstancedMesh) child.dispose()
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material]
      for (const material of materials) {
        if ("map" in material && material.map instanceof THREE.Texture)
          material.map.dispose()
        material.dispose()
      }
    }
  })
}

export function Scene({
  routes,
  selected,
  markers,
  onPick,
}: {
  routes: Route[]
  selected: string
  markers: Marker[]
  onPick: (key: string) => void
}) {
  const network = new Set(routes.map((route) => route.service)).size > 1
  const [cameraVersion, setCameraVersion] = useState(0)
  const orbit = useRef<OrbitControls | null>(null)
  const host = useRef<HTMLDivElement>(null)
  const dynamic = useRef<THREE.Group | null>(null)
  const [error, setError] = useState("")
  const [cityStatus, setCityStatus] = useState(
    "Loading Singapore streets and buildings…"
  )
  useEffect(() => {
    const element = host.current
    if (!element) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true })
    } catch {
      queueMicrotask(() =>
        setError(
          "WebGL is unavailable. The recorded evidence remains available below."
        )
      )
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x081925)
    renderer.domElement.setAttribute(
      "aria-label",
      "Interactive Singapore route map. Drag to rotate; right-drag to pan; two-finger scroll to pan; use the plus and minus buttons to zoom; arrow keys pan when focused; click a stop to highlight it."
    )
    renderer.domElement.tabIndex = 0
    renderer.domElement.className = "cursor-grab active:cursor-grabbing"
    element.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    let disposed = false
    void loadCity()
      .then((city) => {
        if (disposed) return
        addCity(scene, city)
        setCityStatus("OSM streets + buildings · Heights approximate")
      })
      .catch(() => {
        if (!disposed)
          setCityStatus("Street layer unavailable; showing LTA routes only")
      })
    scene.add(new THREE.HemisphereLight(0xe1f5ff, 0x193248, 3))
    const sun = new THREE.DirectionalLight(0xffffff, 2)
    sun.position.set(-100, 500, 300)
    scene.add(sun)
    const camera = new THREE.PerspectiveCamera(42, 1, 1, 5000)
    const controls = new OrbitControls(camera, renderer.domElement)
    orbit.current = controls
    controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE
    controls.mouseButtons.RIGHT = THREE.MOUSE.PAN
    controls.touches.ONE = THREE.TOUCH.ROTATE
    controls.touches.TWO = THREE.TOUCH.DOLLY_PAN
    controls.enableZoom = false
    controls.screenSpacePanning = false
    controls.listenToKeyEvents(renderer.domElement)
    controls.maxPolarAngle = Math.PI / 2.05
    controls.minDistance = 60
    controls.maxDistance = 2100
    const panWithWheel = (event: WheelEvent) => {
      event.preventDefault()
      // Trackpads emit wheel events for two-finger scrolling. Pinch remains disabled.
      if (event.ctrlKey) return
      const pixels =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? element.clientHeight
            : 1
      const scale =
        (2 *
          camera.position.distanceTo(controls.target) *
          Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) /
        element.clientHeight
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0)
      const forward = new THREE.Vector3().crossVectors(camera.up, right)
      const movement = right
        .multiplyScalar(event.deltaX * pixels * scale)
        .add(forward.multiplyScalar(-event.deltaY * pixels * scale))
      controls.target.add(movement)
      camera.position.add(movement)
      controls.update()
    }
    renderer.domElement.addEventListener("wheel", panWithWheel, {
      passive: false,
    })
    const bounds = new THREE.Box3().setFromPoints(
      routes.flatMap((r) =>
        r.points.map((p) => new THREE.Vector3(point(p).x, 0, point(p).z))
      )
    )
    const center = bounds.getCenter(new THREE.Vector3())
    const span =
      Math.max(60, bounds.max.x - bounds.min.x, bounds.max.z - bounds.min.z) *
      1.65
    controls.target.copy(center)
    camera.position
      .copy(center)
      .add(new THREE.Vector3(0, span * 0.9, span * 0.65))
    controls.update()
    for (const polygon of mapData.land) {
      const shape = new THREE.Shape(
        polygon.map((p) => new THREE.Vector2(point(p).x, -point(p).z))
      )
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 1.5,
        bevelEnabled: false,
      })
      geometry.rotateX(-Math.PI / 2)
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({ color: 0x203d49, roughness: 1 })
      )
      scene.add(mesh)
      const edge = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(
          polygon.map((p) => new THREE.Vector3(point(p).x, 1.55, point(p).z))
        ),
        new THREE.LineBasicMaterial({
          color: 0x42616b,
          transparent: true,
          opacity: 0.35,
        })
      )
      scene.add(edge)
    }
    function line(points: Point[], color: number, y: number, radius = 0.45) {
      if (points.length < 2) return
      const curve = new THREE.CurvePath<THREE.Vector3>()
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1],
          b = points[i]
        if (a && b)
          curve.add(
            new THREE.LineCurve3(
              new THREE.Vector3(a.x, y, a.z),
              new THREE.Vector3(b.x, y, b.z)
            )
          )
      }
      const mesh = new THREE.Mesh(
        new THREE.TubeGeometry(
          curve,
          Math.max(points.length, 100),
          radius,
          4,
          false
        ),
        new THREE.MeshBasicMaterial({ color })
      )
      scene.add(mesh)
    }
    for (const route of routes) {
      const color = network
        ? new THREE.Color(serviceColor(route.service)).getHex()
        : route.direction === 1
          ? 0x35dec6
          : 0x799bff
      for (const leg of route.legs)
        line(
          leg.points.map(point),
          leg.kind === "road" ? color : 0xffb347,
          3 + route.direction * 0.2
        )
    }
    for (const label of mapData.labels) {
      const canvas = document.createElement("canvas")
      canvas.width = 512
      canvas.height = 64
      const ctx = canvas.getContext("2d")
      if (!ctx) continue
      ctx.font = "500 27px sans-serif"
      ctx.textAlign = "center"
      ctx.fillStyle = "#bed0d9"
      ctx.fillText(label.name.toUpperCase(), 256, 40)
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(canvas),
          depthTest: false,
          transparent: true,
          opacity: 0.85,
        })
      )
      const p = point(label.point)
      sprite.position.set(p.x, 5, p.z)
      sprite.scale.set(65, 8, 1)
      scene.add(sprite)
    }
    const group = new THREE.Group()
    scene.add(group)
    dynamic.current = group
    const raycaster = new THREE.Raycaster()
    let down = { x: 0, y: 0 }
    const pointerDown = (event: PointerEvent) => {
      renderer.domElement.focus({ preventScroll: true })
      down = { x: event.clientX, y: event.clientY }
    }
    const pick = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - down.x, event.clientY - down.y) > 5) return
      const rect = renderer.domElement.getBoundingClientRect()
      raycaster.setFromCamera(
        new THREE.Vector2(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          (-(event.clientY - rect.top) / rect.height) * 2 + 1
        ),
        camera
      )
      const hit = raycaster
        .intersectObjects(group.children)
        .find(
          (h) => h.object.visible && typeof h.object.userData.key === "string"
        )
      if (hit) onPick(String(hit.object.userData.key))
    }
    renderer.domElement.addEventListener("pointerdown", pointerDown)
    renderer.domElement.addEventListener("pointerup", pick)
    const resize = new ResizeObserver(() => {
      camera.aspect = element.clientWidth / element.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(element.clientWidth, element.clientHeight)
    })
    resize.observe(element)
    renderer.setAnimationLoop(() => {
      controls.update()
      for (const anchor of group.children.filter(
        (child) => child.userData.stop === true
      )) {
        const depth = -anchor.position
          .clone()
          .applyMatrix4(camera.matrixWorldInverse).z
        const unit =
          (2 * depth * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) /
          element.clientHeight
        anchor.quaternion.copy(camera.quaternion)
        anchor.scale.setScalar(unit * (anchor.userData.selected ? 7 : 4))
      }
      for (const label of group.children.filter(
        (child) => child.userData.busLabel === true
      )) {
        const depth = -label.position
          .clone()
          .applyMatrix4(camera.matrixWorldInverse).z
        const unit =
          (2 * depth * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) /
          element.clientHeight
        label.scale.set(unit * 32, unit * 16, 1)
        label.visible = depth > 0
      }
      const occupied: { x: number; y: number; w: number; h: number }[] = []
      const events = group.children
        .filter((child) => child.userData.exchange === true)
        .sort(
          (a, b) => Number(b.userData.priority) - Number(a.userData.priority)
        )
      for (const event of events) {
        const screen = event.position.clone().project(camera)
        const depth = -event.position
          .clone()
          .applyMatrix4(camera.matrixWorldInverse).z
        const unit =
          (2 * depth * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) /
          element.clientHeight
        event.quaternion.copy(camera.quaternion)
        event.scale.setScalar(unit * 6)
        const x = ((screen.x + 1) * element.clientWidth) / 2,
          y = ((1 - screen.y) * element.clientHeight) / 2
        const overlapping = occupied.some(
          (box) => Math.abs(box.x - x) < 240 && Math.abs(box.y - y) < 70
        )
        event.visible =
          depth > 0 &&
          screen.z < 1 &&
          Math.abs(screen.x) < 1.1 &&
          Math.abs(screen.y) < 1.1 &&
          !overlapping
        if (event.visible) occupied.push({ x, y, w: 180, h: 110 })
      }
      renderer.render(scene, camera)
    })
    return () => {
      disposed = true
      dynamic.current = null
      resize.disconnect()
      renderer.setAnimationLoop(null)
      orbit.current = null
      renderer.domElement.removeEventListener("wheel", panWithWheel)
      controls.dispose()
      dispose(scene)
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [routes, network, onPick, cameraVersion])
  useEffect(() => {
    const group = dynamic.current
    if (!group) return
    dispose(group)
    group.clear()
    for (const marker of markers) {
      if (marker.kind === "queue") {
        const active = marker.key === selected
        if (marker.exchange) {
          const exchange = passengerSymbols(marker.exchange)
          exchange.position.set(marker.x, 8, marker.z)
          exchange.userData = {
            exchange: true,
            key: marker.key,
            priority: -marker.exchange.age,
          }
          group.add(exchange)
        }
        const anchor = new THREE.Mesh(
          new THREE.RingGeometry(active ? 0.45 : 0.7, 1, 24),
          new THREE.MeshBasicMaterial({
            color: active ? "#ffffff" : "#b5ccd9",
            depthTest: false,
            side: THREE.DoubleSide,
          })
        )
        anchor.position.set(marker.x, 4, marker.z)
        anchor.userData = { key: marker.key, stop: true, selected: active }
        anchor.renderOrder = 101
        group.add(anchor)
        continue
      }
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 1, 3),
        new THREE.MeshStandardMaterial({
          color:
            network && marker.service
              ? serviceColor(marker.service)
              : marker.estimated
                ? 0xffd269
                : 0xffffff,
        })
      )
      mesh.position.set(marker.x, 5.5, marker.z)
      mesh.rotation.y = marker.heading ?? 0
      const windscreen = new THREE.Mesh(
        new THREE.BoxGeometry(1.15, 0.55, 0.04),
        new THREE.MeshBasicMaterial({ color: 0x102b45 })
      )
      windscreen.position.set(0, 0.12, 1.52)
      windscreen.userData.key = marker.key
      mesh.add(windscreen)
      mesh.userData.key = marker.key
      group.add(mesh)
      if (network && marker.service) {
        const canvas = document.createElement("canvas")
        canvas.width = 120
        canvas.height = 60
        const context = canvas.getContext("2d")
        if (context) {
          context.fillStyle = "#07111f"
          context.fillRect(0, 0, 120, 60)
          context.strokeStyle = serviceColor(marker.service)
          context.lineWidth = 5
          context.strokeRect(3, 3, 114, 54)
          context.fillStyle = "#ffffff"
          context.font = "bold 36px sans-serif"
          context.textAlign = "center"
          context.textBaseline = "middle"
          context.fillText(marker.service, 60, 31)
          const texture = new THREE.CanvasTexture(canvas)
          texture.colorSpace = THREE.SRGBColorSpace
          const label = new THREE.Sprite(
            new THREE.SpriteMaterial({
              map: texture,
              depthTest: false,
              toneMapped: false,
            })
          )
          label.position.set(marker.x, 9, marker.z)
          label.userData = { busLabel: true, key: marker.key }
          label.renderOrder = 106
          group.add(label)
        }
      }
    }
  }, [routes, network, markers, selected, cameraVersion])
  function zoom(factor: number) {
    const controls = orbit.current
    if (!controls) return
    const offset = controls.object.position.clone().sub(controls.target)
    const distance = Math.max(
      controls.minDistance,
      Math.min(controls.maxDistance, offset.length() * factor)
    )
    controls.object.position
      .copy(controls.target)
      .add(offset.setLength(distance))
    controls.update()
  }
  return (
    <div
      className="relative h-[68vh] min-h-96 w-full overflow-hidden rounded-xl border bg-muted"
      ref={host}
    >
      <div
        className="absolute top-3 right-3 z-10 flex flex-col gap-1 rounded-lg border bg-background/95 p-1 shadow-sm"
        role="group"
        aria-label="Map navigation"
      >
        <Button
          size="icon"
          variant="ghost"
          aria-label="Zoom in"
          title="Zoom in"
          onClick={() => zoom(0.8)}
        >
          <Plus />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Zoom out"
          title="Zoom out"
          onClick={() => zoom(1.25)}
        >
          <Minus />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Fit route"
          title="Fit route"
          onClick={() => setCameraVersion((value) => value + 1)}
        >
          <LocateFixed />
        </Button>
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded bg-background/85 px-3 py-2 text-xs text-foreground">
        {cityStatus}
        <br />© OpenStreetMap contributors · OpenFreeMap
      </div>
      {error && (
        <p role="alert" className="p-6">
          {error}
        </p>
      )}
    </div>
  )
}
