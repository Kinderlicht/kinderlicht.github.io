// import type { Config } from 'tailwindcss'

module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/templates/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
  ],
  safelist: [
    'h-96',
    'w-1/3',
    'w-1/2',
  ],
  plugins: [require("flowbite/plugin"), require('@tailwindcss/forms'), require('@tailwindcss/typography')],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["sans-serif"],
      mono: ["sans-serif"],
    },
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
