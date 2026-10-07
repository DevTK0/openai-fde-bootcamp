# LionLink Planning Studio

Offline, browser-based hackathon prototype for passenger-demand-led bus planning and allocation. It covers the four workflows in the workspace's `planning-workflows.md`: new route, existing-route optimisation, maintenance disruption, and onward connection.

## Open the prototype

From the `openai bootcamp` folder, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8000/planning-mvp/>. The browser app has no build step, account, network connection, or third-party runtime dependency. `snapshot.js` is a compact local extract generated from the supplied candidate records.

## What it demonstrates

- Four scenario selectors with scenario-specific workflow checklists and controls.
- A demand/capacity outlook, illustrative options, service/resource trade-offs, and planner approval state.
- Editable planning assumptions; the approval button marks the current plan for prototype review and does not dispatch anything.
- A data-scope dialog and in-page notice distinguishing sample records from assumptions.
- An interactive 3D route view with selectable stops and an illustrative bus-position scrubber.
- Optional stop overlays for daily observed boarding volume and prior-day late-arrival share.

## Interactive 3D route view

The Planning Studio includes an offline canvas viewer. Drag in the scene to orbit, scroll to zoom, click a stop marker to inspect its sequence and route distance, and scrub the slider to move the low-poly bus along the selected route. The route selector updates the 3D path.

The map can scale stop markers by observed boarding events for the selected date and draw an orange ring from earlier stop-call arrivals that were at least one minute late. The selected-stop panel shows the call count and late share. Counts are boarding events, not distinct passengers. This is an operational lateness proxy; supplied data does not establish route-linked breakdown probabilities, so the map does not infer or display breakdown risk. The overlay source is `Data/lionlink-operations-network-candidate/data/stop_calls.csv`; rebuild its compact browser extract with `python3 planning-mvp/visualization/build_stop_overlay_data.py`.

The 3D route scene includes a multi-select route picker; each selected route gets its own moving bus in a shared map frame. It also includes an animated proposed transfer, passenger hotspots, average stop-level departure load coloring, a shared morning scrubber, before/after and allocation display modes, and an optional one-bus outage replay. The disruption estimate is a scenario based on the current assumed headway; it is not a live vehicle assignment or actual departure prediction. Stop selection shows observed boardings, prior late-call sample, and average onboard load versus stated capacity.

Blender authors the low-poly bus model and the companion scene. The route paths and ordered stop positions come from the retained selected Singapore map data. The browser view uses the local generated JavaScript assets and adds no network dependency. Bus position is illustrative, not GPS; passenger demand and operating records remain synthetic.

Generated assets are in `visualization/`:

- `lionlink-route-view.blend` — editable Blender scene for B238_1.
- `route-preview.png` — rendered static overview of the Blender scene.
- `route-data.js` and `bus-model.js` — local data and Blender mesh used by the interactive browser view.
- `build_blender_assets.py` — rebuilds the scene and generated assets from the retained map files.

To rebuild the scene on macOS with Blender installed:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --python visualization/build_blender_assets.py
```

## Data and limitations

`snapshot.js` was derived from `Data/lionlink-operations-network-candidate/data/`:

- Route names, directions, terminal stop identifiers, and service patterns.
- Synthetic five-minute origin arrival batches grouped by date and route.
- Synthetic route-position queue window aggregates.
- Dated released-vehicle and crew-duty counts.

The extract covers the supplied fictional exercise dates, not a live operator. Demand is an observed sample roll-up multiplied by an editable scenario uplift; it is not a trained or validated forecast. Network-wide fleet counts do not establish spare buses. Options are illustrative and do not perform a complete schedule, crew, depot-location, donor-route, or onward-journey feasibility check. Confirm service targets, costs, accessibility, and allocation rules with the client before using any recommendation operationally.
