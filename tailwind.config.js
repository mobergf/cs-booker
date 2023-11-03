/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#8C0048",
        "primary-dark": "#660034",
        secondary: "#2F4858",
        "secondary-dark": "#20313c",
        blue: "#405378",
        gray: "#F7F7F7",
        green: "#00837C",
        500: "#00837C",
      },
    },
  },
  plugins: [],
};
