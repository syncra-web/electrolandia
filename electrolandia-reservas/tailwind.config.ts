import type { Config } from "tailwindcss";

// Tailwind queda mapeado a los tokens del design system (tokens.css).
// Así cualquier utilidad (bg-primary, text-ink-strong, rounded-lg, shadow-glow…)
// sale de las MISMAS variables que los componentes del DS. Única fuente: tokens.css.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          active: "var(--primary-active)",
          ink: "var(--primary-ink)",
          text: "var(--primary-text)",
          soft: "var(--primary-soft)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          text: "var(--accent-text)",
        },
        success: { DEFAULT: "var(--success)", soft: "var(--success-soft)", text: "var(--success-text)" },
        warning: { DEFAULT: "var(--warning)", soft: "var(--warning-soft)", text: "var(--warning-text)" },
        danger: { DEFAULT: "var(--danger)", soft: "var(--danger-soft)", text: "var(--danger-text)" },
        info: { DEFAULT: "var(--info)", soft: "var(--info-soft)", text: "var(--info-text)" },
        noshow: { DEFAULT: "var(--noshow)", soft: "var(--noshow-soft)", text: "var(--noshow-text)" },
        charging: { DEFAULT: "var(--charging)", soft: "var(--charging-soft)", text: "var(--charging-text)" },
        carbon: { 900: "var(--carbon-900)", 950: "var(--carbon-950)" },
        "green-deep": "var(--green-deep)",
        page: "var(--bg-page)",
        surface: {
          DEFAULT: "var(--bg-surface)",
          2: "var(--bg-surface-2)",
          sunken: "var(--bg-sunken)",
        },
        ink: {
          strong: "var(--text-strong)",
          DEFAULT: "var(--text-default)",
          muted: "var(--text-muted)",
          subtle: "var(--text-subtle)",
        },
        line: { DEFAULT: "var(--border)", strong: "var(--border-strong)" },
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        glow: "var(--shadow-glow)",
      },
    },
  },
  plugins: [],
};

export default config;
