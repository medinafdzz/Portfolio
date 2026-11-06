# SPACEFOLIO: modelos, cámara y saludo del robot — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar las mejoras visuales solicitadas, permitir explorar la cabina con el ratón y añadir el saludo repetible del robot, conservando el bajo consumo en reposo.

**Architecture:** Ampliar el generador Blender y el GLB compartido existentes. Mantener las piezas móviles y sus pivotes. Integrar OrbitControls de Three.js dentro del controlador de cámara, con eventos conectados a RenderBudget y sin bucle permanente. Reutilizar el rig y el recorrido de entrada del robot para sus dos poses.

**Tech Stack:** Blender 5.3 RC verificado, Python, Three.js/OrbitControls, React Three Fiber, GSAP, Satoshi local y Playwright. No añadir otro motor, servicio de modelos ni dependencia de animación.

**Spec:** Petición del usuario del 2026-11-06, concretada a continuación. Este documento es el alcance de la siguiente ejecución; aún no acredita implementación ni publicación.

## Decisiones visuales y funcionales

1. **Experiencia:** elevar el cuadro desde Y=3.15 hasta una primera composición en Y=3.8, conservando su lado izquierdo. Añadir abrazadera/soporte que lo una físicamente al tubo blanco. Ajustar la altura final comparando su centro proyectado con la zona central visible del nuevo planeta; no dejarlo flotando ni atravesar el marco.
2. **Medalla:** sustituir el motivo académico por un medallón circular dorado con «1» en relieve, borde mecanizado y acabado metálico legible. Conservar ubicación lateral y orientación diagonal. Usar un soporte circular discreto, sin ocultar la silueta con la antigua placa rectangular.
3. **Tierra:** crear una mini-Tierra estilizada inspirada en Planet Earth Museum, con océano azul, masas de tierra en relieve, montañas/biomas y nubes geométricas. La referencia representa un pequeño mundo de fantasía; se adopta ese lenguaje sin reproducir íntegramente sus edificios, carteles o recorridos. Ajustar tamaño/encuadre para que el relieve se perciba desde la cabina, conservando la Luna y la función del planeta como fondo.
4. **Teléfono:** teléfono de pared rojo, con carcasa, auricular curvo reconocible, horquilla, rejillas, teclado 3×4, placa inferior y cable helicoidal. Auricular y cuerpo separados para conservar la acción física al seleccionar Contacto. Revisar la silueta de frente y en diagonal.
5. **Favicon:** sustituir el icono antiguo por el robot del brand-mark de la cabecera, con la misma silueta, ojos, inclinación y color ámbar. Debe ser reconocible a 16 y 32 píxeles.
6. **Cámara:** arrastrar con botón izquierdo orbita; derecho desplaza; rueda acerca/aleja. Un dedo orbita y dos dedos desplazan/amplían en táctil. Añadir restablecimiento accesible del encuadre. Los objetos siguen abriendo secciones al hacer clic, pero no al arrastrar.
7. **Extra del robot, incluido en el alcance:** después del primer asiento, un clic lo hace levantarse y volver a su posición de saludo, usando el recorrido existente en sentido inverso. Bocadillo ES: «¡Bienvenido a la nave espacial de medinafdzz!», con el botón y Enter de la introducción. Enter, botón o un nuevo clic lo hacen volver a sentarse. EN: «Welcome aboard medinafdzz's spaceship!». Sin añadir voz sintética ni un servicio de audio.

## Referencias verificadas y recursos

- Medalla: https://sketchfab.com/3d-models/gold-medal-bb26d0d9b3dd445eb342df75ea255228
- Tierra: https://sketchfab.com/3d-models/planet-earth-museum-bbc9452c014a49d796ac3d64de7edf05
- Teléfono: https://sketchfab.com/3d-models/wall-phone-348ec4e3595047a7b63087a7fc3c1769
- Navegación: https://www.sooahs-room-folio.com/ y https://github.com/andrewwoan/sooahs-room-folio

La API oficial de Sketchfab devuelve `isDownloadable=false` para los tres modelos.
La medalla figura con licencia Editorial y enlaza a Fab; no se ha comprobado una
compra ni obtenido un archivo de esa tienda. Las miniaturas públicas se han
inspeccionado como referencias, no como recursos que redistribuir.
Metadatos de revisión: `artifacts/reference-{medal,earth,phone}.json`.

La ruta propuesta no depende de compras, cuentas Sketchfab ni extracción de los
archivos del visor: se generan modelos propios. Usar Satoshi también para el
«1» y las cifras del teclado; si se convierten a geometría, partir del OTF
original proporcionado y conservar su licencia, sin modificar el binario.

## Restricciones globales

- Conservar el contenido profesional, ES/EN, CV, Satoshi como única familia, tamaños/negrita actuales y las seis secciones.
- Mantener el resto de posiciones acordadas, el atril despejado, la consola integrada, la medalla en la pared izquierda y el diálogo anclado a la oreja.
- Conservar render bajo demanda, pausa de pestaña oculta, 24 FPS de presupuesto en GPU y 8 FPS en software. No copiar el bucle continuo del ejemplo.
- No añadir autorrotación, animación orbital perpetua ni damping que mantenga fotogramas activos al soltar el ratón.
- No publicar cambios parciales. Conservar commits locales por hito y validar el conjunto antes de actualizar producción.
- No tratar el número de polígonos como medida de acabado. El cable del teléfono, relieves y biseles deben tener la densidad que se percibe en pantalla.
- Si se necesita texto convertido en geometría, cargar Satoshi-Bold.otf y fallar explícitamente si falta: no usar la fuente Bfont de Blender como sustituta.

## Hito 1: modelos y nueva composición

**Files:** `src/space/config.js`, `assets/spacefolio/build.py`, `assets/spacefolio/build.mjs`, `assets/spacefolio/README.md`, `assets/spacefolio/scene.blend`, atlas/manifiesto, `public/models/spacefolio.glb`, `src/space/Cabin.jsx`, `src/space/Objects.jsx`, pruebas de recursos/colocación.

**Consumes:** coordenadas/paleta canónicas, generador existente y referencias inspeccionadas. **Produces:** GLB compartido con las piezas nuevas, nombres estables y montaje visual correcto.

- [ ] Añadir primero comprobaciones de la nueva altura de Experiencia, silueta circular del medallón, auricular/cuerpo separados y nodo de planeta con geometría de relieve. Observar el fallo sobre el modelo anterior.
- [ ] Elevar Experiencia en config.js y modelar su soporte al marco blanco, usando esa configuración en Blender sin duplicar coordenadas manualmente.
- [ ] Generar medallón circular/«1», teléfono rojo y planeta estilizado. Mantener nombres de piezas consumidos por React o actualizar todos sus consumidores y pruebas en el mismo hito.
- [ ] Reducir especialmente la teselación del cable telefónico: hélice con muestreo directo y sección pequeña; evitar multiplicar cada punto por una curva de alta resolución. No sacrificar la forma del auricular ni los detalles visibles.

  La línea base medida en el manifiesto actual es 48.816 triángulos para
  PhoneBase y 3.852 para PhoneReceiver. La referencia de teléfono declara
  2.346 caras en su API. Hay margen para mejorar la silueta y reducir bastante
  geometría invisible a esta escala; no se promete una reducción concreta de
  CPU antes de medir el resultado.
- [ ] Incorporar el planeta al GLB compartido y sustituir la esfera fotográfica activa. Dejar de descargar las texturas de Tierra que ya no se usan; conservar las atribuciones que sigan correspondiendo a la Luna.
- [ ] Mantener sombras horneadas únicamente donde no dependan de movimiento; no grabar sombras de piezas móviles en la mesa o el suelo.
- [ ] Regenerar fuente/atlas/GLB con Draco local y comprobar UV, materiales, pivotes, tamaño y nombres. Revisar capturas de ambas cámaras y de objetos en diagonal. Ejecutar pruebas de recursos, colocación y seis clics reales; commit validado.

## Hito 2: navegación con ratón y táctil sin consumo ocioso

**Files:** `src/space/Scene.jsx` (CameraController), `src/space/Objects.jsx`, `src/space/Spacefolio.jsx`, `src/space/copy.js`, `src/space/Icons.jsx`, estilos de controles y `tests/camera-controls.spec.js`.

**Consumes:** cámara, RenderBudget y estados actuales. **Produces:** un único dueño de la cámara, navegación manual limitada y restauración del punto de vista al cerrar paneles.

- [ ] Escribir pruebas que fallen actualmente: arrastre izquierdo cambia orientación; derecho cambia objetivo; rueda cambia distancia; ninguno abre secciones por accidente.
- [ ] Crear una instancia de OrbitControls con `autoRotate=false` y `enableDamping=false`. Sus eventos `change` solicitan render a través del presupuesto existente; no añadir un RAF ni `invalidate` directo que eluda los límites.
- [ ] Comenzar con límites de azimut ±0.45 rad, polar 1.2–1.53 rad, distancia 8.5–15.5 y radio de desplazamiento del objetivo 1.6 unidades. Calibrar visualmente para impedir atravesar mesa, suelo o paredes y evitar enseñar el exterior sin acabar.
- [ ] Coordinar objetivo/cámara con GSAP. Deshabilitar el control durante movimientos programados y paneles; guardar el encuadre manual antes de enfocar una sección y restaurarlo al cerrar. No reiniciar la vista en cada render React.
- [ ] Distinguir clic de arrastre también en objetos y robot: botón principal y desplazamiento pequeño. Anular el menú contextual solo dentro del Canvas cuando se usa el botón derecho.
- [ ] Añadir «Restablecer vista» con nombre accesible ES/EN y controles táctiles. Conservar rueda/desplazamiento de los paneles HTML y ajustar la fila de herramientas a 360px.
- [ ] Comprobar las seis secciones después de orbitar, vista inicial/restablecida, cambio de tamaño, teclado y cero fotogramas en reposo tras soltar ratón/rueda. Commit validado.

## Hito 3: robot que vuelve a saludar

**Files:** `src/space/navigation.js`, `Spacefolio.jsx`, `Scene.jsx`, `Robot.jsx`, `IntroAnchor.jsx`, `copy.js`, `tests/navigation.test.mjs`, `tests/robot-greeting.spec.js`.

**Consumes:** rig articulado, recorrido inicial y estados de navegación. **Produces:** alternancia real entre asiento y saludo, con bocadillo y entrada por teclado coherentes.

- [ ] Añadir tests de transiciones `EXPLORE -> HOST_RISING -> HOST_GREETING -> HOST_SITTING -> EXPLORE`; ignorar clics repetidos durante los movimientos. Mantener las garantías del primer INTRO/ENTERING.
- [ ] Construir el recorrido con poses explícitas y reproducirlo hacia atrás/adelante; no depender de un timeline que se pierde al desmontar la vista 3D. Conservar articulaciones, pisada y sombra de contacto.
- [ ] Dar al robot una zona de clic simple y una alternativa de teclado. El arrastre de cámara sobre él no debe activar el saludo.
- [ ] Reutilizar el bocadillo proyectado desde `robot-ear`, con la frase nueva, traducción EN y el botón original. Enter y segundo clic sientan al robot; la escena queda totalmente parada al terminar.
- [ ] Hacer deterministas movimiento reducido, cambio de idioma, pérdida de WebGL y cambio a vista ligera durante saludo/movimiento. Evitar callbacks obsoletos y coexistencia de dos animaciones del mismo rig.
- [ ] Probar al menos tres ciclos completos, clic rápido, Enter, cámara y remontaje de la escena. Si el extra exige una reescritura desproporcionada, cerrar primero los demás hitos y registrar exactamente lo pendiente; no simular el gesto con un diálogo sin animación. Commit validado.

## Hito 4: favicon y verificación final

**Files:** `public/icon.svg`, `index.html` si cambia la referencia, pruebas existentes, `docs/VALIDATION.md`, `docs/PERFORMANCE.md` y documentación del generador.

- [ ] Reproducir el brand-mark en SVG y comprobar el icono servido, no solo su fichero local. Revisar 16/32px, pestaña clara/oscura y contraste.
- [ ] Ejecutar lint, 7 tests base más los nuevos, build, suite completa de navegador y smoke de producción bajo CSP real. Cero errores de consola, sin peticiones a descodificadores externos.
- [ ] Revisar escritorio, ambas orientaciones de tablet y móvil 360/390/430px, ES/EN, seis secciones, tres ciclos del robot, clic/arrastre/rueda/táctil, foco y movimiento reducido. Corregir y repetir únicamente las comprobaciones afectadas, además del pase completo final.
- [ ] Medir antes/después con mismo viewport y renderizador: transición, arrastre y reposo. Exigir cero fotogramas nuevos en ventanas ociosas después de navegar y saludar; registrar CPU principal/agregada, triángulos, llamadas y peso descargado.
- [ ] Obtener revisión independiente del cambio completo, resolver defectos confirmados y registrar límites de dispositivo. Guardar el hito validado y verificar la versión publicada si se actualiza producción.

## Review Focus

- Cámara manual y GSAP compitiendo por posición/objetivo; saltos al cerrar secciones o cambiar idioma/tamaño.
- Clics accidentales al orbitar sobre el teléfono, medalla o robot; panel que consume gestos destinados a su contenido.
- Límites de cámara que revelan caras sin acabado o cruzan la geometría, especialmente en vertical.
- Poses iniciales/remontadas y callbacks del robot que dejan el saludo abierto con el robot sentado, o reactivan una animación cancelada.
- Nuevos modelos más vistosos pero pesados: geometría del cable, transparencia de nubes, brillo del oro y atlas; evaluar pantalla real y medición, no solo número de polígonos.

## Estado del plan

Preparado tras inspección del código, las miniaturas y los metadatos públicos.
No se han modificado aún los modelos, la cámara, el robot ni el favicon.
No se han ejecutado todavía pruebas de las mejoras descritas.
