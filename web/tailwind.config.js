/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#f5f5f5',
        surface: '#171717',
        'surface-secondary': '#262626',
        accent: '#dc2626',
        'accent-secondary': '#991b1b',
        border: '#404040',
        muted: '#525252',
      },
    },
  },
  plugins: [],
}
