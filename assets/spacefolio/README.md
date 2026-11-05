# SPACEFOLIO source assets

Original models generated for this portfolio. No meshes, textures or character
assets from the reference room are redistributed here. Planet maps retain their
existing attribution under `public/textures/ATTRIBUTION.md`.

Tool verified: Blender 5.3.0 Release Candidate, build `c956fd684542`.
Both CPU and AMD HIP (Radeon RX 9070 XT) baking/export passed a small pipeline
test. Blender is a build-time tool; the website only loads the resulting GLB.

Rebuild from the repository root:

```powershell
node assets/spacefolio/build.mjs "<absolute path to blender.exe>" --device HIP --samples 128 --preview
node --test tests/model-assets.test.mjs
```

`build.mjs` exports the live web coordinates/palette from `config.js`; there is
no second hand-maintained position table. Use `--device CPU` if HIP is unavailable.
The generation temporarily uses the GPU/CPU; it does not add work to idle web
pages. `--preview` writes an authoring render to ignored `artifacts/`.

Outputs: editable `scene.blend`, `cabin-light.png` (2048² diffuse illumination),
`manifest.json` (tool version, samples, geometry and source configuration), and
`public/models/spacefolio.glb`. The GLB parts use local coordinates and stable
names so React retains the animation pivots. The saved Blender source is laid
out in the actual cabin arrangement for editing. It deliberately omits web-only
planet maps, screen text and HTML; inspect final web captures for those elements.

Only CabinShell, ConsoleBody and Chair are light-baked. Animated models are
excluded from the bake and use shared PBR materials. The three static nodes
share one atlas exported with KHR_materials_unlit to avoid double lighting.

Geometry is exported with Draco (level 6, position 14 bits, normal 12 bits, UV
16 bits). The final GLB is 4,522,920 bytes instead of 10,354,980 uncompressed.
The unmodified decoder is served from `public/draco/` with its Apache license;
two workers bound decode concurrency. This is loading-time compression, not
an ongoing rendering effect. No additional npm dependency is required.

Performance: `node tests/performance.mjs <label> http://127.0.0.1:5173/ <mode>`.
Modes are `software`, `default`, `hardware`. Reports record the actual renderer,
separate main/shadow passes, resource sizes and aggregate process CPU; 100% is
one logical core. Software results must never be labelled hardware GPU results.
