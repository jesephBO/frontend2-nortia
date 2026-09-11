import httpClient from './httpClient';

/**
 * Crea un servicio CRUD estándar para un recurso del API Gateway.
 * Se usa para Clientes, Vehículos, Conductores y Envíos, que
 * comparten el mismo contrato REST (GET/POST/PUT/DELETE).
 *
 * @param {{ base: string, byId: (id: string|number) => string }} endpoint
 */
export function createResourceService(endpoint) {
  return {
    async list(params = {}) {
      const { data } = await httpClient.get(endpoint.base, { params });
      return data; // { items, total, page, pageSize }
    },
    async getById(id) {
      const { data } = await httpClient.get(endpoint.byId(id));
      return data;
    },
    async create(payload) {
      const { data } = await httpClient.post(endpoint.base, payload);
      return data;
    },
    async update(id, payload) {
      const { data } = await httpClient.put(endpoint.byId(id), payload);
      return data;
    },
    async remove(id) {
      await httpClient.delete(endpoint.byId(id));
      return true;
    },
  };
}
