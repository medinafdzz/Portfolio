function Badge({ children }) {
  return (
    <span className="type-compact inline-block rounded-full border border-white/15 bg-white/[0.04] px-2 py-1 font-medium text-gray-200">
      {children}
    </span>
  );
}

export default Badge;
