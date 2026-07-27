import Header from './components/Header';
import Info from './components/Info';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[60] -translate-y-24 rounded-lg bg-white px-4 py-3 font-semibold text-gray-950 shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
      >
        Saltar al contenido
      </a>

      {/* Header fijo */}
      <Header />
      
      {/* Contenido principal */}
      <main id="main-content" tabIndex="-1" className="focus:outline-none">
        {/* Hero Section */}
        <section
          id="inicio"
          className="flex min-h-screen items-start justify-center pb-12 pt-24 sm:pb-16 sm:pt-28 md:items-center md:py-16"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl md:py-20">
            <Info />
          </div>
        </section>
        
        {/* About Section */}
        <section id="about" className="portfolio-section">
          <div className="portfolio-container">
            <About />
          </div>
        </section>
        
        {/* Skills Section */}
        <section id="skills" className="portfolio-section">
          <div className="portfolio-container">
            <Skills />
          </div>
        </section>
        
        {/* Projects Section */}
        <section id="projects" className="portfolio-section">
          <div className="portfolio-container">
            <Projects />
          </div>
        </section>

        {/* Footer final */}
        <Footer />
      </main>
    </div>
  );
}

export default App;
