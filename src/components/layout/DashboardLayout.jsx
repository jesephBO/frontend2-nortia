import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const TITLES = {
  '/': 'Panel general',
  '/clientes': 'Clientes',
  '/vehiculos': 'Vehículos',
  '/conductores': 'Conductores',
  '/envios': 'Envíos',
  '/seguimiento': 'Seguimiento de envíos',
  '/analitica': 'Analítica',
};

export default function DashboardLayout() {
  const location = useLocation();
  const title = TITLES[location.pathname] || 'Nortia';

  return (
    <div className="flex h-screen bg-ink-900 bg-grid bg-grid">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
