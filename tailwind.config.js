/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    screens: {
        'max-sm': { 'max': '639px' },
           sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1550px',
      },
  },
 plugins: [
    function ({ addComponents }) {
      addComponents({
        '.scrollbar-hidden': {
          '-ms-overflow-style': 'none', /* for Internet Explorer 10+ */
          'scrollbar-width': 'none', /* for Firefox */
          '&::-webkit-scrollbar': {
            display: 'none', /* for Chrome, Safari, and Opera */
          },
        },
      })
    },
  ],

  important : true,
};
