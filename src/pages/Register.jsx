import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Building2, Mail, Lock, ArrowRight, LoaderCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthVisual from '../components/layout/AuthVisual';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', company: '', email: '', password: '' });
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
      await register(form);
      navigate('/');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'No pudimos crear la cuenta a través del API Gateway. Verifica los datos.'
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
          <h2 className="font-display text-2xl font-semibold text-mist-100">Crea tu cuenta</h2>
          <p className="mt-1.5 text-sm text-mist-500">
            Registra tu operación para empezar a gestionar flota y envíos.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-mist-300">Nombre completo</label>
              <div className="relative">
                <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-500" />
                <input
                  required
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Ana Torres"
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-mist-300">Empresa</label>
              <div className="relative">
                <Building2 size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-500" />
                <input
                  required
                  value={form.company}
                  onChange={(e) => update('company', e.target.value)}
                  placeholder="Transportes del Centro S.A.C."
                  className="input-field pl-9"
                />
              </div>
            </div>

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
              <label className="mb-1.5 block text-xs font-medium text-mist-300">Contraseña</label>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-500" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Mínimo 8 caracteres"
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
              {loading ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-mist-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-beacon-400 hover:text-beacon-300">
              Inicia sesión
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
