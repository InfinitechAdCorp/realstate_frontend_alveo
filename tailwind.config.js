/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        customBlue: '#002B47',
        hoverBlue: '#004366'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        typing: {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        },
        typingDots: {
          '0%': { content: '"Bot is typing."' },
          '33%': { content: '"Bot is typing.."' },
          '66%': { content: '"Bot is typing..."' },
          '100%': { content: '"Bot is typing...."' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        typing: 'typing 2s steps(30, end)',
        typingDots: 'typingDots 2s steps(3, end) infinite'
      }
    },
    screens: {
      'max-sm': {
        max: '639px'
      },
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1550px'
    }
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.scrollbar-hidden': {
          '-ms-overflow-style': 'none' /* for Internet Explorer 10+ */,
          'scrollbar-width': 'none' /* for Firefox */,
          '&::-webkit-scrollbar': {
            display: 'none' /* for Chrome, Safari, and Opera */
          }
        }
      })
    }
  ],

  important: true
}
