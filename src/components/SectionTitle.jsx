function SectionTitle({ children, subtitle }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient">
        {children}
      </h2>
      {subtitle && (
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="mt-6 mx-auto w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
    </div>
  );
}

export default SectionTitle;