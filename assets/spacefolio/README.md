# SPACEFOLIO source assets

Original models generated for this portfolio. No meshes, textures or character
assets from the reference room are redistributed here. Planet maps retain their
existing attribution under `public/textures/ATTRIBUTION.md`.

Tool verified: Blender 5.3.0 Release Candidate, build `c956fd684542`.
Both CPU and AMD HIP (Radeon RX 9070 XT) baking/export passed a small pipeline
test. Blender is a build-time tool; the website only loads the resulting GLB.

Build command and model manifest are maintained alongside `build.py`.

Performance: `node tests/performance.mjs <label> http://127.0.0.1:5173/ <mode>`.
Modes are `software`, `default`, `hardware`. Reports record the actual renderer,
separate main/shadow passes, resource sizes and aggregate process CPU; 100% is
one logical core. Software results must never be labelled hardware GPU results.
