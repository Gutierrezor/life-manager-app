# Life Manager App

Life Manager App es una aplicación full stack para gestionar tareas, gastos, recordatorios y eventos de agenda desde un panel personal moderno.

El proyecto está construido con un backend en NestJS, una base de datos PostgreSQL administrada con Prisma ORM, y un frontend en React con Vite. Todo el entorno puede ejecutarse usando Docker Compose.

## Tecnologías utilizadas

### Backend

- NestJS
- TypeScript
- Prisma ORM 7
- PostgreSQL
- Swagger
- Docker

### Frontend

- React
- Vite
- TypeScript
- Axios
- CSS personalizado

### Infraestructura

- Docker
- Docker Compose

## Nuevas funcionalidades añadidas

- Inicio de sesión con JWT y rutas protegidas en el backend.
- Módulo real de hábitos con CRUD completo.
- Finanzas mejoradas con ingresos, gastos y cálculo de balance.
- Edición y eliminación de registros desde el frontend con confirmación.
- Seed de datos de ejemplo para usuarios, gastos, ingresos, hábitos, recordatorios y agenda.
- Preparación de despliegue con Docker Compose y configuración de variables de entorno.

## Capturas de pantalla

![Pantalla de login](docs/screenshot-login.png)
![Dashboard financiero](docs/screenshot-dashboard.png)

> Agrega tus capturas en la carpeta `docs/` y actualiza los nombres de archivo si es necesario.
- PostgreSQL 16
- Nginx para servir el frontend en producción

## Cómo ejecutar localmente

1. Configura las variables de entorno necesarias en `backend/.env`.
2. Arranca el entorno con Docker Compose:
	- `docker compose up --build`
3. Abre el frontend en `http://localhost:5173`.
4. La API queda disponible en `http://localhost:3000/api/v1`.

## Seed de datos

Usa el script de seed en el backend para poblar datos de ejemplo:

```bash
cd backend
npm run seed
```

## Usuario de prueba

- Correo: `admin@life.app`
- Contraseña: `Life@2026`
- PostgreSQL 16
- Nginx para servir el frontend en producción

## Estructura del proyecto

```text
life-manager-app/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── agenda/
│   │   ├── expenses/
│   │   ├── prisma/
│   │   ├── reminders/
│   │   └── tasks/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── App.tsx
│   │   ├── components/
│   │   └── App.css
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
