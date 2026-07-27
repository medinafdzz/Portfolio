import { useEffect, useRef, useState } from 'react';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const contactHref = 'mailto:amedinaf.it@gmail.com?subject=Consulta&body=Hola%2C%20me%20gustar%C3%ADa%20contactar%20contigo.';

  // Actualiza estado según desplazamiento
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const handleResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  // Elementos de navegación principal
  const navItems = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Sobre mí', href: '#about' },
    { name: 'Habilidades', href: '#skills' },
    { name: 'Proyectos', href: '#projects' },
  ];

  // Cierra menú móvil
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? 'border-purple-500/30 bg-gray-950 shadow-lg shadow-black/20'
          : 'border-white/10 bg-gray-950/95'
      }`}
    >
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo con el nombre */}
          <a
            href="#inicio"
            aria-label="Ir al inicio"
            onClick={closeMobileMenu}
            className="inline-flex min-h-11 items-center rounded-sm text-2xl font-bold tracking-[-0.02em] text-pink-300 transition-colors hover:text-pink-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-950"
          >
            {'<Medinafdzz />'}
          </a>

          {/* Navegación escritorio */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="group relative inline-flex min-h-11 items-center rounded-sm text-base font-semibold text-gray-300 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-950"
                >
                  {item.name}
                  <span
                    aria-hidden="true"
                    className="gradient-primary absolute -bottom-1 inset-x-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Botón contacto */}
          <a
            href={contactHref}
            aria-label="Abrir correo para contactar"
            className="hidden min-h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-base font-semibold text-white shadow-lg shadow-black/20 transition-colors duration-300 hover:from-purple-700 hover:to-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-950 md:flex"
          >
            <span>Contactar</span>
          </a>

          {/* Botón menú móvil */}
          <button
            type="button"
            ref={menuButtonRef}
            className="md:hidden flex min-h-11 min-w-11 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            aria-label="Navegación principal"
            className="absolute left-0 right-0 top-20 border-b border-white/10 bg-gray-900 shadow-lg md:hidden"
          >
            <ul className="flex flex-col py-6 px-6">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="flex min-h-11 w-full items-center rounded-md px-2 py-2 text-lg font-semibold text-gray-300 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              <li className="mt-3">
                <a
                  href={contactHref}
                  onClick={closeMobileMenu}
                  aria-label="Contactar por correo"
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-base font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
                >
                  <span>Contactar</span>
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
