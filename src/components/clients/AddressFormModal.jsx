import { useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import Modal from '../ui/Modal';

const EMPTY_FORM = { label: '', street: '', city: '', reference: '', isPrimary: false };

export default function AddressFormModal({ open, onClose, onSubmit, address, clientId }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(address);

  useEffect(() => {
    if (open) {
      setForm(address ? { ...EMPTY_FORM, ...address } : EMPTY_FORM);
      setError('');
    }
  }, [open, address]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit(form, address?.id);
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          `No se pudo ${isEditing ? 'actualizar' : 'agregar'} la dirección en el API Gateway.`
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar dirección' : 'Nueva dirección'}
      subtitle={isEditing ? `PUT /direcciones/${address.id}` : `POST /clientes/${clientId}/direcciones`}
      width="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist-300">Etiqueta</label>
          <input
            required
            value={form.label}
            onChange={(e) => update('label', e.target.value)}
            placeholder="Almacén principal"
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist-300">Dirección</label>
          <input
            required
            value={form.street}
            onChange={(e) => update('street', e.target.value)}
            placeholder="Av. Argentina 2140"
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

        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist-300">Referencia</label>
          <input
            value={form.reference}
            onChange={(e) => update('reference', e.target.value)}
            placeholder="Frente al parque industrial"
            className="input-field"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-mist-300">
          <input
            type="checkbox"
            checked={form.isPrimary}
            onChange={(e) => update('isPrimary', e.target.checked)}
            className="h-3.5 w-3.5 rounded border-white/20 bg-ink-900 accent-beacon-500"
          />
          Marcar como dirección principal
        </label>

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
            {isEditing ? 'Guardar cambios' : 'Agregar dirección'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
