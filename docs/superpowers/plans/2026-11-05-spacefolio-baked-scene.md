# SPACEFOLIO: cabina detallada con iluminación horneada — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mejorar el acabado de la cabina manteniendo la distribución, todas las interacciones y un consumo mínimo en reposo.

**Architecture:** Crear una escena propia en Blender mediante Python y exportarla como GLB. Hornear iluminación de la parte estática; mantener piezas móviles separadas, con materiales adecuados para sus cambios de pose. Reutilizar React, Drei, GSAP y el renderizado bajo demanda existentes.

**Tech Stack:** Blender/Python/Cycles, glTF/GLB, Three.js, React Three Fiber, Drei, GSAP y Playwright. glTF Transform solo como herramienta de desarrollo si el análisis del archivo justifica compresión adicional.

**Spec:** Especificación autocontenida a continuación, basada en las instrucciones e imagen del usuario y el análisis de https://github.com/andrewwoan/sooahs-room-folio. El ejemplo aporta técnica y acabado, no sustituye la distribución espacial de SPACEFOLIO.

## Especificación y restricciones globales

- Mantener las seis posiciones de `src/space/config.js`, el encuadre y los estados de introducción/exploración.
- Medalla diagonal en la pared izquierda; libro elevado entre cohete y consola; consola integrada sin patas con Tierra/Luna y órbitas; diálogo anclado a la oreja.
- Conservar robot, navegación real de los seis objetos, animaciones finitas, ES/EN, accesibilidad, CV y contenido profesional. No volver a añadir la navegación inferior a la vista 3D.
- Satoshi es la única familia de fuentes. Conservar los textos de inicio grandes/negrita y la descripción solicitada por el usuario.
- Conservar los cambios locales concurrentes: no restaurarlos, incluirlos incidentalmente en commits ni sustituirlos por versiones anteriores.
- Modelos y materiales propios; no copiar texturas, personajes ni recursos de terceros del ejemplo. Conservar atribución de Tierra/Luna.
- Cero bucles de renderizado en reposo; conservar el presupuesto existente de 24 FPS en GPU y 8 FPS en software y la pausa de pestañas ocultas.
- Blender renderiza/hornea durante la creación de recursos; el visitante recibe GLB/texturas, no ejecuta Blender ni Cycles.
- Ejecutar directamente por hitos una vez autorizada la implementación de este plan. Commits locales tras validación; sin push ni despliegue.

## Herramientas y evidencia disponible

- Node, npm, Python, FFmpeg y pruebas Chromium están disponibles.
- Blender aportado por el usuario: `C:\Users\suso1\Downloads\blender-5.3.0-candidate+v53.c956fd684542-windows.amd64-release\blender-5.3.0-candidate+v53.c956fd684542-windows.amd64-release\blender.exe`.
- Es Blender 5.3.0 Release Candidate, hash `c956fd684542`. Comprobados arranque sin interfaz, bake combinado en CPU y GPU/HIP (RX 9070 XT), UV, imagen no uniforme y exportación GLB con textura embebida. Incluye Draco y MeshOptimizer. Evidencia local: `artifacts/blender-capabilities.json` y `artifacts/blender-capabilities-gpu.json`. Fijar versión/hash en la documentación de generación.
- La carga con Three.js detectó un requisito real: `connect-src` necesita `blob:` para las imágenes embebidas cargadas por GLTFLoader/ImageBitmapLoader. Corregir de forma limitada Vite dev/preview y Vercel; no desactivar CSP.
- La prueba aislada de Three.js, con esa única ampliación CSP en la respuesta de prueba, cargó el GLB generado en GPU con 24 vértices/UV y textura de 64×64, sin errores. Evidencia: `artifacts/blender-three-import.json`. El cambio todavía no se ha aplicado a las cabeceras del proyecto.
- Si la versión candidata falla, usar una versión estable portable oficial y verificar su checksum; no cambiar drivers ni configuración global automáticamente.
- La prueba automatizada del navegador usa SwiftShader incluso sin forzarlo. No representa una medición sobre la Radeon física. Evidencia: `artifacts/performance-default-renderer.json`.

## Criterios de aceptación

1. Siluetas suaves, biseles, detalles coherentes y sombras de contacto sin manchas, costuras UV ni iluminación doble. Capturas reales antes/después del mismo encuadre; la apariencia de la referencia es la dirección artística.
2. Mantener todas las interacciones y límites de colocación existentes. No hornear las sombras del robot o de objetos móviles dentro de las texturas del escenario.
3. Cero fotogramas nuevos durante tres segundos de reposo, tanto en introducción como exploración y con panel abierto. Medir después de calentamiento.
4. Comparar antes/después en el mismo navegador, renderizador, viewport y duración. Registrar CPU agregada, CPU principal, fotogramas, llamadas de dibujo, triángulos, memoria y peso descargado. Separar pasada principal de sombras al contar geometría.
5. Como objetivo inicial, reducir al menos a la mitad las llamadas de dibujo de la cabina estática y no aumentar el tiempo de CPU de la transición. Son objetivos a demostrar, no resultados garantizados; si no se cumplen, perfilar y corregir antes de aceptar la sustitución.
6. Verificar aceleración en un navegador real antes de atribuir consumos a la GPU. Si no puede controlarse/observarse ese navegador, declarar esa medición pendiente; no presentar SwiftShader como prueba de GPU real.
7. Escritorio 1440×900/1920×1080, tablet 768×1024/1024×768, móvil 390×844/430×932 y comprobación estrecha a 360px; ES/EN, sin recortes de controles ni desbordamiento.

## Archivos e interfaces

- Crear `assets/spacefolio/build.py`: generación reproducible de modelo, UV, materiales, horneado y exportación. Entrada: configuración exportada de `src/space/config.js`; salida: `.blend`, GLB y manifiesto de recursos.
- Crear `assets/spacefolio/scene.blend` y `assets/spacefolio/README.md`: fuente editable y comando de reproducción con versión, dispositivo y parámetros usados.
- Crear `public/models/spacefolio.glb`: geometrías/materiales finales con nombres estables; sin cámaras ni luces de autoría exportadas accidentalmente.
- Crear `src/space/models.jsx` solo para compartir carga/materiales del GLB si los tres consumidores lo necesitan. Usar `useGLTF('/models/spacefolio.glb')`; no añadir otro gestor de recursos.
- Adaptar `Cabin.jsx`, `Objects.jsx` y `Robot.jsx`: cambiar geometría manteniendo responsabilidades y controladores actuales.
- Mantener `config.js`, `navigation.js`, `RenderBudget.jsx`, `render-budget.js`, `IntroAnchor.jsx`, fuentes y componentes HTML como contratos existentes.
- Adaptar pruebas de geometría cuando cambie la representación, conservando las comprobaciones del comportamiento que verifican.
- Adaptar `vite.config.js` y `vercel.json` para admitir `blob:` en `connect-src` y añadir una prueba real del GLB bajo la política resultante.

## Hito 1: herramientas y referencia medible

**Files:** `assets/spacefolio/README.md`, `tests/performance.mjs`, evidencia local en `artifacts/`.

**Consumes:** ejecutable de Blender del usuario y aplicación actual. **Produces:** prueba de bake/export y línea base comparable.

- [x] Comprobar `blender --version`, ejecución sin interfaz, disponibilidad de Cycles y exportador glTF.
- [x] Ejecutar prueba pequeña de horneado y GLB con textura embebida; abrir el resultado con el cargador Three.js existente en una página aislada con el ajuste CSP identificado. Exigir UV, imagen no vacía, geometría y ausencia de errores de carga.
- [x] Detectar dispositivos Cycles sin modificar drivers y ejecutar un bake con la RX 9070 XT mediante HIP, además de CPU. No confundirlo con el renderizado de la web.
- [ ] Ampliar mínimamente `tests/performance.mjs` con argumento de renderizador y etiqueta/salida para no sobrescribir resultados anteriores; verificar que el informe identifica el renderer real y expresa CPU en unidades de un núcleo.
- [ ] Capturar referencia actual y medir línea base con un navegador a la vez, misma configuración y calentamiento. Guardar cambios propios mediante commit local.

## Hito 2: cabina estática terminada en Blender

**Files:** `assets/spacefolio/build.py`, `assets/spacefolio/scene.blend`, `assets/spacefolio/README.md`.

**Consumes:** posiciones actuales y capturas base. **Produces:** colección estática y piezas móviles separadas, UV y atlas horneados.

- [ ] Llevar posiciones/paleta desde `config.js` al script mediante una exportación JSON temporal; no mantener dos tablas manuales de coordenadas.
- [ ] Construir casco, ventana, escritorio, consola, silla, marcos, plantas y detalles con biseles y normales suaves donde mejoren la silueta visible; no subdividir superficies planas sin beneficio.
- [ ] Agrupar por material/atlas únicamente superficies estáticas. Mantener los seis objetos y pivotes de animación separados.
- [ ] Crear UV sin solapes accidentales y márgenes suficientes para mipmaps. Empezar con atlas 2048 y aumentar solo las superficies que lo necesiten según capturas de la cámara web.
- [ ] Hornear iluminación difusa, rebotes y oclusión estática con Cycles. Excluir robot y piezas móviles como oclusores del horneado estático. No fijar reflejos especulares dependientes de la cámara dentro del atlas.
- [ ] Hacer renders de revisión desde las cámaras de introducción/exploración y corregir proporciones, costuras y sombras. Guardar fuentes y commit del hito validado.

## Hito 3: GLB e integración completa

**Files:** `public/models/spacefolio.glb`, `src/space/models.jsx` si procede, `Cabin.jsx`, `Objects.jsx`, `Robot.jsx`, `Scene.jsx`, `vite.config.js`, `vercel.json`, `tests/scene-corrections.spec.js`, `tests/spacefolio.spec.js`.

**Consumes:** colecciones del hito 2. **Produces:** escena web final con interacciones actuales y geometría sustituida.

- [ ] Exportar base estática con materiales sin iluminación dinámica y partes móviles con PBR/oclusión apropiados; evitar aplicar las luces web sobre iluminación ya horneada.
- [ ] Permitir `blob:` únicamente en `connect-src` de dev, preview y despliegue para decodificar imágenes embebidas. Comprobar textura cargada y consola sin infracciones CSP con las cabeceras reales, sin bypass de seguridad en la prueba final.
- [ ] Mantener `object-experience`, `object-projects`, `object-about`, `object-education`, `object-skills`, `object-contact`, `host-robot` y `robot-ear` en la jerarquía web. Mantener pivotes de cabeza, hombros, caderas y rodillas y los estados de asiento inicial.
- [ ] Montar piezas GLB dentro de los grupos/controladores actuales. Libro abre, cohete responde, engranaje gira y receptor se desplaza; no reemplazar estas acciones por efectos HTML.
- [ ] Mantener Tierra/Luna, pantallas locales y etiquetas con Satoshi; conservar radares estáticos y texto legible. No incluir vídeo o animaciones continuas decorativas.
- [ ] Usar hitboxes simples y estables para interacción; comprobar objetos lateralizados y raycasting real sin aumentar el trabajo por fotograma.
- [ ] Retirar geometrías procedurales sustituidas y luces/sombras redundantes. Reutilizar materiales/geometrías y garantizar limpieza/remontaje sin destruir recursos todavía usados.
- [ ] Ejecutar pruebas de seis objetos, una única introducción, oreja, altura del libro, consola sin patas, ambos modos de movimiento, idiomas y recuperación sin WebGL; actualizar aserciones sobre representación sin debilitar comportamiento. Commit local.

## Hito 4: optimización, calibración y entrega

**Files:** pruebas existentes, `tests/fonts.spec.js`, `tests/production-smoke.mjs`, `docs/PERFORMANCE.md`, `docs/VALIDATION.md`, `docs/SPACEFOLIO.md`; GLB si requiere optimización.

**Consumes:** escena integrada y línea base del hito 1. **Produces:** comparación verificable y versión lista para revisión.

- [ ] Inspeccionar GLB, tamaño, nodos, atlas y llamadas de dibujo. Aplicar deduplicación/compresión solo preservando nombres, pivotes, UV e interacción. Draco/Meshopt reducen descarga; no tratarlos como garantía de menos CPU durante animación. KTX2 solo si la memoria/texturas lo justifican.
- [ ] Repetir medición comparable en hardware disponible y software, declarando cualquier recorrido no verificable. Comprobar cero fotogramas ociosos y que pestañas ocultas cancelen trabajo.
- [ ] Capturar y revisar introducción, navegación y secciones en los tamaños indicados y ambos idiomas. Corregir diferencias visuales y recortes, sin cambiar la distribución para ocultar defectos.
- [ ] Ejecutar `npm.cmd run lint`, `npm.cmd test`, `npm.cmd run build`, `npm.cmd run test:e2e`, `node tests/production-smoke.mjs` con preview activo y `git diff --check`. Exigir cero errores de consola; documentar avisos conocidos.
- [ ] Verificar licencia/atribución, CV y enlaces conservados, accesibilidad y uso exclusivo real de Satoshi. Actualizar comandos reproducibles y resultados; commit final propio, sin push.

## Review Focus

- Color: atlas con espacio de color incorrecto o doble tone mapping puede cambiar mucho el acabado; comparar Blender y navegador en el hito 3.
- Sombras: poses animadas pueden revelar sombras de robot grabadas en el suelo; excluirlas al hornear y comprobar ambas poses.
- Transformaciones: ejes Blender/glTF y pivotes pueden alterar distribución o caminar/sentarse; comprobar coordenadas, bounds y animación real.
- Recursos: GLB compartido puede duplicarse o liberarse durante un remount; comprobar cambios de vista y geometrías repetidas.
- Dispositivos: GPU disponible en Windows no garantiza WebGL/HIP efectivo; registrar el renderer y dispositivo realmente usados en cada prueba.

## Límites del compromiso

La imagen guía el acabado, pero no fija un número de polígonos ni garantiza un resultado idéntico con una cabina diferente. CPU casi nula es un objetivo de reposo, no de carga, horneado ni animación. El horneado puede consumir recursos del equipo durante la construcción; sus picos no son consumo permanente de la web. No se promete aceleración de la Radeon hasta verificarla.
