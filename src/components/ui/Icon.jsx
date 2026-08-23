export function Icon({ icon, className = "" }) {
  const [width, height, , , pathData] = icon.icon;
  const paths = Array.isArray(pathData) ? pathData : [pathData];

  return (
    <svg
      className={className ? `icon ${className}` : "icon"}
      viewBox={`0 0 ${width} ${height}`}
      width="1.25em"
      height="1em"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((path, index) => (
        <path key={index} fill="currentColor" d={path} />
      ))}
    </svg>
  );
}
