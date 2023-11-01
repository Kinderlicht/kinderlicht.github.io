// import type { Config } from 'tailwindcss'

module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
  ],
  plugins: [require("flowbite/plugin"), require('@tailwindcss/forms')],
  theme: {
    extend: {
      colors: {
        primary: "#FFA500", // Orange
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
};
