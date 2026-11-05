# Maintaining SPACEFOLIO

## Content

`src/i18n/translations.js` is the original ES/EN professional content source.
It is preserved. Edit both languages together. Keep academic prototypes,
professional responsibilities and learning tools distinct.

`src/components/Projects.jsx` contains the original six repository links and
technology tags; the component is reused inside the Projects panel.
`public/CV.pdf` is the original downloadable CV.

`src/space/copy.js` holds only the new navigation and spacecraft interface copy.
`src/space/SectionContent.jsx` maps original content to six readable HTML panels.

## Typography

Satoshi is the sole website font family, including controls and Canvas screen
labels. `src/space/fonts.css` loads the original supplied variable WOFF2 files
from `public/fonts/`, with normal and italic styles and weights 300–900.
`main.jsx` waits for these faces before mounting so Canvas textures never bake
in a system fallback. Keep the family exclusive; use SVG icons for unsupported
symbols. The original license is `public/fonts/Satoshi-LICENSE.txt`.

## Scene

`config.js` defines the palette and the positions of the six navigation objects.
The menu order is experience, projects, about, education, skills, contact.
The education medal is framed diagonally on the left side wall, beside the
roadmap. The logbook rests on a raised lectern; the central command display is
an enclosed wedge panel integrated into the desk, without monitor legs.

- `Cabin.jsx`: window frame, hull, curved extruded desk, chair, plants, planets.
- `Objects.jsx`: wall roadmap, miniature rocket, hinged logbook on a lectern, framed medal,
  rotating physical gear console, wall gondola receiver and helical cable.
- `Robot.jsx`: one hierarchical rig with shoulders, hips, knees and head. GSAP
  animates its turn, walk and seated pose. Greeting and head responses are finite;
  no idle animation keeps the renderer alive. Mounting after lightweight view uses the seated pose.
- `geometry.jsx`: bevelled parts and curves; manually created GPU geometries have
  explicit cleanup. `Cabin` is memoised to avoid rebuilding it during navigation.
- `Scene.jsx`: one lazy Canvas, lighting, constrained camera, visibility pause,
  context-loss recovery and on-demand rendering in every motion mode.
- `RenderBudget.jsx` / `render-budget.js`: coalesce animation redraws, cap frames,
  stop timers when hidden, and refresh cached shadows at the end of movement.
- `IntroAnchor.jsx`: projects the robot's real ear position to the speech bubble.

Use local assets. Planet map licensing is in `public/textures/ATTRIBUTION.md`.
Display textures are generated locally with Canvas; professional paragraphs stay
in HTML. There are no paid services or remote runtime asset requests.

The command panel uses `createDisplay('radar')`: a static orbital schematic with
a filled Earth, a smaller Moon, orbital ellipses and radar rings. It is explicitly
labelled not to scale and contains no invented live telemetry. Generating it once
keeps the render-on-demand CPU budget intact.

## State and accessibility

`navigation.js` guards INTRO → ENTERING → EXPLORE and OPENING_SECTION →
SECTION_OPEN → CLOSING_SECTION → EXPLORE. Direct HTML navigation can open a
section immediately from INTRO. 3D objects are enabled only in EXPLORE.

The native modal dialog traps focus, supports Escape and restores the opener.
The section navigation is shown only in lightweight/fallback mode; 3D mode uses
the cabin objects and gives the scene the freed vertical space. The always-visible
lightweight toggle provides keyboard access to the HTML section navigation.
Language controls, CV and profile links are HTML.
Unavailable/lost WebGL and the lightweight toggle keep the full content usable.
Reduced-motion mode skips cinematics. All modes render on demand; hidden tabs
cancel pending redraw timers. Software rasterizers use a conservative budget
and shorter transitions (see PERFORMANCE.md). Portrait uses a separate camera and controlled object focus;
the navigation remains available when side objects do not fit in view.

## Checking changes

Run `npm.cmd test`, `npm.cmd run lint`, `npm.cmd run build`,
`npm.cmd run test:e2e` and `git diff --check`.
Install Chromium once with `npx.cmd playwright install chromium`.
Screenshots and the HTML report are retained under `artifacts/` (Git-ignored).

The test suite covers 1440×900, 1920×1080, 768×1024, 1024×768,
390×844 and 430×932, real raycast selection of all six objects,
all sections in both languages, keyboard focus, reduced motion,
WebGL failure, touch, local assets and repeated-navigation GPU geometry counts.

Visual tests use Chromium/SwiftShader, not a physical mobile GPU. Native Safari,
Firefox, actual device frame rates, authenticated LinkedIn pages and production
hosting need their own verification. A successful build is not a deployment.
