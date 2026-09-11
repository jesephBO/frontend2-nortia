import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

/**
 * Anima un valor numérico desde 0 hasta `value` una sola vez al montar.
 * Si `value` no es numérico (ej. "S/ 612,400"), se muestra directo.
 */
function useCountUp(value, duration = 1.1) {
  const numeric = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^\d.]/g, ''));
  const isNumeric = !Number.isNaN(numeric) && typeof value !== 'string';
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState(isNumeric ? 0 : value);

  useEffect(() => {
    if (!isNumeric) return;
    const controls = animate(motionVal, numeric, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v * 10) / 10),
    });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numeric]);

  return isNumeric ? display : value;
}

export default function StatCard({ icon: Icon, label, value, suffix = '', accent = 'beacon', delay = 0 }) {
  const display = useCountUp(value);

  const accentMap = {
    beacon: 'text-beacon-400 bg-beacon-500/10',
    route: 'text-route-400 bg-route-500/10',
    mist: 'text-mist-300 bg-mist-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="panel p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-mist-500">{label}</span>
        {Icon && (
          <span className={`grid h-8 w-8 place-items-center rounded-lg ${accentMap[accent]}`}>
            <Icon size={16} strokeWidth={2} />
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-3xl font-semibold text-mist-100">
        {display}
        {suffix}
      </div>
    </motion.div>
  );
}
