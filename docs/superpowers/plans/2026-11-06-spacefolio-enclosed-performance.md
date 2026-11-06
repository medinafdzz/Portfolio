# SPACEFOLIO: cabina cerrada y requisitos mínimos

Base: `6a48adc`. Petición: portátil articulado, teléfono sin cable, nave cerrada,
levantarse más natural y menor consumo con mayor fluidez. Conservar seis
secciones, ES/EN, Satoshi, contenido y navegación ya publicada.

Decisiones de implementación:

- Sustituir TechBase/Gear por LaptopBase/Lid con origen en la bisagra; abre al
  seleccionar/hover, cierra al salir. Misma posición canónica de Tecnologías.
- Eliminar realmente la geometría del cable del teléfono.
- Añadir casco completo: suelo, techo, costados, mamparo trasero y pared con
  abertura de ventana. Limitar cámara/desplazamiento para permanecer dentro.
- Corregir altura del asiento y pose sentada a Y=-.22; recorrido reversible
  junto a la silla, pisada ligada al progreso, giro y flexión suaves.
- Un material unlit por pieza; iluminación fija en atlas/colores de vértice.
  Sin luces/sombras dinámicas ni normales/UV innecesarios. Sombra de contacto
  suave y barata. Atlas JPEG86, Luna512, un descodificador liberado al cargar.
- Presupuesto60FPS GPU/30FPS software, DPR1/.4 y reducción por frames lentos
  durante interacción. Mantener cero fotogramas en reposo/pestaña oculta.
- Software/2GB/2núcleos: HTML ligero automático, sin descargar la escena3D.
  Elección de vista persistente y 3D opcional. No prometer que cualquier GPU
  pueda renderizar3D fluido; todos conservan acceso al contenido profesional.

Hitos:

- [x] Generador/modelos y regresiones geométricas. Inspección visual nativa de
  escritorio, tablet, móvil, diagonal y portátil abierto/cerrado.
- [x] Recorrido puro y reversible, postura y sombra; pruebas de continuidad,
  extremos, ciclos reales, Enter y desmontaje.
- [x] Vista ligera sin descargas3D y resolución que responde a carga inducida.
- [ ] Suite completa, build/CSP, CPU/RAM/frames antes/después en renderizadores
  equivalentes y ensayo de equipo limitado.
- [ ] Revisión independiente, correcciones, commits finales y publicación
  completa autorizada; verificar el dominio público y hashes servidos.

Evidencias locales en `artifacts/enclosed-*`; baseline aislada en
`artifacts/enclosed-baseline` para medición, sin modificar la versión base.
