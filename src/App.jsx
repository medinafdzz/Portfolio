import Header from './components/Header';
import Info from './components/Info';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Efectos de fondo animados */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-60 sm:w-80 h-60 sm:h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Sección de información personal - Inicio */}
          <section id="inicio" className="min-h-screen flex items-center justify-center scroll-mt-20 py-20">
            <Info />
          </section>
          
          {/* Separador visual sutil */}
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-8"></div>
          
          {/* Sección Acerca de mí */}
          <section id="about" className="min-h-screen flex items-center justify-center scroll-mt-20 py-20">
            <div className="w-full">
              <About />
            </div>
          </section>
          
          {/* Separador visual sutil */}
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-8"></div>
          
          {/* Sección de Habilidades */}
          <section id="skills" className="min-h-screen flex items-center justify-center scroll-mt-20 py-20">
            <div className="w-full">
              <Skills />
            </div>
          </section>
          
          {/* Separador visual sutil */}
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-8"></div>
          
          {/* Sección de Proyectos */}
          <section id="projects" className="min-h-screen flex items-center justify-center scroll-mt-20 py-20">
            <div className="w-full">
              <Projects />
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="relative mt-12 sm:mt-20 py-8 sm:py-12 border-t border-purple-500/20">
          <div className="container mx-auto px-4 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400">
              <p className="text-xs sm:text-sm">
                © {new Date().getFullYear()} Diseñado y desarrollado con 💜 por Alejandro Medina
              </p>
              <div className="flex gap-4 sm:gap-6">
                <a href="mailto:amedinaf.it@gmail.com" className="hover:text-purple-400 transition-colors duration-300" aria-label="Email">
                  <span className="text-xl sm:text-2xl">📧</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors duration-300" aria-label="LinkedIn">
                  <span className="text-xl sm:text-2xl">💼</span>
                </a>
                <a href="https://github.com/medinafdzz" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors duration-300" aria-label="GitHub">
                  <span className="text-xl sm:text-2xl">🐙</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;