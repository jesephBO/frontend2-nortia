import { AlertTriangle } from 'lucide-react';

export default function FallbackNotice() {
  return (
    <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-beacon-500/25 bg-beacon-500/[0.07] px-4 py-2.5 text-xs text-beacon-400">
      <AlertTriangle size={14} />
      No se pudo contactar al API Gateway. Mostrando datos de demostración.
    </div>
  );
}
