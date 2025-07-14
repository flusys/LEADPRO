/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/@flusys/flusysng/**/*.{html,ts,mjs}",
  ],
  plugins: [PrimeUI],
  theme: {
    screens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        '2xl': '1920px'
    }
}
}