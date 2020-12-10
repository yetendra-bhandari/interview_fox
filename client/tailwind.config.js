module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  //purge: { enabled: true, content: ["./public/index.html", , "./src/**/*.js"] },
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "background-text": "var(--background-text)",
        ui: "var(--ui)",
        "ui-text": "var(--ui-text)",
        "ui-hover": "var(--ui-hover)",
        "ui-accent": "var(--ui-accent)",
        "form-text": "var(--form-text)",
        "form-accent": "var(--form-accent)",
        "form-accent-hover": "var(--form-accent-hover)",
        avatar: "var(--avatar)",
        "avatar-hover": "var(--avatar-hover)",
      },
      fontFamily: {
        body: "Ubuntu",
      },
      spacing: {
        0.5: "0.125rem",
        28: "7rem",
        "screen-70": "70vh",
        128: "32rem",
      },
      maxWidth: {
        "9/10": "90%",
      },
    },
  },
  variants: {
    textColor: ["responsive", "hover", "focus", "group-hover", "group-focus"],
  },
  plugins: [],
};
