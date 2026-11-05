# SPACEFOLIO CPU and placement corrections — 2026-11-05

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
