function Badge({ children, color = 'purple', size = 'md' }) {
  const colors = {
    purple: "bg-purple-500/20 text-purple-300 border-purple-500/50",
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/50",
    pink: "bg-pink-500/20 text-pink-300 border-pink-500/50",
    green: "bg-green-500/20 text-green-300 border-green-500/50",
    orange: "bg-orange-500/20 text-orange-300 border-orange-500/50"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span className={`inline-block rounded-full border backdrop-blur-sm font-medium ${colors[color]} ${sizes[size]}`}>
      {children}
    </span>
  );
}

export default Badge;