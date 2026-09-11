import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, LoaderCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthVisual from '../components/layout/AuthVisual';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'No pudimos verificar tus credenciales contra el API Gateway. Inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-ink-900">
      <AuthVisual />

      <div className="flex w-full flex-col justify-center px-8 sm:px-16 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full max-w-sm"
        >
          <h2 className="font-display text-2xl font-semibold text-mist-100">Inicia sesión</h2>
          <p className="mt-1.5 text-sm text-mist-500">
            Accede al panel de operaciones logísticas.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-mist-300">Correo corporativo</label>
              <div className="relative">
                <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-500" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="tu@empresa.com"
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-medium text-mist-300">Contraseña</label>
                <a href="#" className="text-xs text-mist-500 transition-colors hover:text-beacon-400">
                  ¿La olvidaste?
                </a>
              </div>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-500" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-9"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-lg border border-alert-500/25 bg-alert-500/10 px-3 py-2 text-xs text-alert-500"
              >
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
              {loading ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              {loading ? 'Verificando…' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-mist-500">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-medium text-beacon-400 hover:text-beacon-300">
              Regístrate
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
