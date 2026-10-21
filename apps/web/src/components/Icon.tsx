export function Icon({ name }: { name: string }) {
  if (name === "dashboard")
    return (
      <span className="dashboard-icon" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <i key={i} />
        ))}
      </span>
    );
  return (
    <img
      className={`icon icon-${name}`}
      src={`/assets/figma/${name}.svg`}
      alt=""
      aria-hidden="true"
    />
  );
}
