function Card({ children, hover = true, className = '' }) {
  const baseStyles = "backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl";
  const hoverStyles = hover ? "hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" : "";

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
}

export default Card;