import { useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import Modal from '../ui/Modal';

const EMPTY_FORM = { name: '', contact: '', email: '', city: '', status: 'Activo' };

export default function ClientFormModal({ open, onClose, onSubmit, client }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(client);

  useEffect(() => {
    if (open) {
      setForm(
        client
          ? { name: client.name, contact: client.contact, email: client.email, city: client.city, status: client.status }
          : EMPTY_FORM
      );
      setError('');
    }
  }, [open, client]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit(form, client?.id);
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          `No se pudo ${isEditing ? 'actualizar' : 'crear'} el cliente en el API Gateway.`
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar cliente' : 'Nuevo cliente'}
      subtitle={isEditing ? `PUT /clientes/${client.id}` : 'POST /clientes'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist-300">Razón social</label>
          <input
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Textiles Andinos S.A."
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-mist-300">Contacto</label>
            <input
              required
              value={form.contact}
              onChange={(e) => update('contact', e.target.value)}
              placeholder="Nombre del contacto"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-mist-300">Ciudad</label>
            <input
              required
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              placeholder="Lima"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist-300">Correo</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="contacto@empresa.com"
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist-300">Estado</label>
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            className="input-field"
          >
            <option>Activo</option>
            <option>Moroso</option>
          </select>
        </div>

        {error && (
          <p className="rounded-lg border border-alert-500/25 bg-alert-500/10 px-3 py-2 text-xs text-alert-500">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2.5 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving && <LoaderCircle size={14} className="animate-spin" />}
            {isEditing ? 'Guardar cambios' : 'Crear cliente'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
