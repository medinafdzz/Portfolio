# SPACEFOLIO · Alejandro Medina

Portfolio bilingüe de ingeniería de software e IA aplicada dentro de una cabina espacial 3D real. Un robot articulado da la bienvenida, toma los mandos y acompaña la exploración de seis objetos: roadmap (experiencia), cohete (proyectos), bitácora sobre atril (sobre mí), medalla enmarcada en la pared izquierda (formación), consola con engranaje (tecnologías) y teléfono góndola de pared (contacto).

El contenido profesional original, ES/EN, el CV y los enlaces se conservan. CodeGuardian sigue descrito como prototipo académico y las herramientas de aprendizaje de IA no se presentan como experiencia profesional.

## Ejecutar

```powershell
npm.cmd install
npm.cmd run dev
```

Abre http://localhost:5173. Para revisar la build:

```powershell
npm.cmd run build
npm.cmd run preview
```

## Controles

- Enter o el botón de inicio: saludo, giro, desplazamiento y asiento del robot.
- Ratón o toque: seleccionar los objetos una vez a bordo.
- Navegación inferior: acceso directo a las seis secciones, incluso antes de entrar.
- Escape o el botón del panel: cerrar y recuperar el foco y la cámara.
- ES/EN: cambiar idioma; se guarda la preferencia localmente cuando es posible.
- CV, GitHub y LinkedIn en la cabecera; también en Contacto.
- Vista ligera: portfolio HTML completo sin renderizado 3D.
- Reducir movimiento: acortar transiciones y desactivar animación ambiental.

La preferencia de movimiento reducido del sistema se respeta automáticamente. Si WebGL no existe o se pierde el contexto, el contenido continúa disponible en la vista HTML.

## Stack y arquitectura

React 19, Vite 7, Three.js, React Three Fiber 9, Drei y GSAP. Un único Canvas cargado de forma diferida; modelado procedural con biseles, curvas y extrusiones; materiales PBR; mapas locales licenciados sobre planetas esféricos; paneles HTML accesibles.

```text
src/space/
  Spacefolio.jsx       interfaz y estado de la experiencia
  navigation.js        transiciones guardadas
  Scene.jsx            Canvas, cámara, iluminación y ciclo de renderizado
  Cabin.jsx            estructura, escritorio, silla y entorno espacial
  Robot.jsx            rig y animación continua del mismo personaje
  Objects.jsx          seis objetos físicos e interacciones
  geometry.jsx         piezas biseladas, curvas y limpieza de recursos
  textures.js          pantallas generadas proceduralmente
  SectionOverlay.jsx   diálogo accesible, foco y cierre
  SectionContent.jsx   contenido profesional original en HTML
  copy.js              textos de interfaz ES/EN
  config.js            paleta y distribución
  spacefolio.css       interfaz responsive
src/i18n/              fuente original del contenido profesional
src/components/Projects.jsx  selección original de proyectos
public/CV.pdf          CV original
```

Guía de mantenimiento: [docs/SPACEFOLIO.md](docs/SPACEFOLIO.md).

## Verificar

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
npx.cmd playwright install chromium
npm.cmd run test:e2e
git diff --check
```

Playwright y axe comprueban los seis tamaños solicitados, secciones ES/EN, objetos mediante raycasting, teclado, tacto, foco, movimiento reducido, recuperación sin WebGL y recursos locales. Las capturas reales y el informe quedan en `artifacts/`, ignorado por Git.

## Rendimiento y límites

Canvas diferido, renderizado bajo demanda incluso con movimiento activado y cero fotogramas nuevos en reposo. Las animaciones son finitas; sus actualizaciones se agrupan a un máximo de 24 FPS, las sombras se almacenan y actualizan al finalizar los movimientos, y no se añaden luces dinámicas al pasar el cursor. La cabina está memoizada y las geometrías se liberan.

Al detectar un rasterizador WebGL por CPU (SwiftShader/llvmpipe), se aplica automáticamente un máximo de 8 FPS, DPR 0.8, sombras de 512 píxeles y transiciones más cortas. La mirada que sigue al cursor se reserva para GPU real. Se prioriza el consumo sobre la fluidez en ese modo; el texto HTML permanece nítido. La escena se separa del paquete HTML; Three.js sigue siendo un recurso grande que se descarga para la vista 3D.

Medición y metodología antes/después: [docs/PERFORMANCE.md](docs/PERFORMANCE.md).

La escena es una recreación procedural estilizada de la referencia; no utiliza la imagen como fondo ni pretende ser una reproducción píxel a píxel. Los objetos laterales pueden quedar fuera del encuadre vertical; la navegación HTML y los movimientos controlados de cámara mantienen el acceso.

Las pruebas automatizadas usan Chromium con renderizado software; no equivalen a medir FPS en GPU de teléfonos reales ni a probar Safari/Firefox. El repositorio mantiene su configuración de Vercel y CNAME. No se ha publicado esta versión.

Resultados ejecutados, capturas y límites: [docs/VALIDATION.md](docs/VALIDATION.md).
La auditoría npm no detecta vulnerabilidades de producción; quedan cuatro avisos moderados en la cadena de ESLint/minimatch, solo de desarrollo. Three.js emite un aviso de deprecación de Clock y Vite advierte del tamaño del paquete 3D diferido.

Las texturas de Tierra y Luna pertenecen a Solar System Scope / INOVE, bajo CC BY 4.0. [Atribución y licencia](public/textures/ATTRIBUTION.md).

## Contacto

[GitHub](https://github.com/medinafdzz) · [LinkedIn](https://linkedin.com/in/medinafdzz) · [Email](mailto:amedinaf.it@gmail.com)
