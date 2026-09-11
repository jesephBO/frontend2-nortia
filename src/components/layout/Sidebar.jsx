import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Truck,
  IdCard,
  PackageSearch,
  MapPinned,
  BarChart3,
  Navigation,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Panel', icon: LayoutDashboard, end: true },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/vehiculos', label: 'Vehículos', icon: Truck },
  { to: '/conductores', label: 'Conductores', icon: IdCard },
  { to: '/envios', label: 'Envíos', icon: PackageSearch },
  { to: '/seguimiento', label: 'Seguimiento', icon: MapPinned },
  { to: '/analitica', label: 'Analítica', icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-[236px] shrink-0 flex-col border-r border-white/[0.06] bg-ink-800/60 md:flex">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-beacon-500 text-ink-900">
          <Navigation size={16} strokeWidth={2.5} />
        </span>
        <div className="leading-tight">
          <p className="font-display text-[15px] font-semibold text-mist-100">Nortia</p>
          <p className="text-[10px] tracking-wide text-mist-500">LOGISTICS OPS</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors duration-150 ${
                isActive ? 'text-ink-900' : 'text-mist-300 hover:text-mist-100 hover:bg-white/[0.04]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-lg bg-beacon-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <item.icon size={16} strokeWidth={2} className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 mb-5 mt-2 rounded-xl border border-white/[0.06] bg-ink-900/50 p-3.5">
        <p className="text-xs font-medium text-mist-300">Estado del Gateway</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-route-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-pulseDot rounded-full bg-route-400" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-route-400" />
          </span>
          Conectado vía API Gateway
        </div>
      </div>
    </aside>
  );
}
