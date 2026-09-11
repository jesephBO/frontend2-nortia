import { useMemo, useState } from 'react';
import { vehiclesService } from '../services/businessServices';
import { mockVehicles } from '../data/mockData';
import { useApiResource } from '../hooks/useApiResource';
import DataTable from '../components/ui/DataTable';
import StatusPill from '../components/ui/StatusPill';
import PageToolbar from '../components/ui/PageToolbar';
import Loader from '../components/ui/Loader';
import FallbackNotice from '../components/ui/FallbackNotice';

export default function Vehicles() {
  const [search, setSearch] = useState('');

  const { data, loading, isFallback } = useApiResource(
    () => vehiclesService.list().then((res) => res.items ?? res),
    { fallbackData: mockVehicles }
  );

  const rows = useMemo(() => {
    const list = data || [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((v) => v.plate.toLowerCase().includes(q) || v.driver.toLowerCase().includes(q));
  }, [data, search]);

  const columns = [
    { key: 'id', label: 'ID', render: (r) => <span className="font-mono text-xs text-mist-500">{r.id}</span> },
    { key: 'plate', label: 'Placa', render: (r) => <span className="font-mono font-medium text-mist-100">{r.plate}</span> },
    { key: 'type', label: 'Tipo' },
    { key: 'capacity', label: 'Capacidad' },
    { key: 'driver', label: 'Conductor asignado' },
    { key: 'lastCheck', label: 'Última revisión' },
    { key: 'status', label: 'Estado', render: (r) => <StatusPill status={r.status} /> },
  ];

  return (
    <div>
      {isFallback && <FallbackNotice />}
      <PageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Buscar por placa o conductor…"
        createLabel="Nuevo vehículo"
        onCreateClick={() => {}}
      />
      {loading ? <Loader /> : <DataTable columns={columns} rows={rows} />}
    </div>
  );
}
