module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        opensans: ["Open Sans", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        bodyPrimary: "#0A192F",
        bodySecondary: "#131E34",
        tabContentColor: "hsl(210,37%,84%)",
        textColor: "#D8D8D8",
        inputFields: "#1B2533",
        divider: "#1D3951",
      },
      backgroundImage: {
        profile: "url('/public/assets/profiles/profile.jpg')",
        profile1: "url('/public/assets/profiles/profile1.jpeg')",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
