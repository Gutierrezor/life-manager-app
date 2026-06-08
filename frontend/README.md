# LifeManager Frontend

Frontend de LifeManager App construido con React, TypeScript y Vite.

## Stack

- React 19
- TypeScript
- Vite
- Axios
- Nginx para servir el build en Docker

## Estructura

```text
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── api.ts
│   ├── components/
│   │   ├── CalendarView.tsx
│   │   └── Toast.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
└── package.json
```

## Variables De Entorno

Desarrollo local:

```env
VITE_API_URL=http://localhost:3001/api/v1
```

Docker:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Si no se define `VITE_API_URL`, el frontend usa:

```text
http://localhost:3001/api/v1
```

## Instalacion

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

URL usual:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Vistas Principales

- Dashboard.
- Notas.
- Calendario.
- Recordatorios.
- Habitos.
- Finanzas.

## Funcionalidades Actuales

### Dashboard

- Resumen financiero.
- Transacciones recientes.
- Notas recientes.

### Notas

- Crear notas.
- Seleccionar categoria.
- Crear categorias de notas.
- Ver notas existentes.

### Calendario

- Crear, actualizar y eliminar eventos mediante `CalendarView`.

### Recordatorios

- Crear recordatorios.
- Listar recordatorios.

### Habitos

- Crear habitos.
- Marcar o desmarcar el dia actual.
- Ver los ultimos 7 dias por habito.

### Finanzas

- Crear categorias financieras.
- Crear transacciones.
- Ver resumen financiero.
- Ver movimientos.

## Consideraciones Tecnicas

- La API se centraliza en `src/api/api.ts`.
- La moneda se guarda en `localStorage` bajo `lm:currency`.
- El frontend usa temporalmente `userId: 1`.
- `App.tsx` concentra gran parte de la logica; conviene dividirlo por vistas en una siguiente fase.
