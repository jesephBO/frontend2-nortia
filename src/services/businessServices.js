import { ENDPOINTS } from '../config/apiGateway';
import { createResourceService } from './resourceService';

// clientsService vive en su propio archivo (src/services/clientsService.js)
// porque tiene endpoints adicionales de direcciones que no siguen el
// contrato CRUD genérico.
export const vehiclesService = createResourceService(ENDPOINTS.vehicles);
export const driversService = createResourceService(ENDPOINTS.drivers);
export const shipmentsService = createResourceService(ENDPOINTS.shipments);
