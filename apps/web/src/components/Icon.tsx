export function Icon({ name, monochrome = false }: { name: string; monochrome?: boolean }) {
  if (name === "dashboard")
    return (
      <span className="dashboard-icon" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <i key={i} />
        ))}
      </span>
    );
  if (monochrome || ["quick-action", "messages", "search", "down"].includes(name)) {
    const source = `url("/assets/figma/${name}.svg")`;
    return <span className={`icon icon-${name} icon-monochrome`} aria-hidden="true"
      style={{ maskImage: source, WebkitMaskImage: source }} />;
  }
  return (
    <img
      className={`icon icon-${name}`}
      src={`/assets/figma/${name}.svg`}
      alt=""
      aria-hidden="true"
    />
  );
}
