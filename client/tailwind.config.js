module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kumbh: ["Kumbh Sans", "sans-serif"],
        ptsans: ["PT Sans", "sans-serif"],
        opensans: ["Open Sans", "sans-serif"],
      },
      colors: {
        bodyPrimary: "hsl(203,66%,7%)",
        bodySecondary: "hsl(206,28%,15%)",
        tabContentColor: "hsl(210,37%,84%)",
        textColor: "hsl(0%, 0%, 100%)",
      },
      backgroundImage: {
        profile: "url('/public/assets/profiles/profile.jpg')",
        profile1: "url('/public/assets/profiles/profile1.jpeg')",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
