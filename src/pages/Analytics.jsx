import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Package, Clock3, Truck, Wallet } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import {
  mockAnalyticsSummary,
  mockShipmentsByStatus,
  mockRevenueTimeline,
  mockFleetUtilization,
} from '../data/mockData';
import { useApiResource } from '../hooks/useApiResource';
import StatCard from '../components/ui/StatCard';
import Loader from '../components/ui/Loader';
import FallbackNotice from '../components/ui/FallbackNotice';

const STATUS_COLORS = ['#3FD8B4', '#7C88A6', '#F5A93B', '#E15B5B'];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-ink-800 px-3 py-2 text-xs shadow-panel">
      <p className="mb-1 text-mist-500">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="font-medium text-mist-100">
          {p.value?.toLocaleString?.('es-PE') ?? p.value}
        </p>
      ))}
    </div>
  );
}

export default function Analytics() {
  const summary = useApiResource(() => analyticsService.getSummary(), { fallbackData: mockAnalyticsSummary });
  const byStatus = useApiResource(() => analyticsService.getShipmentsByStatus(), { fallbackData: mockShipmentsByStatus });
  const revenue = useApiResource(() => analyticsService.getRevenueTimeline(), { fallbackData: mockRevenueTimeline });
  const fleet = useApiResource(() => analyticsService.getFleetUtilization(), { fallbackData: mockFleetUtilization });

  const anyFallback = summary.isFallback || byStatus.isFallback || revenue.isFallback || fleet.isFallback;
  const anyLoading = summary.loading || byStatus.loading || revenue.loading || fleet.loading;

  if (anyLoading) return <Loader label="Calculando métricas de operación…" />;

  const s = summary.data;

  return (
    <div>
      {anyFallback && <FallbackNotice />}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard icon={Package} label="Envíos activos" value={s.activeShipments} accent="beacon" delay={0} />
        <StatCard icon={Clock3} label="Entregas a tiempo" value={s.onTimeRate} suffix="%" accent="route" delay={0.05} />
        <StatCard icon={Truck} label="Utilización de flota" value={s.fleetUtilization} suffix="%" accent="beacon" delay={0.1} />
        <StatCard icon={Wallet} label="Ingresos del mes" value={s.monthlyRevenue} accent="route" delay={0.15} />
        <StatCard label="Crecimiento de clientes" value={s.clientsGrowth} suffix="%" accent="beacon" delay={0.2} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="panel p-6">
          <p className="text-sm font-medium text-mist-100">Ingresos mensuales</p>
          <p className="mb-4 text-xs text-mist-500">Últimos 6 meses, vía analytics-service</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenue.data}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F5A93B" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#F5A93B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="#7C88A6" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#7C88A6" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#F5A93B" strokeWidth={2} fill="url(#revenueFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="panel p-6">
          <p className="text-sm font-medium text-mist-100">Envíos por estado</p>
          <p className="mb-4 text-xs text-mist-500">Distribución actual</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={byStatus.data}
                dataKey="value"
                nameKey="status"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                strokeWidth={0}
              >
                {byStatus.data.map((entry, i) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
            {byStatus.data.map((entry, i) => (
              <div key={entry.status} className="flex items-center gap-2 text-xs text-mist-300">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[i % STATUS_COLORS.length] }} />
                {entry.status}
                <span className="ml-auto text-mist-500">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 panel p-6">
        <p className="text-sm font-medium text-mist-100">Utilización de flota por tipo de vehículo</p>
        <p className="mb-4 text-xs text-mist-500">Porcentaje de tiempo activo en ruta</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={fleet.data} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis type="number" stroke="#7C88A6" fontSize={12} tickLine={false} axisLine={false} unit="%" />
            <YAxis type="category" dataKey="type" stroke="#7C88A6" fontSize={12} tickLine={false} axisLine={false} width={130} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="utilization" fill="#3FD8B4" radius={[0, 6, 6, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
