# SPACEFOLIO verification — 2026-11-05

Repository: `C:\Users\suso1\VS code\Portfolio`.
Branch: `feature/spacefolio`. No push or production deployment was performed.

## Executed checks

| Check | Result | Evidence |
| --- | --- | --- |
| ESLint | PASSED | `npm.cmd run lint`, no errors |
| Production build | PASSED | Vite 7.3.7, lazy Three.js scene chunk |
| Navigation unit tests | PASSED | 3 tests; duplicate starts, six sections, stale/invalid events |
| Browser suite | PASSED | 12 Playwright tests, 5.2 minutes, Chromium/SwiftShader |
| Production smoke | PASSED | Built app at localhost:4173, real Canvas, Enter, Projects and Escape |
| Git whitespace | PASSED | `git diff --check` |
| Visual detector | PASSED | No findings in the changed interface |
| Original content | PASSED | No diff in translations, CV, CNAME or Vercel configuration |
| External links | PASSED | Eight original URLs returned HTTP 200 to HEAD requests |
| Runtime dependency audit | PASSED | Zero production vulnerabilities reported by npm |

The production smoke captured **zero console errors**. Three.js emits one
deprecation warning about the Clock API used by the renderer; this does not
prevent rendering. Vite reports the expected large optional WebGL chunk:
about 1.04 MB minified / 291 KB gzip, loaded separately from the HTML interface.

The complete dependency audit still reports **four moderate development-only
advisories**, originating from ESLint's minimatch chain. Safe npm fixes were
applied. The audit proposes a major ESLint downgrade for the remaining items;
that toolchain change was not forced. There are no reported high or critical
advisories after the safe updates. JSON audit evidence is in `artifacts/`.

## Browser coverage

The suite checks all six sections, both ES/EN content variants, three featured
project selectors and original repository links. It exercises each 3D object
through actual raycasting, not just the HTML menu. It verifies one guarded
introduction, the seated robot's position/rotation, focus restoration and focus
containment, Escape, reduced motion, lightweight remount, unavailable WebGL,
lost-context fallback, actual touch-enabled input, the CV's PDF signature and
local planet assets. Axe reported no violations in the checked six ES panels
and the complete fallback interface.

Desktop: 1440×900 and 1920×1080. Tablet: 768×1024 and 1024×768.
Mobile: 390×844 and 430×932. No horizontal overflow was observed in these views.

A repeated-navigation check opens/closes twelve sections and bounds GPU
geometry growth. The final instrumented sample contained 271 geometries,
486 draw calls and 359030 triangles. These are scene counters, not a real-device
frame-rate benchmark. Source review independently verified geometry disposal
and the robot's one-shot boarding lifecycle.

## Real captures

Captures are local, Git-ignored files produced by Chromium, not generated images:

- `artifacts/production-intro.png`
- `artifacts/production-explore.png`
- `artifacts/production-section.png`
- `artifacts/desktop-large-intro.png` and `desktop-large-explore.png`
- `artifacts/tablet-portrait-explore.png` and `tablet-landscape-explore.png`
- `artifacts/mobile-intro.png`, `mobile-explore.png`, `mobile-section.png`
- `artifacts/mobile-large-explore.png`
- `artifacts/webgl-fallback.png`

The full interactive Playwright report is `artifacts/playwright-report/index.html`.
Production smoke and link results are in `production-smoke.json` and
`external-links.json` in the same artifact directory.

After the functional suite, a CSS-only adjustment moved and compacted the intro
dialog to keep the console and wall phone visible. The production build and smoke
were rerun, and the affected desktop/tablet intro compositions were recaptured
in both ES and EN; the mobile intro was also inspected. Functional JavaScript
was unchanged after the twelve-test suite.

## Limits of verification

The cabin is an original procedural interpretation of the reference, with its
object order and two visual states preserved. It is not a pixel-exact render.
Portrait framing intentionally uses the HTML menu for lateral objects.

Physical mobile GPUs, Safari, Firefox and an actual deployment were not tested.
HTTP success for LinkedIn does not validate authenticated account behavior.
No email was sent, and no external profile or repository was modified.

## Reproduce

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
npx.cmd playwright install chromium
npm.cmd run test:e2e
git diff --check
```

With `npm.cmd run preview -- --host 127.0.0.1` running, execute
`node tests/production-smoke.mjs` for the built-app capture and console check.
`node tests/check-links.mjs` repeats the external HEAD checks.
