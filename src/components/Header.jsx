import { useState, useEffect } from 'react';

function Header() {
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'backdrop-blur-md bg-gradient-to-r from-slate-950/95 via-purple-950/95 to-slate-900/95 border-purple-500/30 shadow-lg shadow-purple-500/10' 
          : 'backdrop-blur-sm bg-slate-950/50 border-white/10'
      }`}
    >
      <nav className="container mx-auto px-[clamp(0.75rem,1.5vw,1rem)] sm:px-[clamp(1rem,1.5vw,1.5rem)] lg:px-[clamp(1.5rem,2vw,2rem)] max-w-7xl">
        <div className="flex justify-between items-center h-[clamp(4rem,5vw,5rem)]">
          {/* Logo con el nombre*/}
          <a href="#inicio" className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 hover:scale-110 transition-transform tracking-tight">
            {'<Medinafdzz />'}
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-[clamp(1.5rem,2vw,2rem)]">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-300 relative group text-[clamp(0.875rem,1.2vw,1rem)] font-medium tracking-wide"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[clamp(0.125rem,0.15vw,0.125rem)] bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
            ))}
          </ul>

          {/* Boton de contacto */}
          <button
            onClick={handleContactClick}
            className="hidden md:flex items-center gap-[clamp(0.375rem,0.5vw,0.5rem)] px-[clamp(1rem,1.5vw,1.5rem)] py-[clamp(0.5rem,0.625vw,0.625rem)] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-[clamp(0.875rem,1.2vw,1rem)] tracking-wide"
          >
            <span>Contactar</span>
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;