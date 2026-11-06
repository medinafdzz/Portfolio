# SPACEFOLIO verification — 2026-11-06

Repository: `C:\Users\suso1\VS code\Portfolio`.
Branch: `feature/spacefolio-interactive-cabin`.

## Model, camera and robot refinements

The current GLB has a circular gold medal with a Satoshi numeral, a red wall
telephone with separate curved receiver/keypad/coil, and a sculpted mini-Earth
with raised coasts, mountains, forests, desert, rivers and clouds. Experience
is at Y=3.8 with a rear arm/clamp attached to the window frame. Other object
placements and professional content remain as before. The editable source and
128-sample HIP build are retained; `manifest.json` records the exact geometry.

Latest full run: **21/21 Playwright tests passed in 4.0 minutes**, plus **8/8 Node
tests**, lint, production build and whitespace checks. The built-app smoke used
the actual Vercel CSP: local Draco/embedded textures loaded, six existing
navigation targets remained valid, boarding/orbit/reset/repeated ES/EN greeting
worked, and there were zero console errors. The smoke physically clicks the
rocket; the full suite physically clicks all six objects. Eight external HEAD
checks returned HTTP 200. No message/email was sent.

New coverage includes left orbit, right pan, wheel, user-pose restoration,
360px one-finger orbit/two-finger pinch-pan, reset, click-versus-drag guards,
three animated robot cycles, rapid clicks, Enter, language changes, lightweight
remount/animation cancellation and zero rendered idle frames. The existing
suite covers all six sections in ES/EN, actual rendered Satoshi glyphs, axe,
focus trapping/restoration, unavailable/lost WebGL, CV and bounded resources.

A fresh independent review found camera tweens were cancelled by the earlier
panel phase timers on the native GPU path. The new native-D3D11 test was seen
failing before the fix, then passing. It checks full focus/restoration and
resize to tablet portrait. Manual pan bounds now apply only during manual
interaction; saved framing is discarded after a viewport resize. The reviewer
rechecked the final fix and found no further blocking issue. A separate
regression caught residual walking-leg angles after reversing; both joints
now settle to explicit endpoint poses.

Browser captures inspected: intro/explore at 1440×900 and 1920×1080, tablet
768×1024/1024×768, mobile 360×800/390×844/430×932, diagonal camera, repeated
greeting, and the served robot favicon at 16/32px on light/dark backgrounds.
Evidence: `artifacts/refinements-full-suite.log`, `production-smoke.json`,
`refinements-external-links.json`, `refined-camera-diagonal.png`,
`refined-host-greeting.png`, `refined-favicon-sizes.png` and the responsive
screenshots. See PERFORMANCE.md for measured resource/CPU results.

Limits: touch input was emulated in Chromium, not tested on a physical phone.
Safari/Firefox remain untested. Portrait framing intentionally uses the
lightweight view's HTML menu for lateral objects. Three/R3F emits an existing
Clock deprecation warning; Vite reports the lazy 3D bundle exceeds 500 kB.
Neither warning is a failed build or runtime error.

The following sections retain the previous implementation's verification
history; their branch, byte counts and older delivery limits are historical.

## Baked Blender scene — previous revision (2026-11-05)

The complete implementation plan is
`docs/superpowers/plans/2026-11-05-spacefolio-baked-scene.md`. The editable Blender
source, generator, 2048² light atlas and manifest are in `assets/spacefolio/`.
The local GLB contains named articulated parts and a Draco-compressed static
shell with unlit baked illumination. It is 4,522,920 bytes. Six fixed, invisible
box hitboxes replace triangle picking on detailed meshes; they are checked by
actual 3D clicks. The raised lectern now has a lower world bound above 2.08.

Blender CPU and AMD HIP baking/export were exercised. The generated GLB was
checked for named parts, UVs, embedded textures, compression and unlit material;
its images and decoder load under actual dev CSP and the stricter Vercel policy
applied to the production build. No CSP bypass or external decoder is used.

The browser coverage includes exclusive actual-glyph Satoshi rendering in ES/EN,
six real 3D targets, finite robot boarding, physical feedback, ear anchoring,
book/console/lectern clearance, keyboard and reduced motion, context-loss and
WebGL fallback, touch, local CV/assets, focus and axe checks. Repeated navigation
retained a stable 90 geometries; the GLB cache also survives lightweight remounts.
The first full run exposed an outdated hardcoded English footer assertion after
the user's local bilingual copy edits. The assertion now checks the canonical
ES translation, preserving the user's copy. All five affected cases passed.
Both the lectern clearance and proxy-selection checks were observed failing
before their fixes, then passing with the final model.

After the final regenerated GLB and proxy pass, the **entire 16-test browser
suite passed in one run (3.4 minutes)**. Its HTML report is in
`artifacts/playwright-report/index.html`; full output is
`artifacts/baked-e2e-final.log`. An additional text-range check passed 14 fallback
states, ES/EN at 360–1920px (`artifacts/baked-final-layout.json`), with both 360px
captures inspected. The final production smoke reran after the same asset build.

Lint, seven Node tests, production build, production smoke (zero console errors),
eight external HTTP HEAD links, zero runtime npm vulnerabilities and whitespace
checks passed. A fresh independent read-only review, including the final fix
pass, found no confirmed Critical, Important or Minor issues. Its runtime and
performance conclusions rely on the primary agent's measured evidence.

The primary agent measured both SwiftShader and native Direct3D11 on the AMD
integrated GPU, separately from Blender's RX 9070 XT. Final hardware boarding
CPU was 7.17% versus 11.64% of one logical core, with 61.2% more main-pass
triangles and 66.5% fewer main-pass draw calls. Repeated after-samples varied;
full methodology, raw filenames and the expensive software-animation limit
are in PERFORMANCE.md. All measured idle samples produced zero new frames.

Real captures include `artifacts/production-intro.png`,
`production-explore.png`, `production-section.png`,
`baked-final-hardware-intro.png`, `baked-final-hardware-explore.png` and the
current desktop/tablet/mobile captures. Blender's authoring render omits the
web-only planet maps, screens and HTML; final browser captures are the visual
authority. Physical phones, Safari and Firefox were not tested. The following
sections retain the earlier implementation/typography verification history.

## Home typography revision

The requested home-page text is approximately 25% larger and uses Satoshi 700,
including Canvas display labels, navigation controls and metadata. Intro cards
were widened to preserve the ear anchor. The mobile brand can wrap the full name.
Both footer translations now use the supplied label `Software AI Engineer`.
Professional section content and panel typography are preserved.

This revision passed lint, six unit tests, production build and production smoke
with zero console errors. Seven focused browser scenarios cover actual Satoshi
glyph rendering, all five responsive sizes and WebGL fallback; responsive tests
also assert bold home text and the new footer. Both mobile cases were repeated
after the final wrapping adjustment. A separate text-range check passed 14
fallback states (ES/EN at widths 360, 390, 430, 768, 1024, 1440 and 1920), and the
desktop/tablet/mobile captures were visually inspected. Local evidence:
`artifacts/home-type-layout.json`, `home-bold-fallback-*.png` and the current
intro/production captures. The complete baseline suite below predates this
focused typography revision.

## Latest placement and CPU revision

The later user-requested revision attaches the speech bubble to the robot's ear,
frames the medal on the left wall, puts the logbook on a lectern and mounts the
command screen above the desk. CPU measurements and limits are in PERFORMANCE.md.
The earlier ceiling-suspended medal arrangement is superseded by this request.

The subsequent annotated-image correction moves the medal farther left onto the
side wall and rotates its frame, raises the book another 0.30 scene units, and
replaces the monitor supports with a solid orbital-radar console. The strengthened
browser assertions require book clearance above world Y=2.3, the new medal
position/angle, an extruded console body and the high-resolution radar texture.

## Executed checks

| Check | Result | Evidence |
| --- | --- | --- |
| ESLint | PASSED | `npm.cmd run lint`, no errors |
| Production build | PASSED | Vite 7.3.7, lazy Three.js scene chunk |
| Unit tests | PASSED | 6 tests; navigation, frame coalescing, caps, software detection, cancellation |
| Browser suite | PASSED | 15 scenarios including typography, Chromium/SwiftShader; interrupted mobile-large case rerun successfully |
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

The Satoshi revision adds an actual-glyph audit via Chromium's
`CSS.getPlatformFontsForNode` for the intro, lightweight view and all six panels
in both languages. Every rendered text node uses the custom Satoshi font, and
all procedural Canvas text declarations use Satoshi. The unsupported Enter
symbol was replaced with an SVG icon to prevent system-font substitution.
The normal/italic WOFF2 files match the supplied originals by SHA-256; their
license is included, and the old Barlow dependency has been removed.

The initial 15-scenario run had one mobile-large failure when a source update
triggered Vite hot reload mid-navigation. With source edits stopped, that case
passed on its own (`playwright test --last-failed`). Desktop, tablet and mobile
captures were visually inspected after the font change; lint, six unit tests
and the production build also passed again.

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
geometry growth. The final instrumented sample contained 278 geometries,
269 draw calls and 169742 triangles. These are scene counters, not a real-device
frame-rate benchmark. Source review independently verified geometry disposal,
the robot's one-shot boarding lifecycle and the render scheduler's teardown.
The two additional browser tests check ear anchoring, book/monitor clearance,
and zero idle frames while motion remains enabled, including with a panel open.

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
