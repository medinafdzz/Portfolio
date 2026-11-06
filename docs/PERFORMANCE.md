# SPACEFOLIO performance — 2026-11-06

## Latest: enclosed ship, smooth motion and lower requirements

Baseline `6a48adc` ran in an archived checkout on port 5174; the updated app ran
on 5173. One Chromium instance at a time, 1440×900, identical renderer flags,
8-second warmups and the same CPU sampling windows. **100% CPU means one logical
core**, not the entire computer. Hardware is AMD Radeon(TM) Graphics 0x164E via
Direct3D11; software is explicitly SwiftShader, not a hardware GPU.

| Counter | Before | Current GPU | Current software3D |
| --- | ---: | ---: | ---: |
| Main draw calls | 100 | 42 | 42 |
| Shadow draw calls | 33 | 0 | 0 |
| Main triangles | 217,337 | 144,203 | 32,370 |
| Resident geometries | 101 | 46 | 46 |
| Resident textures | 8 | 6 | 6 |
| Model download bytes | 4,481,244 | 1,201,868 | 870,828 |
| Moon download bytes | 1,053,869 | 35,156 | 35,156 |

All rigid meshes share unlit illumination, with one primitive per part. The
static cabin retains its diffuse-light atlas; moving parts/hull use baked
vertex colors. No realtime lighting, shadow rendering, normal buffers or
unused UV buffers are needed. JPEG86 replaces the embedded PNG, and the Moon
is 512×256. A single Draco worker is terminated after loading. Cached geometries
remain shared across repeated parts and lightweight remounts. The software
variant is simplified at build time, with identical names/pivots; **only one
model variant is requested**, as checked in the browser tests.

| Native sample | Before | Current |
| --- | ---: | ---: |
| Boarding frames in approximately 4 s | 97 | 238 |
| Average boarding frame rate | 24.0FPS | 58.9FPS |
| Boarding aggregate CPU | 6.44% | 8.17% |
| Boarding main-thread CPU | 2.28% | 2.27% |
| Chrome process private bytes | 589,086,720 | 439,668,736 |
| JS heap sample bytes | 18,852,972 | 14,659,564 |

The native path draws 2.45× as many frames, using 25.4% less process private
memory. Aggregate CPU during animation rises 27%; CPU time per rendered frame
falls approximately48%. **This is a fluency/efficiency improvement, not a claim
that active native CPU decreased.** The private-byte sample sums Chrome's
browser/renderer/GPU processes on Windows; it is not a minimum physical-RAM
requirement or a peak-memory guarantee. JS heap excludes GPU/decoded buffers.

| SwiftShader sample | Before | Current |
| --- | ---: | ---: |
| Boarding frames in approximately 4 s | 10 | 120 |
| Boarding aggregate CPU | 520.79% | 575.10% |
| Left-drag aggregate CPU | 986.44% | 316.52% |
| Left-drag frames, same input/settling window | 8 | 29 |
| Chrome process private bytes | 544,129,024 | 393,179,136 |

Software drag uses 67.9% less aggregate CPU while drawing more frames. Boarding
now plays its complete 3.4-second motion instead of the old shortened software
animation; its 12× higher frame count makes the total 4-second CPU sample 10.4%
higher. CPU time per boarding frame falls approximately91%. Software rendering
**still consumes multiple cores while active**. The reduced model improves it
but does not make CPU-only3D appropriate for every weak PC.

All final idle samples in both renderers produced **zero new frames**. Native
idle aggregate CPU was about 0.035–0.061% of one core, software about 0.036–0.047%.
The active caps are 60 FPS native and 30 FPS software, DPR 1/.4. Sustained expensive
drawing can reduce DPR to .5 native/.25 software; the controller measures actual
synchronous draw work, not gaps between input events, and preserves its chosen
DPR through phase/language changes. GSAP sleeps promptly after finite motion.

### Weak-device default

Software rendering, reported RAM ≤2 GiB or ≤2 cores selects the lightweight HTML
view before importing the 3D engine. A persistent explicit user choice can enable
3D. This avoids model, Moon, renderer and decoder requests for the weakest
default profiles while preserving all professional content, six sections and
ES/EN. It is the compatibility path, not a promise of smooth 3D on all hardware.

Production test: 6× CPU throttle, 200KiB/s download, 150ms latency, reported
2-core/2GiB capabilities, SwiftShader. HTML navigation became interactive in
**1.63 seconds**, used a 5.69 MB JS-heap sample, and completed all six sections in
both languages without a Canvas or3D requests. This emulates CPU/network and
capability reporting; it does **not** enforce a physical 2 GiB RAM limit.

Raw evidence: `performance-enclosed-before-{hardware,software}.json`,
`performance-enclosed-final-{hardware,software}.json` and
`enclosed-low-end-performance.json` under ignored `artifacts/`.
The native/CPU measurements cover the final rendering paths before the tiny
return-yaw direction correction; that change was separately regression-tested
and video-checked, with no renderer/asset/budget changes afterward.

## Previous: refined models, manual camera and reversible greeting

Baseline `f63d581` was archived to an isolated folder on port 5174. The updated
app ran on 5173. Measurements used one Chromium instance at a time, 1440×900,
the same launch flags and 8-second warmups. CPU is aggregate browser/renderer/
GPU-process CPU time divided by wall time: **100% equals one logical core**.
The native renderer reports AMD Radeon(TM) Graphics (0x164E), Direct3D11;
the software renderer explicitly reports SwiftShader. This is not an RX 9070 XT
browser benchmark; that GPU was used only for Blender HIP asset generation.

| Scene counter | Previous | Current |
| --- | ---: | ---: |
| Main-pass triangles | 273,646 | 217,337 |
| Main-pass draw calls | 90 | 100 |
| Cached shadow-pass calls | 33 | 33 |
| Resident geometries | 90 | 101 |
| Resident textures | 10 | 8 |
| Draco GLB bytes | 4,522,920 | 4,481,244 |
| Active Earth photo bytes | 718,374 | 0 |

PhoneBase falls from 48,816 to 9,952 triangles; MedalFace from 25,236 to 4,892.
The new sculpted planet adds actual relief instead of photographic maps. The
whole main pass uses 20.6% fewer triangles, while its extra material groups
increase calls by 11.1%. The active download is 760,050 bytes smaller. These
geometry/resource reductions do not imply a proportional CPU reduction.

| Native CPU sample | Previous | Current |
| --- | ---: | ---: |
| Boarding, aggregate, four-second window | 6.06% | 6.33% |
| Boarding, main thread | 2.13% | 2.23% |
| Introduction idle | 0.055% | 0.056% |
| Exploration idle | 0.052% | 0.050% |
| Left-drag orbit, aggregate | unavailable | 5.58% |
| Robot rising, aggregate, four-second window | unavailable | 5.36% |

The native boarding change is small (+4.5% in this sample), not evidence of
another CPU reduction. All measured idle windows, including after orbit and
the repeat greeting, rendered **zero new frames**. Native aggregate idle CPU
ranges from approximately 0.05% to 0.53% of one core across these short windows;
the higher post-interaction samples include finite scheduler settling.

| SwiftShader CPU sample | Previous | Current |
| --- | ---: | ---: |
| Boarding, aggregate, four-second window | 628.77% | 575.13% |
| Boarding, main thread | 1.31% | 1.32% |
| Introduction idle | 0.044% | 0.045% |
| Exploration idle | 0.038% | 0.039% |
| Left-drag orbit, aggregate | unavailable | 987.81% |
| Robot rising, aggregate, four-second window | unavailable | 582.75% |

Software boarding uses 8.5% less aggregate CPU in this run, but **software
rasterization during animation/drag remains expensive** across multiple cores.
Eight orbit frames were drawn in a 1.81-second input-plus-settling window.
Idle windows still draw zero frames. Hardware WebGL is needed for an efficient
interactive 3D experience; the existing lightweight view avoids software 3D
rendering entirely. No claim of near-zero active software CPU is made.

OrbitControls has no damping/auto-rotation/RAF loop. Its change events use the
existing 24 FPS native / 8 FPS software render budget, and panel/programmatic
movement owns the camera until complete. Robot paths and waves finish and
sleep. The 3D view remains paused while the page is hidden. A panel-phase/native
GPU regression was tested separately so software-shortened animations could
not conceal an incomplete camera restore.

Raw results: `artifacts/performance-refinements-{before,after}-{hardware,software}.json`.
`tests/performance.mjs` now samples orbit, repeated greeting and their idle
windows when those controls are present. It asserts zero idle frames. Results
are short controlled samples on this machine, not universal device guarantees.

## Previous: Blender scene with baked lighting (2026-11-05)

The static shell, desk, console and chair now share a 2048² diffuse-light atlas
and use unlit materials. Movable parts retain shared PBR materials and the
existing animation groups. Cached floor contact shadows only include the robot;
self-shadow acne on tiny bevels is avoided. All animations remain finite, and
no loop requests idle frames. The 24 FPS hardware / 8 FPS software budgets and
original pixel ratios were retained for a comparable measurement.

Blender 5.3.0 RC `c956fd684542` generated/baked the original assets using AMD HIP
on the RX 9070 XT, 128 samples. The visitor does not run Blender. The final GLB
is **4,522,920 bytes**, down from 10,354,980 bytes before Draco compression.
Local decoder assets add 250,876 bytes. No remote decoder is requested.

### Comparable before/after results

1440×900; one Chromium instance at a time; 8-second warmups, 3-second idle
samples and the same four-second boarding window. The baseline was archived
from `cdacaa1`, with the existing user header/copy preserved. CPU below is the
sum of browser/renderer/GPU-process CPU time: **100% equals one logical core**.

The hardware run explicitly used Direct3D11 and reported **AMD Radeon(TM)
Graphics (0x164E)**, the integrated GPU. It was not the RX 9070 XT used for
asset baking. The default headless renderer and the software run reported
SwiftShader, so those are never labelled hardware measurements.

| Counter, final exploration frame | Before | After |
| --- | ---: | ---: |
| Main-pass draw calls | 269 | 90 |
| Shadow-pass draw calls | 223 | 33 |
| Main-pass triangles | 169,742 | 273,646 |
| Shadow-pass triangles | 120,616 | 37,316 |
| Resident geometries | 277 | 90 |
| Resident textures | 9 | 10 |

Main-pass triangles increased **61.2%**, while draw calls fell **66.5%**.
The render instrument measures the shadow pass separately rather than counting
its triangles as additional model geometry.

| CPU sample | Before | After |
| --- | ---: | ---: |
| Hardware: boarding aggregate | 11.64% | 7.17% |
| Hardware: boarding main thread | 4.47% | 2.57% |
| Hardware: introduction idle | 0.062% | 0.069% |
| Hardware: exploration idle | 0.054% | 0.057% |
| SwiftShader: boarding aggregate | 640.63% | 617.33% |
| SwiftShader: boarding main thread | 2.67% | 1.61% |

The final hardware sample uses **38.4% less aggregate CPU during boarding**.
The baseline rendered 96 boarding frames in hardware and the final model 97;
both rendered 11 in software. An earlier after-sample measured 5.84% aggregate
hardware CPU (49.9% reduction). These are short local measurements with variance,
not a universal device guarantee.
All measured idle windows produced **zero new frames**.

Software rendering still has high aggregate CPU during movement. After-samples
ranged from 617.33% to 649.50%, against 640.63% initially, so no reliable aggregate
software-CPU improvement is claimed. The higher polygon
count is intended for GPU rendering. The main-thread reduction and unchanged
software frame budget do not make CPU rasterisation inexpensive. Loading and
shader/decoder startup may also have peaks. Use the lightweight view when
hardware WebGL is unavailable and continuous interaction is too costly.

Raw local evidence: `artifacts/performance-baked-before.json`,
`performance-baked-after.json`, `performance-baked-before-hardware.json`,
`performance-baked-after-hardware.json`, `performance-baked-final.json`,
`performance-baked-final-hardware.json`, and their intro/explore captures.

Reproduce with `node tests/performance.mjs <label> <dev-url> <mode>`, where mode
is `software`, `default` or `hardware`. Separate labels preserve old results.

## Earlier on-demand rendering revision (historical)

The earlier `frameloop="always"` rendered the entire cabin and its shadow pass
continuously. Robot idle motion and the suspended medal kept changing every frame.
This was expensive even when visitors did nothing. Hover lights also changed
shader light counts, and switching motion modes added/removed another light.

## Changes

- All motion modes now use on-demand rendering, with no self-scheduling idle loop.
- Finite GSAP transitions explicitly request frames through one coalescing budget.
  A hardware GPU gets at most 24 scheduled animation frames per second.
- Shadows are cached and refreshed at completed poses, rather than on each frame.
- Greeting, receiver, gear and medal feedback finish and stop requesting frames.
- Following the pointer only creates short head tweens on hardware; no software
  rasterizer head-follow loop. Hover feedback uses materials instead of new lights.
- Software WebGL (SwiftShader/llvmpipe) gets 8 FPS, DPR 0.8, 512-pixel shadows,
  and one-quarter animation durations. This reduces quality/fluency deliberately
  on CPU rendering; the HTML interface and content keep native text resolution.
- Rounded sphere/cylinder tessellation is reduced without replacing the models.
- Visibility changes cancel pending render timers. Geometry cleanup is retained.

The speech bubble is projected from the robot's right ear on rendered frames.
The medal is framed above the roadmap on the left wall. The logbook is on a
physical lectern, and the command monitor has a separate base and supports.
Browser assertions check both objects' minimum world height above the desk and
the gap between the speech tail and the actual projected ear.

## Controlled measurement

`node tests/performance.mjs before http://127.0.0.1:5174/` measured the previous
committed version in a separate archived checkout. The same script with `after`
measured the updated app on port 5173. One browser at a time, Chromium/SwiftShader,
1440×900, identical flags, 8-second shader/GPU warmup before each idle sample.

CPU is the CDP sum of browser, renderer and GPU-process CPU-time deltas divided
by wall time. **100% means one logical CPU core**, so a multi-threaded software
rasterizer can report over 100%. These figures are not percentages of the whole
machine and are not a hardware-GPU benchmark.

| Sample | Previous CPU | Updated CPU | Previous/new frames |
| --- | ---: | ---: | ---: |
| Introduction idle, motion enabled, 3 s | 1376.97% | 0.057% | 13 / 0 |
| Boarding, 4 s window | 1319.14% | 578.19% | 14 / 11 |
| Exploration idle, motion enabled, 3 s | 1344.33% | 0.041% | 13 / 0 |

The sustained idle reduction is over 99%; the boarding window uses about **56%
less aggregate CPU**. Main-thread boarding CPU falls from 68.29% to 3.19%.
The software path also deliberately shortens boarding. This is a reduction in
work over the measured window, not a claim that instantaneous software-rendering
peaks disappear. Loading and software shader compilation can still cause peaks.

Raw evidence is in local Git-ignored `artifacts/performance-before.json` and
`artifacts/performance-after.json`. Unit tests cover coalescing, frame caps and
timer cancellation; browser tests assert zero new idle frames with motion enabled,
including when the technologies panel is open.
