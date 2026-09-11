import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ title }) {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleTrackSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/seguimiento?codigo=${encodeURIComponent(query.trim())}`);
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/[0.06] bg-ink-900/70 px-6 backdrop-blur">
      <h1 className="font-display text-lg font-semibold text-mist-100">{title}</h1>

      <div className="flex items-center gap-4">
        <form onSubmit={handleTrackSubmit} className="relative hidden sm:block">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar código de envío…"
            className="input-field w-64 pl-8 font-mono text-xs"
          />
        </form>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.05]"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink-600 font-display text-xs font-semibold text-mist-100">
              {(user?.name || 'U').slice(0, 1).toUpperCase()}
            </span>
            <span className="hidden text-left text-xs leading-tight sm:block">
              <span className="block font-medium text-mist-100">{user?.name || 'Usuario'}</span>
              <span className="block text-mist-500">{user?.company || 'Operaciones'}</span>
            </span>
            <ChevronDown size={14} className="text-mist-500" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 w-44 overflow-hidden rounded-lg border border-white/[0.08] bg-ink-800 py-1 shadow-panel">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-mist-300 transition-colors hover:bg-white/[0.05] hover:text-mist-100"
              >
                <LogOut size={14} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
