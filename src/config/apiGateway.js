/**
 * ------------------------------------------------------------------
 *  API GATEWAY CONFIG
 * ------------------------------------------------------------------
 *  Punto único de configuración de endpoints. El frontend NUNCA
 *  llama directamente a un microservicio: siempre pasa por el
 *  API Gateway (Kong / AWS API Gateway / Nginx / etc.).
 *
 *  En producción, GATEWAY_BASE_URL debe apuntar al dominio público
 *  del gateway, por ejemplo:
 *    https://api.nortia-logistics.com
 *
 *  Cada "recurso" define solo el path relativo al gateway. El
 *  gateway es responsable de enrutar internamente cada path hacia
 *  el microservicio correspondiente (auth-service, fleet-service,
 *  shipment-service, tracking-service, analytics-service, etc.)
 * ------------------------------------------------------------------
 */

export const GATEWAY_BASE_URL =
  import.meta.env.VITE_API_GATEWAY_URL || 'https://api.nortia-logistics.com';

// Prefijo de versión del gateway (útil para migraciones de contrato)
export const API_VERSION = '/v1';

/**
 * Mapa de endpoints agrupados por dominio de negocio.
 * Cambiar aquí es el ÚNICO lugar necesario si el gateway
 * reorganiza rutas o versiones.
 */
export const ENDPOINTS = {
  auth: {
    login: `${API_VERSION}/auth/login`,
    register: `${API_VERSION}/auth/register`,
    refresh: `${API_VERSION}/auth/refresh`,
    me: `${API_VERSION}/auth/me`,
    logout: `${API_VERSION}/auth/logout`,
  },
  // El microservicio de Clientes expone sus propias rutas documentadas
  // en /docs (Swagger) y /redoc, sin prefijo de versión.
  clients: {
    base: '/clientes',
    byId: (id) => `/clientes/${id}`,
    addresses: (clientId) => `/clientes/${clientId}/direcciones`,
    addressById: (addressId) => `/direcciones/${addressId}`,
  },
  vehicles: {
    base: `${API_VERSION}/vehicles`,
    byId: (id) => `${API_VERSION}/vehicles/${id}`,
  },
  drivers: {
    base: `${API_VERSION}/drivers`,
    byId: (id) => `${API_VERSION}/drivers/${id}`,
  },
  shipments: {
    base: `${API_VERSION}/shipments`,
    byId: (id) => `${API_VERSION}/shipments/${id}`,
  },
  tracking: {
    base: `${API_VERSION}/tracking`,
    byCode: (code) => `${API_VERSION}/tracking/${code}`,
    events: (code) => `${API_VERSION}/tracking/${code}/events`,
  },
  analytics: {
    summary: `${API_VERSION}/analytics/summary`,
    shipmentsByStatus: `${API_VERSION}/analytics/shipments-by-status`,
    revenueTimeline: `${API_VERSION}/analytics/revenue-timeline`,
    fleetUtilization: `${API_VERSION}/analytics/fleet-utilization`,
    onTimeRate: `${API_VERSION}/analytics/on-time-rate`,
  },
};

export function buildUrl(path) {
  return `${GATEWAY_BASE_URL}${path}`;
}
