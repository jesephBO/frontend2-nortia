// Datos de demostración. Se usan SOLO como fallback visual cuando el
// API Gateway no responde (por ejemplo, durante desarrollo del
// frontend antes de que el backend esté desplegado). En cuanto el
// gateway responde, los servicios reales reemplazan estos datos.

export const mockClients = [
  { id: 'CL-1042', name: 'Textiles Andinos S.A.', contact: 'Marina Cruz', email: 'mcruz@textilesandinos.pe', city: 'Lima', shipments: 58, status: 'Activo' },
  { id: 'CL-1043', name: 'Minera Cerro Alto', contact: 'Jorge Salcedo', email: 'jsalcedo@cerroalto.pe', city: 'Cerro de Pasco', shipments: 134, status: 'Activo' },
  { id: 'CL-1044', name: 'Agroexport Huánuco', contact: 'Rosa Milla', email: 'rmilla@agrohuanuco.pe', city: 'Huánuco', shipments: 27, status: 'Activo' },
  { id: 'CL-1045', name: 'Ferretería Central', contact: 'Luis Ponce', email: 'lponce@ferrcentral.pe', city: 'Huancayo', shipments: 12, status: 'Moroso' },
  { id: 'CL-1046', name: 'Distribuidora Norte', contact: 'Elena Vidal', email: 'evidal@distnorte.pe', city: 'Trujillo', shipments: 76, status: 'Activo' },
];

// Direcciones de demostración, indexadas por id de cliente — reflejan
// el recurso GET /clientes/{id}/direcciones del microservicio real.
export const mockAddresses = {
  'CL-1042': [
    { id: 'DIR-9001', label: 'Almacén principal', street: 'Av. Argentina 2140', city: 'Lima', reference: 'Frente al parque industrial', isPrimary: true },
    { id: 'DIR-9002', label: 'Planta textil', street: 'Jr. Huaraz 812', city: 'Lima', reference: 'Zona industrial norte', isPrimary: false },
  ],
  'CL-1043': [
    { id: 'DIR-9003', label: 'Bocamina San Judas', street: 'Km 4 Carretera Minera', city: 'Cerro de Pasco', reference: 'Portón amarillo, control de acceso', isPrimary: true },
  ],
  'CL-1044': [
    { id: 'DIR-9004', label: 'Centro de acopio', street: 'Carretera Central Km 385', city: 'Huánuco', reference: 'Junto al mercado mayorista', isPrimary: true },
  ],
  'CL-1045': [
    { id: 'DIR-9005', label: 'Tienda central', street: 'Jr. Puno 455', city: 'Huancayo', reference: 'Esquina con Jr. Cusco', isPrimary: true },
  ],
  'CL-1046': [
    { id: 'DIR-9006', label: 'Almacén norte', street: 'Panamericana Norte Km 561', city: 'Trujillo', reference: 'Nave B, patio de carga', isPrimary: true },
    { id: 'DIR-9007', label: 'Oficina administrativa', street: 'Av. España 1220', city: 'Trujillo', reference: 'Piso 3', isPrimary: false },
  ],
};

export const mockVehicles = [
  { id: 'VH-201', plate: 'ABC-238', type: 'Tráiler 3 ejes', capacity: '28 Ton', driver: 'Renzo Aguilar', status: 'En ruta', lastCheck: '2026-09-08' },
  { id: 'VH-202', plate: 'DXE-910', type: 'Camión rígido', capacity: '12 Ton', driver: 'Sofía Quispe', status: 'Disponible', lastCheck: '2026-09-05' },
  { id: 'VH-203', plate: 'JKM-451', type: 'Furgón', capacity: '4 Ton', driver: 'Carlos Meza', status: 'Mantenimiento', lastCheck: '2026-09-02' },
  { id: 'VH-204', plate: 'PLQ-772', type: 'Tráiler 2 ejes', capacity: '20 Ton', driver: 'Ana Rojas', status: 'En ruta', lastCheck: '2026-09-09' },
  { id: 'VH-205', plate: 'TRS-115', type: 'Camión rígido', capacity: '10 Ton', driver: 'Miguel Torres', status: 'Disponible', lastCheck: '2026-09-07' },
];

export const mockDrivers = [
  { id: 'DR-501', name: 'Renzo Aguilar', license: 'A-IIIc', phone: '+51 987 111 222', vehicle: 'ABC-238', trips: 214, rating: 4.8, status: 'En ruta' },
  { id: 'DR-502', name: 'Sofía Quispe', license: 'A-IIb', phone: '+51 987 333 444', vehicle: 'DXE-910', trips: 132, rating: 4.9, status: 'Disponible' },
  { id: 'DR-503', name: 'Carlos Meza', license: 'A-IIIa', phone: '+51 987 555 666', vehicle: 'JKM-451', trips: 98, rating: 4.6, status: 'Descanso' },
  { id: 'DR-504', name: 'Ana Rojas', license: 'A-IIIc', phone: '+51 987 777 888', vehicle: 'PLQ-772', trips: 176, rating: 4.7, status: 'En ruta' },
  { id: 'DR-505', name: 'Miguel Torres', license: 'A-IIb', phone: '+51 987 999 000', vehicle: 'TRS-115', trips: 61, rating: 4.5, status: 'Disponible' },
];

export const mockShipments = [
  { id: 'SH-77031', client: 'Textiles Andinos S.A.', origin: 'Lima', destination: 'Cerro de Pasco', vehicle: 'ABC-238', driver: 'Renzo Aguilar', status: 'En tránsito', eta: '2026-09-12', value: 'S/ 18,400' },
  { id: 'SH-77032', client: 'Minera Cerro Alto', origin: 'Cerro de Pasco', destination: 'Callao', vehicle: 'PLQ-772', driver: 'Ana Rojas', status: 'En tránsito', eta: '2026-09-13', value: 'S/ 52,900' },
  { id: 'SH-77033', client: 'Agroexport Huánuco', origin: 'Huánuco', destination: 'Lima', vehicle: 'DXE-910', driver: 'Sofía Quispe', status: 'Entregado', eta: '2026-09-09', value: 'S/ 9,120' },
  { id: 'SH-77034', client: 'Distribuidora Norte', origin: 'Trujillo', destination: 'Chiclayo', vehicle: 'TRS-115', driver: 'Miguel Torres', status: 'Pendiente', eta: '2026-09-14', value: 'S/ 6,730' },
  { id: 'SH-77035', client: 'Ferretería Central', origin: 'Huancayo', destination: 'Lima', vehicle: 'JKM-451', driver: 'Carlos Meza', status: 'Retrasado', eta: '2026-09-11', value: 'S/ 3,980' },
];

export const mockTrackingEvents = {
  'SH-77031': [
    { id: 1, status: 'Pedido confirmado', location: 'Lima, Almacén Central', timestamp: '2026-09-10 06:12', note: 'Carga verificada y sellada.' },
    { id: 2, status: 'En tránsito', location: 'La Oroya', timestamp: '2026-09-10 11:40', note: 'Paso por control de carretera.' },
    { id: 3, status: 'En tránsito', location: 'Km 187 - Carretera Central', timestamp: '2026-09-11 08:05', note: 'Velocidad promedio 58 km/h.' },
    { id: 4, status: 'Próxima parada', location: 'Cerro de Pasco', timestamp: 'Estimado 2026-09-12 15:00', note: 'Entrega en almacén del cliente.' },
  ],
};

export const mockAnalyticsSummary = {
  activeShipments: 128,
  onTimeRate: 94.2,
  fleetUtilization: 81,
  monthlyRevenue: 'S/ 612,400',
  clientsGrowth: 6.4,
};

export const mockShipmentsByStatus = [
  { status: 'En tránsito', value: 128 },
  { status: 'Entregado', value: 342 },
  { status: 'Pendiente', value: 46 },
  { status: 'Retrasado', value: 12 },
];

export const mockRevenueTimeline = [
  { month: 'Abr', revenue: 412000 },
  { month: 'May', revenue: 448000 },
  { month: 'Jun', revenue: 467000 },
  { month: 'Jul', revenue: 501000 },
  { month: 'Ago', revenue: 578000 },
  { month: 'Sep', revenue: 612400 },
];

export const mockFleetUtilization = [
  { type: 'Tráiler 3 ejes', utilization: 88 },
  { type: 'Tráiler 2 ejes', utilization: 76 },
  { type: 'Camión rígido', utilization: 69 },
  { type: 'Furgón', utilization: 54 },
];
