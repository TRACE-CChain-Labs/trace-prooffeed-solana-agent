/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Inter",
          "PingFang TC",
          "Microsoft JhengHei",
          "Noto Sans TC",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.03)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-40%)" },
          "100%": { transform: "translateX(140%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        glow: "glow 6s ease-in-out infinite",
        shimmer: "shimmer 2.2s ease-in-out infinite",
        fadeUp: "fadeUp 700ms ease-out both",
        fadeIn: "fadeIn 650ms ease-out both",
        gradientShift: "gradientShift 12s ease-in-out infinite",
      },
      boxShadow: {
        soft: "0 0 0 1px rgba(255,255,255,0.06), 0 28px 90px rgba(0,0,0,0.60)",
        card: "0 0 0 1px rgba(255,255,255,0.06), 0 14px 46px rgba(0,0,0,0.52)",
      },
    },
  },
  plugins: [],
};
