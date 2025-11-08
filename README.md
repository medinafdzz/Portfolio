Portfolio Web – Alejandro Medina
================================

¡Hola! Soy Alejandro Medina, estudiante de Ingeniería Informática en mi último año de carrera. Este repositorio aloja mi portfolio web, un espacio pensado para presentarme frente a equipos de tecnología que buscan perfiles junior con muchas ganas de aprender y aportar desde el primer día.

Visión general
--------------
- **Objetivo:** mostrar mis proyectos, habilidades y valores profesionales con un enfoque claro y directo.
- **Estilo:** diseño minimalista con énfasis en la legibilidad, animaciones suaves y microinteracciones cuidadas.
- **Resultado:** una página rápida, accesible y fácil de mantener, lista para iterar a medida que avance en mi carrera.

Destacados del proyecto
------------------------
- **Arquitectura limpia:** componentes React modulares con estilos gestionados por Tailwind CSS, lo que facilita ampliar secciones sin romper el layout.
- **Accesibilidad como prioridad:** navegación por teclado, etiquetas aria y elementos decorativos marcados correctamente para garantizar una buena experiencia para todos.
- **Identidad visual consistente:** gradientes reutilizables y tokens de estilo centralizados para mantener coherencia sin duplicar código.
- **Contenido adaptable:** datos de proyectos y habilidades estructurados para que sea sencillo añadir nuevas experiencias profesionales.

Stack tecnológico
------------------
- [React](https://react.dev/) + [Vite](https://vitejs.dev/) para un desarrollo rápido y renderizado eficiente.
- [Tailwind CSS](https://tailwindcss.com/) con utilidades personalizadas para controlar tipografía, gradientes y espaciados.
- ESLint y configuraciones de Vite para mantener el código limpio y alineado con buenas prácticas modernas.

Estructura principal
---------------------
```
src/
├── components/
│   ├── Header.jsx         // navegación y menú responsive
│   ├── Info.jsx           // sección hero con CTA
│   ├── About.jsx          // recorrido académico y valores personales
│   ├── Projects.jsx       // proyectos destacados con tabs
│   ├── Skills.jsx         // habilidades técnicas con métricas
│   ├── ProjectCard.jsx    // tarjeta reutilizable para proyectos
│   ├── SectionTitle.jsx   // cabeceras con utilidades de gradiente
│   ├── Footer.jsx         // enlaces a redes y contacto
│   └── Button.jsx         // botón reutilizable con variantes
├── App.jsx                // layout general de la aplicación
├── main.jsx               // punto de entrada
└── input.css              // utilidades de Tailwind y estilos globales
```

Experiencia de usuario
-----------------------
- **Responsive total:** desde mobile hasta desktop grande, usando breakpoints personalizados.
- **Transiciones suaves:** animaciones discretas que acompañan el contenido sin distraer.
- **Contenido en español:** mensajes claros y cercanos, buscando explicar cada parte de mi código.

Accesibilidad y rendimiento
---------------------------
- Uso de `aria-label`, `aria-expanded` y `aria-controls` en elementos interactivos.
- Íconos decorativos marcados con `aria-hidden="true"` para evitar ruido en lectores de pantalla.
- Botones con `type="button"` para prevenir comportamientos inesperados en formularios.
- Código depurado para reducir peso y mejorar los tiempos de carga en entornos reales.

Cómo ejecutar el proyecto
-------------------------
1. Clona el repositorio:
	```powershell
	git clone https://github.com/medinafdzz/Portfolio.git
	cd Portfolio
	```
2. Instala dependencias:
	```powershell
	npm install
	```
3. Inicia el entorno de desarrollo:
	```powershell
	npm run dev
	```
4. Abre `http://localhost:5173` en tu navegador preferido.

Despliegue
----------
- Configurado para Vercel mediante el archivo `vercel.json` y la build automatizada con Vite.
- Deploy actual accesible en: *https://medinafdzz.is-a.dev/*.

Próximos pasos
--------------
1. Añadir más proyectos reales a medida que avance en prácticas y trabajos universitarios.
2. Incorporar un blog corto con reflexiones sobre aprendizaje y retos técnicos.
3. Integrar métricas de visitas y formularios de contacto directamente en el portfolio.

Contacto
--------
Si te interesa mi perfil, puedes escribirme por:
- **Email:** amedinaf.it@gmail.com
- **LinkedIn:** [linkedin.com/in/medinafdzz](https://linkedin.com/in/medinafdzz)
- **GitHub:** [github.com/medinafdzz](https://github.com/medinafdzz)

Gracias por dedicar unos minutos a este portfolio! 

