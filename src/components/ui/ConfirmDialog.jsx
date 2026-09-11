import Modal from './Modal';
import { LoaderCircle, TriangleAlert } from 'lucide-react';

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-sm">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-alert-500/15 text-alert-500">
          <TriangleAlert size={16} />
        </span>
        <p className="text-sm text-mist-300">{description}</p>
      </div>
      <div className="mt-6 flex justify-end gap-2.5">
        <button onClick={onClose} className="btn-secondary">
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-alert-500 px-4 py-2.5 text-sm font-medium text-ink-900 transition-all hover:bg-alert-500/90 active:scale-[0.98] disabled:opacity-50"
        >
          {loading && <LoaderCircle size={14} className="animate-spin" />}
          Eliminar
        </button>
      </div>
    </Modal>
  );
}
