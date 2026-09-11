import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Pencil, Trash2, Star } from 'lucide-react';
import Modal from '../ui/Modal';
import Loader from '../ui/Loader';
import FallbackNotice from '../ui/FallbackNotice';
import StatusPill from '../ui/StatusPill';
import ConfirmDialog from '../ui/ConfirmDialog';
import AddressFormModal from './AddressFormModal';
import { clientsService } from '../../services/clientsService';
import { mockAddresses } from '../../data/mockData';

export default function ClientDetailModal({ open, onClose, client, onClientChanged }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [addressModal, setAddressModal] = useState({ open: false, address: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function loadAddresses() {
    if (!client) return;
    setLoading(true);
    setIsFallback(false);
    try {
      const data = await clientsService.listAddresses(client.id);
      setAddresses(data.items ?? data);
    } catch {
      setAddresses(mockAddresses[client.id] || []);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, client?.id]);

  async function handleAddressSubmit(form, addressId) {
    if (addressId) {
      await clientsService.updateAddress(addressId, form);
    } else {
      await clientsService.addAddress(client.id, form);
    }
    await loadAddresses();
    onClientChanged?.();
  }

  async function handleDeleteAddress() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await clientsService.removeAddress(deleteTarget.id);
      setAddresses((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      onClientChanged?.();
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  if (!client) return null;

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={client.name}
        subtitle={`${client.id} · GET /clientes/${client.id}/direcciones`}
        width="max-w-xl"
      >
        <div className="mb-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs text-mist-500">Contacto</p>
            <p className="text-mist-100">{client.contact}</p>
          </div>
          <div>
            <p className="text-xs text-mist-500">Correo</p>
            <p className="text-mist-100">{client.email}</p>
          </div>
          <div>
            <p className="text-xs text-mist-500">Estado</p>
            <StatusPill status={client.status} />
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-mist-100">Direcciones</p>
          <button
            onClick={() => setAddressModal({ open: true, address: null })}
            className="flex items-center gap-1.5 text-xs font-medium text-beacon-400 hover:text-beacon-300"
          >
            <Plus size={13} />
            Agregar dirección
          </button>
        </div>

        {isFallback && <FallbackNotice />}

        {loading ? (
          <Loader label="Cargando direcciones…" />
        ) : addresses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-mist-500">
            Este cliente aún no tiene direcciones registradas.
          </div>
        ) : (
          <div className="space-y-2.5">
            {addresses.map((addr, i) => (
              <motion.div
                key={addr.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/[0.06] bg-ink-900/50 p-3.5"
              >
                <div className="flex gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-route-500/10 text-route-400">
                    <MapPin size={14} />
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-mist-100">{addr.label}</p>
                      {addr.isPrimary && (
                        <span className="flex items-center gap-1 rounded-full bg-beacon-500/15 px-1.5 py-0.5 text-[10px] font-medium text-beacon-400">
                          <Star size={9} fill="currentColor" strokeWidth={0} />
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-mist-300">{addr.street}, {addr.city}</p>
                    {addr.reference && <p className="text-xs text-mist-500">{addr.reference}</p>}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => setAddressModal({ open: true, address: addr })}
                    className="grid h-7 w-7 place-items-center rounded-lg text-mist-500 transition-colors hover:bg-white/[0.06] hover:text-mist-100"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(addr)}
                    className="grid h-7 w-7 place-items-center rounded-lg text-mist-500 transition-colors hover:bg-alert-500/10 hover:text-alert-500"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Modal>

      <AddressFormModal
        open={addressModal.open}
        address={addressModal.address}
        clientId={client.id}
        onClose={() => setAddressModal({ open: false, address: null })}
        onSubmit={handleAddressSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteAddress}
        loading={deleting}
        title="Eliminar dirección"
        description={`Se eliminará "${deleteTarget?.label}" mediante DELETE /direcciones/${deleteTarget?.id}. Esta acción no se puede deshacer.`}
      />
    </>
  );
}
