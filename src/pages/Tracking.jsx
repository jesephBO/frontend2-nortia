import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, PackageCheck, Truck, Clock } from 'lucide-react';
import { trackingService } from '../services/trackingService';
import { mockShipments, mockTrackingEvents } from '../data/mockData';
import Loader from '../components/ui/Loader';
import FallbackNotice from '../components/ui/FallbackNotice';
import StatusPill from '../components/ui/StatusPill';

const STEP_ICON = {
  'Pedido confirmado': PackageCheck,
  'En tránsito': Truck,
  'Próxima parada': MapPin,
};

export default function Tracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const codeParam = searchParams.get('codigo') || '';
  const [code, setCode] = useState(codeParam);
  const [result, setResult] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [error, setError] = useState('');

  async function runSearch(searchCode) {
    if (!searchCode.trim()) return;
    setLoading(true);
    setError('');
    setIsFallback(false);
    try {
      const [summary, evts] = await Promise.all([
        trackingService.getByCode(searchCode),
        trackingService.getEvents(searchCode),
      ]);
      setResult(summary);
      setEvents(evts);
    } catch (err) {
      const fallbackShipment = mockShipments.find((s) => s.id.toLowerCase() === searchCode.toLowerCase());
      if (fallbackShipment) {
        setResult({
          code: fallbackShipment.id,
          status: fallbackShipment.status,
          origin: fallbackShipment.origin,
          destination: fallbackShipment.destination,
          eta: fallbackShipment.eta,
        });
        setEvents(mockTrackingEvents[fallbackShipment.id] || mockTrackingEvents['SH-77031']);
        setIsFallback(true);
      } else {
        setResult(null);
        setEvents([]);
        setError('No encontramos un envío con ese código en el API Gateway.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (codeParam) {
      setCode(codeParam);
      runSearch(codeParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeParam]);

  function handleSubmit(e) {
    e.preventDefault();
    setSearchParams({ codigo: code.trim() });
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 sm:max-w-md">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-500" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ej. SH-77031"
            className="input-field pl-9 font-mono"
          />
        </div>
        <button type="submit" className="btn-primary sm:w-auto">
          Rastrear envío
        </button>
      </form>

      {isFallback && <FallbackNotice />}

      {loading && <Loader label="Consultando ubicación en tiempo real…" />}

      {!loading && error && (
        <div className="panel px-6 py-14 text-center text-sm text-mist-500">{error}</div>
      )}

      {!loading && !error && !result && (
        <div className="panel px-6 py-14 text-center text-sm text-mist-500">
          Ingresa un código de envío para ver su estado y ubicación actual.
        </div>
      )}

      <AnimatePresence mode="wait">
        {!loading && result && (
          <motion.div
            key={result.code}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="panel p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-mist-500">{result.code}</p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-mist-100">
                    {result.origin} → {result.destination}
                  </h3>
                </div>
                <StatusPill status={result.status} />
              </div>

              <div className="mt-8 space-y-0">
                {events.map((ev, i) => {
                  const Icon = STEP_ICON[ev.status] || Clock;
                  const isLast = i === events.length - 1;
                  return (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                      className="relative flex gap-4 pb-8 last:pb-0"
                    >
                      {!isLast && (
                        <span className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-white/10" />
                      )}
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-route-500/30 bg-route-500/10 text-route-400">
                        <Icon size={14} />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-mist-100">{ev.status}</p>
                        <p className="text-xs text-mist-500">{ev.location} · {ev.timestamp}</p>
                        {ev.note && <p className="mt-1 text-xs text-mist-500">{ev.note}</p>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="panel flex flex-col justify-between p-6">
              <div>
                <p className="text-xs font-medium text-mist-500">Fecha estimada de llegada</p>
                <p className="mt-1.5 font-display text-2xl font-semibold text-mist-100">{result.eta}</p>
              </div>

              <div className="relative mt-8 flex-1 overflow-hidden rounded-xl border border-white/[0.06] bg-ink-900/60">
                <div className="absolute inset-0 bg-grid bg-grid opacity-50" />
                <svg viewBox="0 0 300 220" className="relative h-full w-full">
                  <circle cx="40" cy="180" r="5" fill="#7C88A6" />
                  <circle cx="260" cy="45" r="5" fill="#F5A93B" />
                  <path
                    d="M40 180 C 90 150, 120 90, 260 45"
                    stroke="#3FD8B4"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    fill="none"
                  />
                  <motion.circle
                    r="6"
                    fill="#3FD8B4"
                    initial={{ cx: 40, cy: 180 }}
                    animate={{ cx: 150, cy: 105 }}
                    transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.2 }}
                  />
                </svg>
                <span className="absolute bottom-3 left-3 text-[11px] text-mist-500">Origen</span>
                <span className="absolute right-3 top-3 text-[11px] text-mist-500">Destino</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
