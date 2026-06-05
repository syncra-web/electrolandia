import type { IconName } from "./IconSprite";

type IconProps = {
  name: IconName;
  /** Clases extra (p. ej. "icon-sm"). `.icon` ya va incluida. */
  className?: string;
};

/** Icono de línea del design system. Requiere <IconSprite /> en el layout. */
export function Icon({ name, className }: IconProps) {
  return (
    <svg className={className ? `icon ${className}` : "icon"} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
