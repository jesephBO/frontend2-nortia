/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Fondo / superficies — azul-tinta profundo, no negro puro
        ink: {
          900: '#0B1220',
          800: '#0F1729',
          700: '#141F38',
          600: '#1B2947',
          500: '#243358',
        },
        // Texto
        mist: {
          100: '#EDEFF4',
          300: '#B7C0D4',
          500: '#7C88A6',
        },
        // Acento primario — ámbar de baliza / señal de carretera
        beacon: {
          400: '#F5A93B',
          500: '#EC9422',
          600: '#C97A15',
        },
        // Acento secundario — verde ruta / en tránsito
        route: {
          400: '#3FD8B4',
          500: '#22B893',
          600: '#0F8F72',
        },
        // Alertas
        alert: {
          500: '#E15B5B',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '28px 28px',
      },
      keyframes: {
        dash: {
          to: { strokeDashoffset: '0' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.6)', opacity: '0.35' },
        },
      },
      animation: {
        dash: 'dash 2.2s ease-out forwards',
        pulseDot: 'pulseDot 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
