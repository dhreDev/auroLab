import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function CustomSelect({ value, options, onChange, label }) {
  const listboxId = useId();
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuPosition, setMenuPosition] = useState(null);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => Object.is(option.value, value)),
  );
  const selectedOption = options[selectedIndex];

  const openMenu = (nextIndex = selectedIndex) => {
    setActiveIndex(nextIndex);
    setIsOpen(true);
  };

  const closeMenu = (restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const selectOption = (index) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    closeMenu(true);
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const gap = 7;
      const viewportMargin = 10;
      const estimatedHeight = Math.min(options.length * 42 + 12, 232);
      const roomBelow = window.innerHeight - rect.bottom - viewportMargin;
      const opensUp = roomBelow < estimatedHeight && rect.top > roomBelow;
      const top = opensUp
        ? Math.max(viewportMargin, rect.top - estimatedHeight - gap)
        : Math.min(rect.bottom + gap, window.innerHeight - estimatedHeight - viewportMargin);

      setMenuPosition({
        left: Math.max(viewportMargin, rect.left),
        top,
        width: Math.min(rect.width, window.innerWidth - viewportMargin * 2),
        opensUp,
      });
    };

    const handlePointerDown = (event) => {
      if (triggerRef.current?.contains(event.target) || listRef.current?.contains(event.target))
        return;
      closeMenu();
    };

    updatePosition();
    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", updatePosition);
    document.addEventListener("scroll", updatePosition, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, options.length]);

  const handleKeyDown = (event) => {
    event.stopPropagation();

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      if (!isOpen) openMenu(selectedIndex);
      else setActiveIndex((current) => (current + direction + options.length) % options.length);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      if (!isOpen) openMenu(event.key === "Home" ? 0 : options.length - 1);
      else setActiveIndex(event.key === "Home" ? 0 : options.length - 1);
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && isOpen) {
      event.preventDefault();
      selectOption(activeIndex);
      return;
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (event.key === "Tab") {
      closeMenu();
      return;
    }

    if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      const query = event.key.toLocaleLowerCase();
      const match = options.findIndex((option, index) => {
        if (index === activeIndex) return false;
        return option.label.toLocaleLowerCase().startsWith(query);
      });

      if (match >= 0) {
        event.preventDefault();
        if (!isOpen) openMenu(match);
        else setActiveIndex(match);
      }
    }
  };

  return (
    <div className={isOpen ? "custom-select is-open" : "custom-select"}>
      <button
        ref={triggerRef}
        type="button"
        className="custom-select-trigger"
        role="combobox"
        aria-label={label}
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-activedescendant={isOpen ? `${listboxId}-option-${activeIndex}` : undefined}
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        onKeyDown={handleKeyDown}
      >
        <span>{selectedOption?.label}</span>
        <span className="custom-select-chevron" aria-hidden="true">
          <svg viewBox="0 0 12 8" focusable="false">
            <path d="m1 1.5 5 5 5-5" />
          </svg>
        </span>
      </button>

      {isOpen &&
        menuPosition &&
        createPortal(
          <div
            ref={listRef}
            id={listboxId}
            className={`custom-select-menu${menuPosition.opensUp ? " opens-up" : ""}`}
            role="listbox"
            aria-label={label}
            style={{ left: menuPosition.left, top: menuPosition.top, width: menuPosition.width }}
          >
            {options.map((option, index) => {
              const isSelected = Object.is(option.value, value);
              return (
                <div
                  id={`${listboxId}-option-${index}`}
                  key={option.value}
                  className={`custom-select-option${isSelected ? " is-selected" : ""}${activeIndex === index ? " is-active" : ""}`}
                  role="option"
                  aria-selected={isSelected}
                  onPointerEnter={() => setActiveIndex(index)}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => selectOption(index)}
                >
                  <span>{option.label}</span>
                  <span className="custom-select-check" aria-hidden="true">
                    <svg viewBox="0 0 12 10" focusable="false">
                      <path d="m1 5 3 3 7-7" />
                    </svg>
                  </span>
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
