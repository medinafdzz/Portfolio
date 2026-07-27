function SectionTitle({ kicker, children, subtitle }) {
  return (
    <header className="station-heading">
      <div>
        {kicker && <p className="station-heading__kicker">{kicker}</p>}
        <h2>{children}</h2>
        {subtitle && <p className="station-heading__subtitle">{subtitle}</p>}
      </div>
    </header>
  );
}

export default SectionTitle;
