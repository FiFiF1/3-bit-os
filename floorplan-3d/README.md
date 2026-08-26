# Floor Plan 3D Replica

Interactive furnished 3D recreation of the CubiCasa house floor plan.

## Run

Serve the folder over HTTP (ES modules require a local server):

```bash
cd floorplan-3d
python3 -m http.server 8765
```

Open `http://localhost:8765`.

## Controls

- Drag to orbit, scroll to zoom, right-drag to pan
- **Orbit** / **Top view** camera presets
- **Labels** toggles room names and door notes
- **Roof** toggles a translucent roof

## Contents

- `index.html` — UI shell
- `main.js` — Three.js scene, walls, rooms, lighting
- `furniture.js` — beds, baths, kitchen, living, dining, laundry, garage
- `source-plan.jpg` — original annotated floor plan
