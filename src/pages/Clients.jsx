import { useMemo, useState } from 'react';
import { Pencil, Trash2, MapPin } from 'lucide-react';
import { clientsService } from '../services/clientsService';
import { mockClients } from '../data/mockData';
import { useApiResource } from '../hooks/useApiResource';
import DataTable from '../components/ui/DataTable';
import StatusPill from '../components/ui/StatusPill';
import PageToolbar from '../components/ui/PageToolbar';
import Loader from '../components/ui/Loader';
import FallbackNotice from '../components/ui/FallbackNotice';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ClientFormModal from '../components/clients/ClientFormModal';
import ClientDetailModal from '../components/clients/ClientDetailModal';

export default function Clients() {
  const [search, setSearch] = useState('');
  const [formModal, setFormModal] = useState({ open: false, client: null });
  const [detailClient, setDetailClient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data, loading, isFallback, refetch } = useApiResource(
    () => clientsService.list().then((res) => res.items ?? res),
    { fallbackData: mockClients }
  );

  const rows = useMemo(() => {
    const list = data || [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (c) => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
    );
  }, [data, search]);

  async function handleFormSubmit(form, clientId) {
    if (clientId) {
      await clientsService.update(clientId, form);
    } else {
      await clientsService.create(form);
    }
    refetch();
  }

  async function handleDeleteClient() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await clientsService.remove(deleteTarget.id);
      refetch();
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  const columns = [
    { key: 'id', label: 'ID', render: (r) => <span className="font-mono text-xs text-mist-500">{r.id}</span> },
    { key: 'name', label: 'Cliente', render: (r) => <span className="font-medium text-mist-100">{r.name}</span> },
    { key: 'contact', label: 'Contacto' },
    { key: 'email', label: 'Correo' },
    { key: 'city', label: 'Ciudad' },
    { key: 'shipments', label: 'Envíos totales' },
    { key: 'status', label: 'Estado', render: (r) => <StatusPill status={r.status} /> },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDetailClient(r);
            }}
            title="Ver direcciones"
            className="grid h-7 w-7 place-items-center rounded-lg text-mist-500 transition-colors hover:bg-white/[0.06] hover:text-route-400"
          >
            <MapPin size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFormModal({ open: true, client: r });
            }}
            title="Editar cliente"
            className="grid h-7 w-7 place-items-center rounded-lg text-mist-500 transition-colors hover:bg-white/[0.06] hover:text-mist-100"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(r);
            }}
            title="Eliminar cliente"
            className="grid h-7 w-7 place-items-center rounded-lg text-mist-500 transition-colors hover:bg-alert-500/10 hover:text-alert-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {isFallback && <FallbackNotice />}
      <PageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Buscar por nombre, ciudad o ID…"
        createLabel="Nuevo cliente"
        onCreateClick={() => setFormModal({ open: true, client: null })}
      />

      {loading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} rows={rows} onRowClick={(row) => setDetailClient(row)} />
      )}

      <ClientFormModal
        open={formModal.open}
        client={formModal.client}
        onClose={() => setFormModal({ open: false, client: null })}
        onSubmit={handleFormSubmit}
      />

      <ClientDetailModal
        open={Boolean(detailClient)}
        client={detailClient}
        onClose={() => setDetailClient(null)}
        onClientChanged={refetch}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteClient}
        loading={deleting}
        title="Eliminar cliente"
        description={`Se eliminará "${deleteTarget?.name}" y todas sus direcciones (DELETE /clientes/${deleteTarget?.id}, cascade). Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
