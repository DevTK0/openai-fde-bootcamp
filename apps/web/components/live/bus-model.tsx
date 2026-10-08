"use client"
import { useEffect, useRef, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { PARTS } from "./bus-parts"
import { cameraDistanceScale } from "./bus-camera"
export function BusModel({
  partIds,
  vehicleId,
  service,
  className,
}: {
  className?: string
  partIds: string[]
  vehicleId: string
  service: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const selection = partIds.join(",")
  const active = useRef(partIds)
  const update = useRef<(() => void) | null>(null)
  const identity = useRef({ vehicleId, service })
  const [status, setStatus] = useState("Loading LionLink model…")
  useEffect(() => {
    active.current = selection.split(",").filter(Boolean)
    identity.current = { vehicleId, service }
    update.current?.()
  }, [selection, vehicleId, service])
  useEffect(() => {
    const container = host.current
    if (!container) return
    let disposed = false,
      cleanup = () => {}
    async function load() {
      try {
        const THREE = await import("three")
        const [{ OrbitControls }, { GLTFLoader }] = await Promise.all([
          import("three/addons/controls/OrbitControls.js"),
          import("three/addons/loaders/GLTFLoader.js"),
        ])
        if (disposed) return
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.domElement.className = "h-full w-full touch-none"
        renderer.domElement.setAttribute(
          "aria-label",
          "LionLink bus model. Drag to orbit and scroll to zoom; highlighted areas come from the selected assessment."
        )
        container!.append(renderer.domElement)
        const scene = new THREE.Scene(),
          camera = new THREE.PerspectiveCamera(36, 1, 0.1, 150)
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enablePan = false
        controls.minDistance = 10
        controls.maxDistance = 45
        controls.target.set(0, 2, 0)
        camera.position.set(-13, 8, 18)
        controls.update()
        scene.add(new THREE.HemisphereLight(0xf7fff1, 0x82917b, 2.8))
        const light = new THREE.DirectionalLight(0xffffff, 3)
        light.position.set(-5, 12, 8)
        scene.add(light)
        const resize = () => {
          const w = container!.clientWidth,
            h = container!.clientHeight
          renderer.setSize(w, h, false)
          camera.aspect = w / h
          camera.updateProjectionMatrix()
          renderer.render(scene, camera)
        }
        const observer = new ResizeObserver(resize)
        observer.observe(container!)
        const render = () => renderer.render(scene, camera)
        controls.addEventListener("change", render)
        const meshes: import("three").Mesh[] = []
        const signs: {
          id: string
          canvas: HTMLCanvasElement
          texture: import("three").CanvasTexture
        }[] = []
        const release = (root: import("three").Object3D) =>
          root.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.geometry.dispose()
              for (const material of [object.material].flat()) {
                if ("map" in material)
                  (material.map as import("three").Texture | null)?.dispose()
                material.dispose()
              }
            }
          })
        cleanup = () => {
          observer.disconnect()
          controls.dispose()
          release(scene)
          renderer.dispose()
          renderer.domElement.remove()
          update.current = null
        }
        resize()
        const gltf = await new GLTFLoader().loadAsync(
          "/assets/lionlink-bus/lionlink-maintenance.glb"
        )
        if (disposed) {
          release(gltf.scene)
          return
        }
        gltf.scene.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return
          object.material = Array.isArray(object.material)
            ? object.material.map((m) => m.clone())
            : object.material.clone()
          let ancestor: import("three").Object3D | null = object
          while (ancestor && !ancestor.userData.part_id)
            ancestor = ancestor.parent
          object.userData.part_id = ancestor?.userData.part_id
          for (const material of [object.material].flat())
            if ("emissive" in material) {
              material.userData.baseEmissive = (
                material.emissive as import("three").Color
              ).clone()
              material.userData.baseIntensity = material.emissiveIntensity
            }
          if (String(object.userData.part_id).startsWith("display_")) {
            const canvas = document.createElement("canvas")
            canvas.width = 1024
            canvas.height = 160
            const texture = new THREE.CanvasTexture(canvas)
            texture.colorSpace = THREE.SRGBColorSpace
            texture.flipY = false
            for (const material of [object.material].flat()) material.dispose()
            object.material = new THREE.MeshBasicMaterial({
              map: texture,
              side: THREE.DoubleSide,
              toneMapped: false,
            })
            signs.push({ id: object.userData.part_id, canvas, texture })
          }
          meshes.push(object)
        })
        scene.add(gltf.scene)
        update.current = () => {
          const parts = active.current
            .map((id) => PARTS[id])
            .filter((part) => !!part)
          const part = parts[0]
          for (const mesh of meshes)
            for (const material of [mesh.material].flat())
              if (material instanceof THREE.MeshStandardMaterial) {
                material.emissive.copy(
                  material.userData.baseEmissive ?? new THREE.Color(0)
                )
                material.emissiveIntensity =
                  material.userData.baseIntensity ?? 1
                if (
                  parts.some((area) =>
                    area.nodes.includes(mesh.userData.part_id)
                  )
                ) {
                  material.emissive.set(0xff8c32)
                  material.emissiveIntensity = 0.85
                }
              }
          for (const sign of signs) {
            const ctx = sign.canvas.getContext("2d")!
            ctx.fillStyle = "#122d25"
            ctx.fillRect(0, 0, 1024, 160)
            ctx.fillStyle = "#d6eaa6"
            ctx.font = "bold 90px Arial"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(
              sign.id.includes("fleet")
                ? identity.current.vehicleId
                : identity.current.service === "network"
                  ? "—"
                  : identity.current.service,
              512,
              80,
              960
            )
            sign.texture.needsUpdate = true
          }
          const views: Record<string, [number, number, number]> = {
            doors: [-10, 5, 13],
            front: [-22, 5, 3],
            rear: [19, 7, 14],
            right: [-10, 5, -13],
            roof: [-10, 19, 13],
          }
          camera.position
            .set(...(views[part?.view ?? "doors"] ?? views.doors!))
            .multiplyScalar(cameraDistanceScale(camera.aspect))
          controls.update()
          render()
        }
        update.current()
        setStatus("")
      } catch {
        if (!disposed) {
          cleanup()
          setStatus(
            "3D view is unavailable in this browser. Repair records and area descriptions remain available."
          )
        }
      }
    }
    void load()
    return () => {
      disposed = true
      cleanup()
    }
  }, [])
  return (
    <div
      className={cn(
        "relative h-80 overflow-hidden rounded-xl border bg-muted/40 sm:h-[400px]",
        className
      )}
    >
      <div ref={host} className="h-full w-full" />
      {status && (
        <p
          role="status"
          className="absolute inset-x-4 top-4 rounded-lg bg-card/95 p-3 text-sm"
        >
          {status}
        </p>
      )}
      <p className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-card/90 px-2 py-1 text-xs text-muted-foreground">
        Drag to orbit · Scroll to zoom
      </p>
    </div>
  )
}
