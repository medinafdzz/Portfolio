import Header from './components/Header';
import Info from './components/Info';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      {/* Header fijo en la parte superior */}
      <Header />
      
      {/* Contenedor principal con márgenes y espaciado */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sección de información personal - Inicio */}
        <section id="inicio" className="py-12 md:py-20 scroll-mt-20">
          <Info />
        </section>
        
        {/* Separador visual sutil */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"></div>
        
        {/* Sección Acerca de mí */}
        <section id="about" className="py-12 md:py-16 scroll-mt-20">
          <About />
        </section>
        
        {/* Separador visual sutil */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"></div>
        
        {/* Sección de Habilidades */}
        <section id="skills" className="py-12 md:py-16 scroll-mt-20">
          <Skills />
        </section>
        
        {/* Separador visual sutil */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"></div>
        
        {/* Sección de Proyectos */}
        <section id="projects" className="py-12 md:py-16 pb-20 scroll-mt-20">
          <Projects />
        </section>
      </main>
      
      {/* Footer opcional */}
      <footer className="bg-gray-950 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="text-sm">
            © {new Date().getFullYear()} Mi Portfolio. Hecho con React + Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;