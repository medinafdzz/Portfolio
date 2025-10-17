import { useState, useEffect } from 'react';
import Button from './Button';

function Info() {
  const text1 = "¡Hola!";
  const text2 = "Soy Alejandro Medina";
  const [displayedText1, setDisplayedText1] = useState("");
  const [displayedText2, setDisplayedText2] = useState("");
  const [showCursor1, setShowCursor1] = useState(true);
  const [showCursor2, setShowCursor2] = useState(false);
  
  useEffect(() => {
    const startAnimation = () => {
      let index1 = 0;
      let index2 = 0;
      
      // Resetear textos
      setDisplayedText1("");
      setDisplayedText2("");
      setShowCursor1(true);
      setShowCursor2(false);
      
      // Escribir primera línea
      const timer1 = setInterval(() => {
        if (index1 < text1.length) {
          setDisplayedText1(text1.slice(0, index1 + 1));
          index1++;
        } else {
          clearInterval(timer1);
          setShowCursor1(false);
          setShowCursor2(true);
          
          // Iniciar segunda línea después de un breve delay
          setTimeout(() => {
            const timer2 = setInterval(() => {
              if (index2 < text2.length) {
                setDisplayedText2(text2.slice(0, index2 + 1));
                index2++;
              } else {
                clearInterval(timer2);
                setTimeout(() => setShowCursor2(false), 500);
              }
            }, 80);
          }, 300);
        }
      }, 100);
    };
    
    // Iniciar la primera animación
    startAnimation();
    
    // Repetir cada 15 segundos
    const repeatInterval = setInterval(() => {
      startAnimation();
    }, 15000);
    
    return () => {
      clearInterval(repeatInterval);
    };
  }, []);
  
  return (
    <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
      {/* Título principal con efecto typewriter */}
      <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight md:leading-relaxed pb-4 md:pb-6">
        <span className="block text-white mb-4">
          {displayedText1}
          {showCursor1 && <span className="animate-pulse">|</span>}
        </span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient pb-4">
          {displayedText2}
          {showCursor2 && <span className="text-purple-400 animate-pulse">|</span>}
        </span>
      </h1>

      {/* Subtítulo con mejor escalado */}
      <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
        Ingeniero Informático en Tecnologías de la Información
      </p>

      {/* Descripción con mejor espaciado en móviles */}
      <p className="text-xs xs:text-sm sm:text-base text-gray-500 max-w-xl mx-auto text-center px-4">
          Me considero una persona autodidacta y curiosa, desde pequeño me han apasionado los ordenadores
          y la tecnología, lo que me llevó a estudiar esta carrera. Disfruto aprendiendo
          nuevas herramientas y lenguajes.
          <br />
          Soy un fiel partidario de que la práctica lleva al conocimiento.
      </p>

      {/* Botones con mejor espaciado */}
      <div className="flex flex-col xs:flex-row flex-wrap gap-3 xs:gap-4 justify-center pt-4">
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => window.open('https://github.com/medinafdzz?tab=repositories', '_blank')}
        >
          <span>Ver Proyectos</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
        
        {/* Enlace directo como <a> */}
        <a 
          href="/CV.pdf" 
          download="CV_Alejandro_Medina.pdf"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm font-semibold transition-all duration-300 rounded-lg"
        >
          <span>Descargar CV</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </a>
      </div>

      {/* Texto indicador de scroll */}
      <div className="pt-4 md:pt-6">
        <p className="text-xs xs:text-sm sm:text-base text-gray-500 mb-2">
          Continúa deslizando
        </p>
      </div>

      {/* Indicador de scroll */}
      <div className="animate-bounce">
        <svg className="w-6 h-6 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}

export default Info;