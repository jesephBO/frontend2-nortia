import { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { driversService } from '../services/businessServices';
import { mockDrivers } from '../data/mockData';
import { useApiResource } from '../hooks/useApiResource';
import DataTable from '../components/ui/DataTable';
import StatusPill from '../components/ui/StatusPill';
import PageToolbar from '../components/ui/PageToolbar';
import Loader from '../components/ui/Loader';
import FallbackNotice from '../components/ui/FallbackNotice';

export default function Drivers() {
  const [search, setSearch] = useState('');

  const { data, loading, isFallback } = useApiResource(
    () => driversService.list().then((res) => res.items ?? res),
    { fallbackData: mockDrivers }
  );

  const rows = useMemo(() => {
    const list = data || [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((d) => d.name.toLowerCase().includes(q) || d.vehicle.toLowerCase().includes(q));
  }, [data, search]);

  const columns = [
    { key: 'id', label: 'ID', render: (r) => <span className="font-mono text-xs text-mist-500">{r.id}</span> },
    { key: 'name', label: 'Conductor', render: (r) => <span className="font-medium text-mist-100">{r.name}</span> },
    { key: 'license', label: 'Licencia', render: (r) => <span className="font-mono text-xs">{r.license}</span> },
    { key: 'phone', label: 'Teléfono' },
    { key: 'vehicle', label: 'Vehículo', render: (r) => <span className="font-mono text-xs">{r.vehicle}</span> },
    { key: 'trips', label: 'Viajes' },
    {
      key: 'rating',
      label: 'Calificación',
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-beacon-400">
          <Star size={13} fill="currentColor" strokeWidth={0} />
          {r.rating}
        </span>
      ),
    },
    { key: 'status', label: 'Estado', render: (r) => <StatusPill status={r.status} /> },
  ];

  return (
    <div>
      {isFallback && <FallbackNotice />}
      <PageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Buscar por conductor o placa…"
        createLabel="Nuevo conductor"
        onCreateClick={() => {}}
      />
      {loading ? <Loader /> : <DataTable columns={columns} rows={rows} />}
    </div>
  );
}
