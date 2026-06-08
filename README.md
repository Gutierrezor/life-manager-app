# LifeManager App

Aplicacion full-stack para organizar notas, calendario, recordatorios, habitos y finanzas personales desde un dashboard unico.

## Proyecto Para Portafolio

LifeManager App es un proyecto full-stack orientado a demostrar capacidad para construir una aplicacion web completa: frontend, backend, base de datos, Docker, seed, validaciones, tests y documentacion tecnica.

Este proyecto puede presentarse en un curriculo como:

```text
LifeManager App - Aplicacion full-stack de productividad personal
Desarrolle una aplicacion web con React, TypeScript, NestJS, Prisma y PostgreSQL para gestionar notas, calendario, recordatorios, habitos y finanzas. Implemente API REST modular, persistencia relacional, Docker Compose, seed de datos, validacion global, dashboard financiero y tests unitarios.
```

Tecnologias principales:

- React
- TypeScript
- Vite
- NestJS
- Prisma
- PostgreSQL
- Docker Compose
- Jest

El proyecto esta dividido en:

- `frontend`: React + TypeScript + Vite, servido en produccion con Nginx.
- `backend`: NestJS + Prisma + PostgreSQL.
- `postgres`: base de datos PostgreSQL 16 levantada con Docker Compose.

## Estado Actual

El proyecto ya cuenta con:

- Dashboard funcional.
- CRUD base de notas.
- Categorias de notas desde la interfaz.
- Calendario con eventos.
- Recordatorios.
- Habitos con seguimiento de los ultimos 7 dias.
- Finanzas con categorias, transacciones y resumen.
- Seed de datos iniciales.
- Docker Compose para levantar frontend, backend y base de datos.
- Builds de frontend y backend funcionando.
- Tests unitarios del backend pasando con mocks.

## Arquitectura

```text
life-manager-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   └── src/
│       ├── calendar-events/
│       ├── finances/
│       ├── habits/
│       ├── note-categories/
│       ├── notes/
│       ├── prisma/
│       └── reminders/
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       └── App.tsx
├── docs/
│   └── SENIOR_REVIEW.md
└── docker-compose.yml
```

## URLs Locales

Con Docker:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api/v1`
- PostgreSQL host: `localhost:5433`
- PostgreSQL container: `postgres:5432`

En desarrollo local sin Docker, el backend usa por defecto `PORT=3001` si esta definido en `backend/.env`.

## Ejecutar Con Docker

Desde la raiz del proyecto:

```bash
docker compose up --build -d
```

Ver estado:

```bash
docker compose ps
```

Ver logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

Detener:

```bash
docker compose down
```

Detener y borrar datos de PostgreSQL:

```bash
docker compose down -v
```

## Seed De Datos

El frontend usa temporalmente `userId: 1`, por eso existe un seed que crea un usuario demo y datos iniciales asociados.

Ejecutar seed local:

```bash
cd backend
npm run seed
```

El seed crea:

- Usuario demo con `id: 1`.
- Categorias de notas.
- Notas.
- Eventos de calendario.
- Recordatorios.
- Habitos con logs.
- Categorias financieras.
- Transacciones financieras.

## Comandos Principales

Backend:

```bash
cd backend
npm install
npm run seed
npm run build
npm run test
npm run start:dev
```

Frontend:

```bash
cd frontend
npm install
npm run build
npm run dev
```

## Variables De Entorno

Archivo raiz `.env.example`:

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/life_manager_db?schema=public
JWT_SECRET=change-me
VITE_API_URL=http://localhost:3000/api/v1
FRONTEND_URL=http://localhost:5173
```

Backend local recomendado:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/life_manager_db?schema=public
JWT_SECRET=changeThisSecret
FRONTEND_URL=http://localhost:5173
PORT=3001
```

Frontend local recomendado:

```env
VITE_API_URL=http://localhost:3001/api/v1
```

## Modelo De Datos

El schema actual esta en `backend/prisma/schema.prisma`.

Modelos principales:

- `User`: usuario propietario de todos los recursos.
- `NoteCategory`: categorias para notas.
- `Note`: notas con categoria opcional.
- `CalendarEvent`: eventos con fecha de inicio, fin y ubicacion opcional.
- `Reminder`: recordatorios con estado.
- `Habit`: habitos con frecuencia, meta y color.
- `HabitLog`: registros diarios de cumplimiento.
- `FinanceCategory`: categorias financieras por tipo.
- `FinanceTransaction`: movimientos de ingreso o gasto.

Enums:

- `ReminderStatus`: `PENDING`, `COMPLETED`, `CANCELLED`.
- `HabitFrequency`: `DAILY`, `WEEKLY`, `MONTHLY`.
- `TransactionType`: `INCOME`, `EXPENSE`.

## API

Todas las rutas tienen prefijo:

```text
/api/v1
```

### Notas

```text
POST   /notes
GET    /notes
GET    /notes/:id
PATCH  /notes/:id
DELETE /notes/:id
```

### Categorias De Notas

```text
POST   /note-categories
GET    /note-categories
GET    /note-categories/:id
PATCH  /note-categories/:id
DELETE /note-categories/:id
```

### Calendario

```text
POST   /calendar-events
GET    /calendar-events
GET    /calendar-events/:id
PATCH  /calendar-events/:id
DELETE /calendar-events/:id
```

### Recordatorios

```text
POST   /reminders
GET    /reminders
GET    /reminders/:id
PATCH  /reminders/:id
DELETE /reminders/:id
```

### Habitos

```text
POST   /habits
GET    /habits
GET    /habits/:id
PATCH  /habits/:id
POST   /habits/:id/check
DELETE /habits/:id
```

### Finanzas

```text
POST   /finances/categories
GET    /finances/categories
POST   /finances/transactions
GET    /finances/transactions
GET    /finances/transactions/:id
DELETE /finances/transactions/:id
GET    /finances/summary
```

Respuesta esperada del resumen financiero:

```json
{
  "totalIncome": 3500000,
  "totalExpense": 103000,
  "balance": 3397000,
  "totalTransactions": 3
}
```

## Calidad Y Verificacion

Comandos verificados:

```bash
cd backend && npm run test
cd backend && npm run build
cd frontend && npm run build
docker compose up --build -d
```

Estado actual:

- Backend build: OK.
- Frontend build: OK.
- Backend tests: OK.
- Docker Compose: OK.
- Frontend responde en `http://localhost:5173`.
- Backend responde en `http://localhost:3000/api/v1`.

## Decisiones Tecnicas

- NestJS modular por dominio.
- Prisma como capa de acceso a datos.
- PostgreSQL como base relacional.
- `ValidationPipe` global con `whitelist` y `forbidNonWhitelisted`.
- CORS abierto en desarrollo y restringible por `FRONTEND_URL` en produccion.
- React centralizado en `App.tsx` por simplicidad actual.
- Docker Compose como entorno principal de ejecucion.

## Limitaciones Actuales

- El frontend usa `userId: 1` temporalmente.
- No hay autenticacion real aunque existe `JWT_SECRET`.
- La UI esta concentrada en `App.tsx`; conviene dividir componentes.
- Las migraciones historicas tienen ruido de modelos antiguos.
- Los tests actuales validan construccion basica; faltan pruebas de comportamiento.

## Proximos Pasos Recomendados

Prioridad alta:

1. Implementar autenticacion y eliminar `userId: 1`.
2. Separar `App.tsx` en componentes por modulo.
3. Limpiar migraciones antes de una entrega final.
4. Agregar pruebas de servicios con casos reales.

Prioridad media:

1. Crear DTOs de respuesta o tipos compartidos para frontend.
2. Agregar edicion y eliminacion desde UI para categorias.
3. Mejorar manejo de errores visual en formularios.
4. Agregar estados de carga por modulo.

Prioridad baja:

1. Agregar filtros y busqueda.
2. Agregar reportes financieros por fecha.
3. Agregar exportacion/importacion de datos.
4. Mejorar responsive con pruebas visuales.
