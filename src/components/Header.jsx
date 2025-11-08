import { useState, useEffect } from 'react';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Inicio', href: '#inicio' },      
    { name: 'Sobre mí', href: '#about' },
    { name: 'Habilidades', href: '#skills' },
    { name: 'Proyectos', href: '#projects' },
  ];

  const handleContactClick = (e) => {
    e.preventDefault();
    const email = 'amedinaf.it@gmail.com';
    const subject = 'Consulta';
    const body = 'Hola, me gustaría contactar contigo...';
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'backdrop-blur-md border-purple-500/30 shadow-lg shadow-purple-500/10' 
          : 'backdrop-blur-sm border-white/10'
      }`}
    >
  <nav className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl font-inter">
        <div className="flex justify-between items-center h-20">
          {/* Logo con el nombre*/}
          <a href="#inicio" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 hover:scale-110 transition-transform tracking-tight">
            {'<Medinafdzz />'}
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-300 relative group font-bold"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
            ))}
          </ul>

          {/* Boton de contacto */}
          <button
            onClick={handleContactClick}
            className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <span>Contactar</span>
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-white/10 shadow-lg">
            <ul className="flex flex-col py-6 px-6">
              {navItems.map((item) => (
                <li key={item.name} className="py-3">
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 block w-full text-lg font-bold"
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              <li className="py-3 mt-3">
                <button
                  onClick={(e) => {
                    handleContactClick(e);
                    closeMobileMenu();
                  }}
                  className="flex w-full items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold"
                >
                  <span>Contactar</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;