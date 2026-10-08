"use client"

import { useEffect, useRef, useState } from "react"
import { repairAreaSchema, type RepairArea } from "@/lib/repairs/schema"

export function RepairModel({ areas }: { areas: RepairArea[] }) {
  const host = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState("Loading bus model…")
  const selection = areas.join(",")
  const active = useRef<RepairArea[]>(areas)
  const update = useRef<((areas: RepairArea[]) => void) | null>(null)
  useEffect(() => {
    active.current = repairAreaSchema.options.filter((id) =>
      selection.split(",").includes(id)
    )
    update.current?.(active.current)
  }, [selection])
  useEffect(() => {
    const container = host.current
    if (!container) return
    let disposed = false
    let cleanup = () => {}
    const load = async () => {
      try {
        const THREE = await import("three")
        const [{ OrbitControls }, { GLTFLoader }, { RepairBus }] =
          await Promise.all([
            import("three/addons/controls/OrbitControls.js"),
            import("three/addons/loaders/GLTFLoader.js"),
            import("./repair-bus"),
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
          "Repair area schematic. Drag to rotate and scroll to zoom."
        )
        container.append(renderer.domElement)
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 150)
        camera.position.set(-13, 8, 18)
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.target.set(0, 2, 0)
        controls.enablePan = false
        controls.minDistance = 10
        controls.maxDistance = 40
        controls.update()
        scene.add(new THREE.HemisphereLight(0xffffff, 0x82917b, 2.8))
        const light = new THREE.DirectionalLight(0xffffff, 3)
        light.position.set(-5, 12, 8)
        scene.add(light)
        const render = () => renderer.render(scene, camera)
        const resize = () => {
          const width = Math.max(1, container.clientWidth)
          const height = Math.max(1, container.clientHeight)
          renderer.setSize(width, height, false)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
          render()
        }
        let bus: InstanceType<typeof RepairBus> | undefined
        const observer = new ResizeObserver(resize)
        observer.observe(container)
        controls.addEventListener("change", render)
        cleanup = () => {
          observer.disconnect()
          controls.dispose()
          bus?.dispose()
          scene.clear()
          update.current = null
          renderer.dispose()
          renderer.forceContextLoss()
          renderer.domElement.remove()
        }
        resize()
        const model = await new GLTFLoader().loadAsync(
          "/assets/lionlink-bus/lionlink-maintenance.glb"
        )
        bus = new RepairBus(model.scene, active.current)
        if (disposed) {
          bus.dispose()
          return
        }
        scene.add(bus)
        update.current = (areas) => {
          bus?.setAreas(areas)
          render()
        }
        render()
        setStatus("")
      } catch {
        cleanup()
        if (!disposed)
          setStatus(
            "3D view unavailable. Repair area descriptions and evidence remain available below."
          )
      }
    }
    void load()
    return () => {
      disposed = true
      cleanup()
    }
  }, [])
  return (
    <div className="relative h-64 overflow-hidden rounded-xl border bg-muted/40 sm:h-80">
      <div ref={host} className="h-full w-full" />
      {status && (
        <p
          role="status"
          className="absolute inset-x-3 top-3 rounded-lg bg-card/95 p-3 text-sm"
        >
          {status}
        </p>
      )}
      <p className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-card/90 px-2 py-1 text-xs">
        Drag to rotate · Scroll to zoom
      </p>
    </div>
  )
}
