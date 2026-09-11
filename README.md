# Nortia — Frontend de plataforma logística

Frontend en React + Vite + Tailwind para un sistema de gestión logística:
autenticación, clientes, vehículos, conductores, envíos, seguimiento en
tiempo real y analítica. Todo el consumo de datos pasa por un **API
Gateway** centralizado — el frontend nunca llama a un microservicio
directamente.

## Stack

- **React 18 + Vite** — SPA
- **React Router 6** — enrutamiento y rutas protegidas
- **Axios** — cliente HTTP con interceptores (auth token + refresh)
- **Tailwind CSS** — sistema de diseño (tema "operación logística": tinta
  profunda, ámbar de baliza, verde de ruta)
- **Framer Motion** — transiciones de página, entrada de listas, línea de
  ruta animada
- **Recharts** — analítica (ingresos, estado de envíos, utilización de flota)
- **lucide-react** — iconografía

## Arquitectura de consumo de API (API Gateway)

Toda la configuración de endpoints vive en **un solo archivo**:

```
src/config/apiGateway.js
```

Ahí se define `GATEWAY_BASE_URL` (tomada de la variable de entorno
`VITE_API_GATEWAY_URL`) y el mapa `ENDPOINTS`, agrupado por dominio de
negocio (`auth`, `clients`, `vehicles`, `drivers`, `shipments`,
`tracking`, `analytics`). Si el gateway reorganiza rutas o versiones,
solo se edita este archivo.

El cliente HTTP único (`src/services/httpClient.js`) es una instancia de
axios que:

- Antepone `GATEWAY_BASE_URL` a cada request.
- Adjunta el token JWT en cada llamada.
- Refresca el token automáticamente ante un 401 y reintenta la petición.

Cada dominio de negocio tiene su propio servicio delgado
(`src/services/*.js`) que solo usa `httpClient` + `ENDPOINTS`. Los
componentes de página nunca importan `axios` directamente.

```
src/config/apiGateway.js     → URLs (el único lugar a editar por cambios de gateway)
src/services/httpClient.js   → instancia axios + interceptores
src/services/authService.js  → login, register, me, logout
src/services/resourceService.js → factory CRUD genérica
src/services/businessServices.js → clients, vehicles, drivers, shipments
src/services/trackingService.js  → tracking por código
src/services/analyticsService.js → métricas agregadas
```

## Modo demo (sin backend desplegado)

Mientras el API Gateway y los microservicios no estén desplegados, la
app sigue siendo completamente navegable:

- Si `POST /auth/login` o `/auth/register` fallan por error de red, se
  crea una sesión de demostración local para poder recorrer el resto
  del panel.
- Cada página de datos (`clientes`, `vehículos`, `conductores`,
  `envíos`, `seguimiento`, `analítica`) usa el hook `useApiResource`,
  que intenta el endpoint real primero y solo si falla muestra datos
  de ejemplo (`src/data/mockData.js`) con un aviso visible en pantalla.

En cuanto el gateway responde correctamente, este comportamiento deja
de activarse — no hay que cambiar nada en el código.

## Configuración

```bash
cp .env.example .env
# edita VITE_API_GATEWAY_URL con la URL real de tu API Gateway
```

## Instalación y ejecución

```bash
npm install
npm run dev       # entorno de desarrollo, http://localhost:5173
npm run build      # build de producción -> /dist
npm run preview    # sirve el build de producción localmente
```

## Estructura de páginas

| Ruta            | Página                          |
|-----------------|----------------------------------|
| `/login`        | Inicio de sesión                 |
| `/register`     | Registro de cuenta                |
| `/`             | Panel general (resumen operativo) |
| `/clientes`     | Listado y búsqueda de clientes    |
| `/vehiculos`    | Flota                             |
| `/conductores`  | Conductores                       |
| `/envios`       | Envíos                            |
| `/seguimiento`  | Seguimiento en tiempo real por código |
| `/analitica`    | Dashboards de analítica            |

## Contrato esperado del API Gateway

### Clientes (contrato real, implementado en el frontend)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/clientes` | Lista paginada de clientes |
| GET | `/clientes/{id}` | Detalle de un cliente + sus direcciones |
| POST | `/clientes` | Crea cliente (con direcciones opcionales) |
| PUT | `/clientes/{id}` | Actualiza datos de un cliente |
| DELETE | `/clientes/{id}` | Elimina cliente (cascade) |
| GET | `/clientes/{id}/direcciones` | Direcciones de un cliente |
| POST | `/clientes/{id}/direcciones` | Agrega una dirección |
| PUT | `/direcciones/{id}` | Actualiza una dirección |
| DELETE | `/direcciones/{id}` | Elimina una dirección |

Implementado en `src/services/clientsService.js` (contrato propio,
fuera del factory CRUD genérico) y consumido desde:
- `src/pages/Clients.jsx` — listado, crear, editar, eliminar cliente.
- `src/components/clients/ClientFormModal.jsx` — formulario crear/editar.
- `src/components/clients/ClientDetailModal.jsx` — detalle + gestión de direcciones.
- `src/components/clients/AddressFormModal.jsx` — formulario de dirección.

Si tu Swagger (`/docs`) difiere en algún nombre de campo, ajusta el
`payload` que arma cada formulario y la forma de `data` que `clientsService`
retorna — es el único lugar que necesita cambiar.

### Otros dominios (pendientes de contrato real — usan supuestos por ahora)

- `GET /v1/{vehicles|drivers|shipments}` → `{ items, total }` o array
- `GET /v1/tracking/:code` y `GET /v1/tracking/:code/events`
- `GET /v1/analytics/summary|shipments-by-status|revenue-timeline|fleet-utilization`

Ajusta los nombres de campo en `src/data/mockData.js` y en las páginas
si tu backend real usa un contrato distinto. Si me compartes el Swagger
de estos otros microservicios, actualizo `apiGateway.js` y los
servicios correspondientes igual que se hizo con Clientes.
