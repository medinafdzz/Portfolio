import Header from './components/Header';
import Info from './components/Info';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Footer from './components/Footer';

function App() {
  return (
    <div
      id="app-scroll-container"
      className="min-h-screen overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 pb-12 lg:pb-14 lg:snap-y lg:snap-mandatory lg:overflow-y-scroll lg:h-screen"
    >
      {/* Header fijo */}
      <Header />
      
      {/* Contenido principal */}
      <main>
        {/* Hero Section */}
        <section
          id="inicio"
          className="min-h-screen flex items-start justify-center pt-24 pb-12 sm:pt-28 sm:pb-16 md:items-center md:py-16 lg:py-0 lg:snap-start lg:snap-always"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl md:py-20">
            <Info />
          </div>
        </section>
        
        {/* Separador full width */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        
        {/* About Section */}
        <section id="about" className="min-h-screen flex items-center justify-center py-20 md:py-16 lg:py-0 lg:snap-start lg:snap-always">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-20">
            <About />
          </div>
        </section>
        
        {/* Separador full width */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        
        {/* Skills Section */}
        <section id="skills" className="min-h-screen flex items-center justify-center py-20 md:py-16 lg:py-0 lg:snap-start lg:snap-always">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-12 pb-20">
            <Skills />
          </div>
        </section>
        
        {/* Separador full width */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        
        {/* Projects Section */}
        <section id="projects" className="min-h-screen flex items-center justify-center py-20 md:py-16 lg:py-0 lg:snap-start lg:snap-always">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-20">
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