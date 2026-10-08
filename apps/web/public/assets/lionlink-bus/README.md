# LionLink bus

`lionlink-bus.glb` is the original Blender export from
`codex/lionlink-live-mvp` at commit `f7d5dc817883b4f2400a979044ba20153efd46b4`.
The file is byte-for-byte identical to that branch's
`apps/web/public/assets/lionlink-bus/lionlink-bus.glb`.

SHA-256: `fe7eacedcab3abab53a52a9c618b4f298492f175de614386d7093be256c38689`.

The scheduled-service and historical replay maps use this double-deck model
as an illustrative vehicle marker, not a statement about a vehicle's actual body type.
The renderer preserves the materials, turns the model's front from -X to +Z,
and scales its length to six map units for visibility. Route headings then rotate
that normalized model. The wheels sit above the route layer. A position ring and heading arrow remain
visible while the model loads or if the download fails. Single-service maps use
amber for estimated positions and white for recorded dwell. Network maps retain
service colours on the rings and labels. Fit route resets the camera without
reloading the model.

`BusFleet` owns one set of geometry and materials per map. Instanced meshes
share those resources across vehicles. Marker updates change the instance
transforms; closing the map releases the resources. Cloning the full model per
vehicle was rejected because each clone would add a separate draw for every part.
The detailed asset adds a roughly 4.5 MB download compared with the old box marker.

Run `pnpm --filter web exec vitest run __tests__/service-replay-bus.test.ts`
to check the actual model's orientation, ground clearance, selection after movement,
and resource lifetime.

## Repair schematic

`lionlink-maintenance.glb` is the part-labelled asset from the same source commit.
It is byte-for-byte identical to that branch asset.

SHA-256: `c49b997f846df87bef391ef4b3cb0a401fee98894fdbf422511f3a9515e112d8`.

The manual repair dialog loads this roughly 3.9 MB asset on demand. Its part IDs
allow door and system-area highlights without changing the route-map asset.
`RepairModel` owns the scene and disposes its geometry, materials, textures,
controls, and renderer when closed or replaced.
