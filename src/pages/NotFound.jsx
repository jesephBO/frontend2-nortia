import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink-900 px-6 text-center">
      <div>
        <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-ink-800 text-beacon-400">
          <Compass size={24} />
        </span>
        <h1 className="font-display text-2xl font-semibold text-mist-100">Ruta no encontrada</h1>
        <p className="mt-2 text-sm text-mist-500">Esta página no existe en el mapa de la aplicación.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Volver al panel
        </Link>
      </div>
    </div>
  );
}
