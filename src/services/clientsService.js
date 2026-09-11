import httpClient from './httpClient';
import { ENDPOINTS } from '../config/apiGateway';

/**
 * Servicio de Clientes — contrato real del microservicio (ver /docs, /redoc):
 *
 *  GET    /clientes                        Lista paginada de clientes
 *  GET    /clientes/{id}                   Detalle de un cliente + direcciones
 *  POST   /clientes                        Crea cliente (con direcciones opcionales)
 *  PUT    /clientes/{id}                   Actualiza datos de un cliente
 *  DELETE /clientes/{id}                   Elimina cliente (cascade)
 *  GET    /clientes/{id}/direcciones       Direcciones de un cliente
 *  POST   /clientes/{id}/direcciones       Agrega una dirección
 *  PUT    /direcciones/{id}                Actualiza una dirección
 *  DELETE /direcciones/{id}                Elimina una dirección
 */
export const clientsService = {
  // ---- Clientes ----
  async list(params = {}) {
    const { data } = await httpClient.get(ENDPOINTS.clients.base, { params });
    return data; // esperado: { items, total, page, pageSize } (lista paginada)
  },

  async getById(id) {
    const { data } = await httpClient.get(ENDPOINTS.clients.byId(id));
    return data; // detalle de cliente + sus direcciones
  },

  async create(payload) {
    // payload puede incluir { ...datosCliente, direcciones: [...] } (opcional)
    const { data } = await httpClient.post(ENDPOINTS.clients.base, payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await httpClient.put(ENDPOINTS.clients.byId(id), payload);
    return data;
  },

  async remove(id) {
    // El backend elimina en cascada (cliente + sus direcciones)
    await httpClient.delete(ENDPOINTS.clients.byId(id));
    return true;
  },

  // ---- Direcciones del cliente ----
  async listAddresses(clientId) {
    const { data } = await httpClient.get(ENDPOINTS.clients.addresses(clientId));
    return data;
  },

  async addAddress(clientId, payload) {
    const { data } = await httpClient.post(ENDPOINTS.clients.addresses(clientId), payload);
    return data;
  },

  async updateAddress(addressId, payload) {
    const { data } = await httpClient.put(ENDPOINTS.clients.addressById(addressId), payload);
    return data;
  },

  async removeAddress(addressId) {
    await httpClient.delete(ENDPOINTS.clients.addressById(addressId));
    return true;
  },
};
