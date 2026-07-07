/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        

        void: '#0A0F1C',
        panel: '#121A2B',
        panel2: '#1A2338',
        pulse: '#FF4757',
        teal: '#14B8A6',
        muted: '#8291AA',
        bgsoft: '#F7F8FA',
        card: '#FFFFFF',
        coral: '#FF4757',
        mint: '#14B8A6',
        ink: '#1F2937',
        subtext: '#6B7280',
      },
      fontFamily: {
      display: ['"Plus Jakarta Sans"', 'sans-serif'],
      body: ['"Plus Jakarta Sans"', 'sans-serif'],
      mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        drawLine: {
          '0%': { strokeDashoffset: 1000 },
          '100%': { strokeDashoffset: 0 },
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(100%)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        heartbeat: 'heartbeat 1.8s ease-in-out infinite',
        fadeUp: 'fadeUp 0.6s ease-out forwards',
        drawLine: 'drawLine 4s linear infinite',
        slideInRight: 'slideInRight 0.4s ease-out forwards',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(31, 41, 55, 0.06)',
        softLg: '0 8px 40px rgba(31, 41, 55, 0.08)',
      },
    },
  },
  plugins: [],
}