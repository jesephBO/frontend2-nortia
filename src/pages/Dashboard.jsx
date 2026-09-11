import { Link } from 'react-router-dom';
import { Package, Clock3, Truck, Wallet, ArrowUpRight } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { shipmentsService } from '../services/businessServices';
import { mockAnalyticsSummary, mockShipments } from '../data/mockData';
import { useApiResource } from '../hooks/useApiResource';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import StatusPill from '../components/ui/StatusPill';
import Loader from '../components/ui/Loader';
import FallbackNotice from '../components/ui/FallbackNotice';

export default function Dashboard() {
  const { user } = useAuth();
  const summary = useApiResource(() => analyticsService.getSummary(), { fallbackData: mockAnalyticsSummary });
  const shipments = useApiResource(
    () => shipmentsService.list({ limit: 5 }).then((res) => res.items ?? res),
    { fallbackData: mockShipments }
  );

  const anyFallback = summary.isFallback || shipments.isFallback;
  const s = summary.data;

  return (
    <div>
      {anyFallback && <FallbackNotice />}

      <div className="mb-6">
        <p className="text-sm text-mist-500">
          Bienvenido de vuelta, <span className="text-mist-300">{user?.name?.split(' ')[0] || 'operador'}</span>. Esto es lo
          que sucede hoy en tu red logística.
        </p>
      </div>

      {summary.loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Package} label="Envíos activos" value={s.activeShipments} accent="beacon" delay={0} />
          <StatCard icon={Clock3} label="Entregas a tiempo" value={s.onTimeRate} suffix="%" accent="route" delay={0.05} />
          <StatCard icon={Truck} label="Utilización de flota" value={s.fleetUtilization} suffix="%" accent="beacon" delay={0.1} />
          <StatCard icon={Wallet} label="Ingresos del mes" value={s.monthlyRevenue} accent="route" delay={0.15} />
        </div>
      )}

      <div className="mt-6 panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-mist-100">Envíos recientes</p>
            <p className="text-xs text-mist-500">Últimos movimientos reportados por tracking-service</p>
          </div>
          <Link to="/envios" className="flex items-center gap-1 text-xs font-medium text-beacon-400 hover:text-beacon-300">
            Ver todos
            <ArrowUpRight size={13} />
          </Link>
        </div>

        {shipments.loading ? (
          <Loader />
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {(shipments.data || []).slice(0, 5).map((sh) => (
              <Link
                key={sh.id}
                to={`/seguimiento?codigo=${sh.id}`}
                className="flex items-center justify-between gap-4 py-3.5 transition-colors hover:bg-white/[0.02] -mx-2 px-2 rounded-lg"
              >
                <div className="min-w-0">
                  <p className="font-mono text-xs text-beacon-400">{sh.id}</p>
                  <p className="truncate text-sm text-mist-100">
                    {sh.origin} → {sh.destination} · {sh.client}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-mist-500">ETA {sh.eta}</span>
                  <StatusPill status={sh.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
