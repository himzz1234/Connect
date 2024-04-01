module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#f5f5f5",
        secondary: "#ececec",
        accent: "#1da1f2",
        background: "white",
        gray_dark: "rgb(107, 114, 128)",
      },
      screens: {
        sm: "600px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
