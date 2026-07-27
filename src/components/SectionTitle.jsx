function SectionTitle({ children, subtitle }) {
  return (
    <div className="text-center mb-12">
      <h2 className="type-section mb-4 text-white">
        {children}
      </h2>
      {subtitle && (
        <p className="type-body mx-auto max-w-[62ch] text-gray-300">
          {subtitle}
        </p>
      )}
      <div className="mt-6 mx-auto flex w-24 items-center gap-2" aria-hidden="true">
        <span className="h-1 flex-1 rounded-full bg-pink-500"></span>
        <span className="h-1 w-5 rounded-full bg-purple-400"></span>
      </div>
    </div>
  );
}

export default SectionTitle;
