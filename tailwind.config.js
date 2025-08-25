/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2F7BFF', primaryDark:'#1F5ED1',
        purple: '#6E58FF',  purpleDark:'#5946D4',
        teal: '#00B894',    tealDark:'#00936F',
        ink: '#0F172A', muted:'#334155', divider:'#E6EAF0', panel:'#F7FAFF'
      },
      boxShadow: {
        soft:'0 1px 2px rgba(16,24,40,.05), 0 6px 20px rgba(2,6,23,.06)',
        pill:'0 1px 1px rgba(47,123,255,.10), 0 0 0 6px rgba(47,123,255,.06)'
      },
      borderRadius:{'2xl':'1rem'}
    }
  },
  plugins: []
};