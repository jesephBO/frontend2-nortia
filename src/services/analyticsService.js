import httpClient from './httpClient';
import { ENDPOINTS } from '../config/apiGateway';

export const analyticsService = {
  async getSummary() {
    const { data } = await httpClient.get(ENDPOINTS.analytics.summary);
    return data;
  },
  async getShipmentsByStatus() {
    const { data } = await httpClient.get(ENDPOINTS.analytics.shipmentsByStatus);
    return data;
  },
  async getRevenueTimeline(range = '30d') {
    const { data } = await httpClient.get(ENDPOINTS.analytics.revenueTimeline, {
      params: { range },
    });
    return data;
  },
  async getFleetUtilization() {
    const { data } = await httpClient.get(ENDPOINTS.analytics.fleetUtilization);
    return data;
  },
  async getOnTimeRate() {
    const { data } = await httpClient.get(ENDPOINTS.analytics.onTimeRate);
    return data;
  },
};
