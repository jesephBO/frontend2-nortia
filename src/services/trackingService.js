import httpClient from './httpClient';
import { ENDPOINTS } from '../config/apiGateway';

export const trackingService = {
  async getByCode(code) {
    const { data } = await httpClient.get(ENDPOINTS.tracking.byCode(code));
    return data; // { code, status, origin, destination, eta, currentLocation }
  },
  async getEvents(code) {
    const { data } = await httpClient.get(ENDPOINTS.tracking.events(code));
    return data; // [{ id, status, location, timestamp, note }]
  },
  async listActive(params = {}) {
    const { data } = await httpClient.get(ENDPOINTS.tracking.base, { params });
    return data;
  },
};
