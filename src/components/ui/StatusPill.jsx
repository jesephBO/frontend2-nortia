const STATUS_STYLES = {
  // Envíos / vehículos / conductores
  'En tránsito': 'bg-route-500/15 text-route-400 border-route-500/30',
  'En ruta': 'bg-route-500/15 text-route-400 border-route-500/30',
  'Entregado': 'bg-mist-500/15 text-mist-300 border-mist-500/30',
  'Disponible': 'bg-route-500/15 text-route-400 border-route-500/30',
  'Pendiente': 'bg-beacon-500/15 text-beacon-400 border-beacon-500/30',
  'Retrasado': 'bg-alert-500/15 text-alert-500 border-alert-500/30',
  'Mantenimiento': 'bg-beacon-500/15 text-beacon-400 border-beacon-500/30',
  'Descanso': 'bg-mist-500/15 text-mist-300 border-mist-500/30',
  'Activo': 'bg-route-500/15 text-route-400 border-route-500/30',
  'Moroso': 'bg-alert-500/15 text-alert-500 border-alert-500/30',
};

export default function StatusPill({ status }) {
  const style = STATUS_STYLES[status] || 'bg-mist-500/15 text-mist-300 border-mist-500/30';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
