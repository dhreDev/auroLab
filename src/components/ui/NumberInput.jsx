export function NumberInput({ value, min, max, step = 1, onChange, label }) {
  const numericValue = Number(value);

  const changeBy = (direction) => {
    const nextValue = Math.min(max, Math.max(min, numericValue + direction * step));
    onChange(nextValue);
  };

  return (
    <div className="number-control">
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
      />
      <span className="number-stepper">
        <button
          type="button"
          className="number-step-button"
          aria-label={`Increase ${label}`}
          disabled={numericValue >= max}
          onClick={() => changeBy(1)}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <svg viewBox="0 0 10 6" aria-hidden="true" focusable="false">
            <path d="m1 5 4-4 4 4" />
          </svg>
        </button>
        <button
          type="button"
          className="number-step-button"
          aria-label={`Decrease ${label}`}
          disabled={numericValue <= min}
          onClick={() => changeBy(-1)}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <svg viewBox="0 0 10 6" aria-hidden="true" focusable="false">
            <path d="m1 1 4 4 4-4" />
          </svg>
        </button>
      </span>
    </div>
  );
}
