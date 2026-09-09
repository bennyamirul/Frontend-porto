/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#111111",
          soft: "#6b7280",
          muted: "rgba(17, 17, 17, 0.06)",
          foreground: "#ffffff",
        },
        background: "#f7f6f3",
        surface: "#ffffff",
        "surface-soft": "#f3f1ee",
        foreground: "#111827",
        muted: "#4b5563",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: [
          "var(--font-heading)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: ["SFMono-Regular", "Consolas", "Liberation Mono", "monospace"],
      },
      boxShadow: {
        soft: "0 18px 45px rgba(0, 0, 0, 0.08)",
      },
    },
  },
};

module.exports = config;
