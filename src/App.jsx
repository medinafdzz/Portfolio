import Header from './components/Header';
import Info from './components/Info';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Footer from './components/Footer';

function App() {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      {/* Header fijo */}
      <Header />
      
      {/* Contenido principal */}
      <main>
        {/* Hero Section */}
        <section id="inicio" className="h-screen flex items-center justify-center snap-start">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <Info />
          </div>
        </section>
        
        {/* Separador full width */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        
        {/* About Section */}
        <section id="about" className="h-screen flex items-center justify-center snap-start">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-20 overflow-y-auto scrollbar-hide">
            <About />
          </div>
        </section>
        
        {/* Separador full width */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        
        {/* Skills Section */}
        <section id="skills" className="h-screen flex items-center justify-center snap-start">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-20 overflow-y-auto scrollbar-hide">
            <Skills />
          </div>
        </section>
        
        {/* Separador full width */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        
        {/* Projects Section */}
        <section id="projects" className="h-screen flex items-center justify-center snap-start">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-20 overflow-y-auto scrollbar-hide">
            <Projects />
          </div>
        </section>
        
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

export default App;