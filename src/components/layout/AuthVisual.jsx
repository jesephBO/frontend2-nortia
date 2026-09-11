import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';

export default function AuthVisual() {
  return (
    <div className="relative hidden w-1/2 overflow-hidden bg-ink-800 lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 bg-grid bg-grid opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-ink-900/40" />

      <div className="relative z-10 flex items-center gap-2.5 px-10 pt-10">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-beacon-500 text-ink-900">
          <Navigation size={16} strokeWidth={2.5} />
        </span>
        <span className="font-display text-[15px] font-semibold text-mist-100">Nortia</span>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-10">
        <svg viewBox="0 0 420 300" className="w-full max-w-md" fill="none">
          {/* nodos de ciudades */}
          <circle cx="52" cy="230" r="4" fill="#7C88A6" />
          <circle cx="210" cy="90" r="4" fill="#7C88A6" />
          <circle cx="368" cy="150" r="4" fill="#F5A93B" />

          {/* ruta trazándose */}
          <path
            d="M52 230 C 110 210, 140 130, 210 90 S 320 60, 368 150"
            stroke="#3FD8B4"
            strokeWidth="2"
            strokeDasharray="620"
            strokeDashoffset="620"
            className="animate-dash"
          />

          {/* punto de origen pulsante */}
          <circle cx="52" cy="230" r="7" fill="#3FD8B4" opacity="0.25" className="animate-pulseDot" />

          <motion.circle
            r="5"
            fill="#F5A93B"
            initial={{ offsetDistance: '0%' }}
            animate={{ offsetDistance: '100%' }}
            transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.3 }}
            style={{
              offsetPath: "path('M52 230 C 110 210, 140 130, 210 90 S 320 60, 368 150')",
            }}
          />
        </svg>
      </div>

      <div className="relative z-10 px-10 pb-12">
        <p className="max-w-xs font-display text-2xl font-semibold leading-snug text-mist-100">
          Cada envío, cada unidad, cada kilómetro — visible en un solo lugar.
        </p>
        <p className="mt-3 max-w-xs text-sm text-mist-500">
          Datos en vivo desde flota, almacén y ruta a través de un único punto de entrada a la API.
        </p>
      </div>
    </div>
  );
}
