import { motion } from 'framer-motion';

/**
 * Tabla genérica orientada a datos (clientes, vehículos, conductores, envíos).
 * columns: [{ key, label, render? }]
 */
export default function DataTable({ columns, rows, keyField = 'id', onRowClick }) {
  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-mist-500">
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-5 py-3.5 text-xs font-medium tracking-wide">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <motion.tr
                key={row[keyField]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-white/[0.04] last:border-0 transition-colors duration-150 hover:bg-white/[0.03] ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-5 py-3.5 text-mist-100">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="px-5 py-14 text-center text-sm text-mist-500">
            No hay registros que coincidan con la búsqueda.
          </div>
        )}
      </div>
    </div>
  );
}
