import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const readJSON = async (name) =>
  JSON.parse(await readFile(new URL(name, import.meta.url), "utf8"))

async function readGLB(name) {
  const bytes = await readFile(new URL(name, import.meta.url))
  assert.equal(bytes.toString("ascii", 0, 4), "glTF", `${name}: magic`)
  assert.equal(bytes.readUInt32LE(4), 2, `${name}: version`)
  assert.equal(bytes.readUInt32LE(8), bytes.length, `${name}: length`)
  assert.equal(bytes.readUInt32LE(16), 0x4e4f534a, `${name}: JSON chunk`)
  const jsonEnd = 20 + bytes.readUInt32LE(12)
  const gltf = JSON.parse(bytes.subarray(20, jsonEnd).toString())
  assert.equal(
    bytes.readUInt32LE(jsonEnd + 4),
    0x004e4942,
    `${name}: BIN chunk`
  )
  assert.equal(jsonEnd + 8 + bytes.readUInt32LE(jsonEnd), bytes.length)
  assert.equal(gltf.buffers.length, 1)
  assert.equal(gltf.buffers[0].uri, undefined, "Buffer must be embedded")
  assert.ok(gltf.buffers[0].byteLength <= bytes.readUInt32LE(jsonEnd))
  assert.equal(gltf.cameras?.length || 0, 0)
  assert.equal(gltf.extensions?.KHR_lights_punctual, undefined)
  assert.ok(
    !gltf.nodes.some((node) => /studio|softbox|camera/i.test(node.name))
  )
  return { gltf, bytes }
}

const staticAsset = await readGLB("lionlink-bus.glb")
const staticInfo = await readJSON("asset-info.json")
assert.equal(staticAsset.bytes.length, staticInfo.glb_bytes)
const { gltf, bytes } = await readGLB("lionlink-maintenance.glb")
const info = await readJSON("interactive-asset-info.json")
const { parts } = await readJSON("components.json")
assert.equal(bytes.length, info.glb_bytes)
const ids = new Set(
  gltf.nodes.map((node) => node.extras?.part_id).filter(Boolean)
)
assert.deepEqual([...ids].sort(), info.component_ids)
for (const [name, part] of Object.entries(parts)) {
  assert.equal(part.anchor.length, 3, `${name}: anchor coordinates`)
  assert.ok(part.anchor.every(Number.isFinite))
  for (const id of part.nodes) assert.ok(ids.has(id), `${name}: missing ${id}`)
  if (part.approximate)
    assert.ok(part.note, `${name}: explain approximate area`)
}
assert.equal(info.sign_ids.length, 7)
for (const id of info.sign_ids) {
  const surfaces = gltf.nodes.filter(
    (node) => node.extras?.part_id === id && node.mesh !== undefined
  )
  assert.equal(surfaces.length, 1, `${id}: one sign surface`)
  for (const primitive of gltf.meshes[surfaces[0].mesh].primitives) {
    assert.notEqual(primitive.attributes.TEXCOORD_0, undefined, `${id}: UVs`)
  }
}
console.log(`Validated both GLBs, ${ids.size} component IDs, and seven signs.`)
