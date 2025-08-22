/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Existing brand colors
        'brand-900':'#0A1A33','brand-800':'#0B1E39','brand-700':'#0E3A66','brand-600':'#0F4C81','brand-500':'#1E63A8','brand-400':'#3A7CC9','brand-300':'#6FA2E1','brand-200':'#A8C6EF','brand-100':'#E9F1FB','slate-ink':'#0B1324',
        'accent-green':'#22C55E','accent-amber':'#F59E0B',
        // New glossy tokens
        "ink": "#0B1221",
        "border": "#E6E9F2",
        "surface": "#FFFFFF",
        "surfaceAlt": "#F6F7FB",
        "brand": "#1E40AF",
        "accent": "#2563EB",
        "accent2": "#6D28D9",
        "success": "#16A34A",
        "warning": "#F59E0B",
        "danger": "#DC2626",
        "chart": { "1": "#2563EB", "2": "#6D28D9", "3": "#10B981", "4": "#F59E0B", "5": "#EF4444" }
      },
      borderRadius: { 
        'brand': '1rem',
        "xl": "1rem", 
        "2xl": "1.25rem" 
      },
      boxShadow: { 
        'brand': '0 10px 30px rgba(11,30,57,0.18)',
        "glossy": "0 10px 30px rgba(20,30,60,0.10)",
        "glossySm": "0 6px 18px rgba(20,30,60,0.08)"
      },
      backgroundImage: {
        "ctaGradient": "linear-gradient(135deg, #6D28D9 0%, #2563EB 100%)",
        "chipGradient": "linear-gradient(135deg, #EEF2FF 0%, #FFFFFF 100%)"
      }
    }
  },
  plugins: []
};