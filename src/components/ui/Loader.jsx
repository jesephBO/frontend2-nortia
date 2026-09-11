export default function Loader({ label = 'Cargando datos…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-mist-500">
      <div className="relative h-8 w-8">
        <span className="absolute inset-0 rounded-full border-2 border-ink-600" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-beacon-500" />
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
}
