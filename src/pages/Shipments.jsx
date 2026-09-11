import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shipmentsService } from '../services/businessServices';
import { mockShipments } from '../data/mockData';
import { useApiResource } from '../hooks/useApiResource';
import DataTable from '../components/ui/DataTable';
import StatusPill from '../components/ui/StatusPill';
import PageToolbar from '../components/ui/PageToolbar';
import Loader from '../components/ui/Loader';
import FallbackNotice from '../components/ui/FallbackNotice';

export default function Shipments() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data, loading, isFallback } = useApiResource(
    () => shipmentsService.list().then((res) => res.items ?? res),
    { fallbackData: mockShipments }
  );

  const rows = useMemo(() => {
    const list = data || [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((s) => s.id.toLowerCase().includes(q) || s.client.toLowerCase().includes(q));
  }, [data, search]);

  const columns = [
    { key: 'id', label: 'Código', render: (r) => <span className="font-mono text-xs font-medium text-beacon-400">{r.id}</span> },
    { key: 'client', label: 'Cliente' },
    { key: 'origin', label: 'Origen' },
    { key: 'destination', label: 'Destino' },
    { key: 'driver', label: 'Conductor' },
    { key: 'eta', label: 'ETA' },
    { key: 'value', label: 'Valor' },
    { key: 'status', label: 'Estado', render: (r) => <StatusPill status={r.status} /> },
  ];

  return (
    <div>
      {isFallback && <FallbackNotice />}
      <PageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Buscar por código o cliente…"
        createLabel="Nuevo envío"
        onCreateClick={() => {}}
      />
      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          onRowClick={(row) => navigate(`/seguimiento?codigo=${row.id}`)}
        />
      )}
    </div>
  );
}
