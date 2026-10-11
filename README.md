# Portfolio web de Alejandro Medina

Portfolio bilingüe para presentar el perfil de Alejandro Medina como software engineer con experiencia en backend, sistemas ATM, calidad y CI/CD, orientado hacia IA aplicada y aplicaciones con LLM.

La web prioriza evidencia verificable: experiencia profesional, formación actual, herramientas de software, proyectos con código público y límites claros. CodeGuardian aparece como un prototipo académico dentro de una selección equilibrada; no se presenta como experiencia de IA en producción.

## Contenido

- Hero bilingüe con posicionamiento, formación actual y contacto.
- Trayectoria profesional y académica.
- Capacidades separadas entre herramientas de software verificadas y una hoja de aprendizaje de IA/LLM.
- Proyectos destacados de IA, sistemas, calidad y software general.
- Proyectos secundarios enlazados sin presentarlos como experiencia profesional.
- Navegación por teclado, skip link, estados ARIA y soporte para movimiento reducido.

## Stack

- React y Vite.
- CSS propio con diseño responsive.
- ESLint para mantener el código consistente.

La web distingue el stack demostrado de las herramientas de IA/LLM que forman parte del itinerario de aprendizaje. PyTorch, Hugging Face Transformers, LangChain, LlamaIndex y MLflow no se presentan como experiencia consolidada.

## Estructura

~~~text
src/
├── components/
│   ├── About.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── Info.jsx
│   ├── PreferencesControls.jsx
│   ├── Projects.jsx
│   ├── SectionTitle.jsx
│   ├── Skills.jsx
│   └── StationMarker.jsx
├── context/
├── hooks/
├── i18n/
├── App.jsx
├── input.css
└── main.jsx
~~~

## Desarrollo local

~~~powershell
npm install
npm run dev
~~~

La aplicación se abre en http://localhost:5173.

## Verificación

~~~powershell
npm.cmd run lint
npm.cmd run build
git diff --check
~~~

## Despliegue

El repositorio contiene vercel.json, CNAME y la configuración necesaria para publicar la build. La URL pública es [medinafdzz.is-a.dev](https://medinafdzz.is-a.dev/).

## Contacto

- Email: [amedinaf.it@gmail.com](mailto:amedinaf.it@gmail.com)
- LinkedIn: [linkedin.com/in/medinafdzz](https://linkedin.com/in/medinafdzz)
- GitHub: [github.com/medinafdzz](https://github.com/medinafdzz)
