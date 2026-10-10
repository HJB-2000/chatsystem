tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-error-container": "#ffdad6", "surface-container-lowest": "#070e1d", "on-secondary": "#003824",
        "secondary-container": "#00a572", "tertiary-container": "#ff5451", "surface-container-low": "#141b2b",
        "text-main": "#F9FAFB", "bg-surface": "#111827", "on-primary": "#1000a9", error: "#ffb4ab",
        background: "#0c1322", "on-secondary-container": "#00311f", secondary: "#4edea3",
        "surface-container-high": "#232a3a", tertiary: "#ffb3ad", "border-subtle": "rgba(255,255,255,0.08)",
        "outline-variant": "#464554", "surface-bright": "#323949", "surface-dim": "#0c1322", primary: "#c0c1ff",
        "bg-main": "#090D16", "on-surface": "#dce2f7", "text-muted": "#9CA3AF", "surface-container": "#191f2f",
        "error-container": "#93000a", surface: "#0c1322", "on-primary-container": "#0d0096",
        "surface-container-highest": "#2e3545", "bg-input": "#030712", "primary-container": "#8083ff",
        "on-surface-variant": "#c7c4d7", outline: "#908fa0", "on-error": "#690005",
      },
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
      spacing: {
        "gutter-desktop": "1.5rem", "space-xl": "2rem", "space-lg": "1.5rem", "sidebar-width": "16rem",
        "space-xs": "0.5rem", "space-md": "1rem", "space-sm": "0.75rem", "topbar-height": "4rem",
        "space-2xs": "0.25rem", "space-2xl": "3rem",
      },
      fontFamily: {
        "label-md": ["Inter", "sans-serif"], "label-sm": ["Inter", "sans-serif"], "body-sm": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"], "headline-sm": ["Inter", "sans-serif"], "headline-md": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"], "code-sm": ["JetBrains Mono", "monospace"], "code-md": ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.03em", fontWeight: "500" }],
        "body-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.01em", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" }],
        "headline-sm": ["16px", { lineHeight: "24px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-md": ["20px", { lineHeight: "28px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-lg": ["28px", { lineHeight: "36px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "code-sm": ["11px", { lineHeight: "16px", fontWeight: "400" }],
        "code-md": ["13px", { lineHeight: "20px", fontWeight: "400" }],
      },
    },
  },
};
