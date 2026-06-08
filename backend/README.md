# LifeManager Backend

Backend de LifeManager App construido con NestJS, Prisma y PostgreSQL.

## Stack

- NestJS 11
- TypeScript
- Prisma 7
- PostgreSQL
- Jest
- Docker

## Estructura

```text
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── calendar-events/
│   ├── finances/
│   ├── habits/
│   ├── note-categories/
│   ├── notes/
│   ├── prisma/
│   ├── reminders/
│   └── test/
└── package.json
```

## Variables De Entorno

Ejemplo para desarrollo local usando PostgreSQL desde Docker:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/life_manager_db?schema=public
JWT_SECRET=changeThisSecret
FRONTEND_URL=http://localhost:5173
PORT=3001
```

## Instalacion

```bash
npm install
```

## Prisma

Generar cliente:

```bash
npx prisma generate
```

Aplicar migraciones en produccion/Docker:

```bash
npx prisma migrate deploy
```

Crear o aplicar migraciones en desarrollo:

```bash
npx prisma migrate dev
```

Ejecutar seed:

```bash
npm run seed
```

## Scripts

```bash
npm run start:dev
npm run build
npm run start:prod
npm run test
npm run test:cov
npm run seed
```

## API

Prefijo global:

```text
/api/v1
```

Modulos expuestos:

- `/notes`
- `/note-categories`
- `/calendar-events`
- `/reminders`
- `/habits`
- `/finances`

## Validacion

El servidor usa `ValidationPipe` global con:

- `whitelist: true`
- `forbidNonWhitelisted: true`
- `transform: true`

Esto elimina propiedades no declaradas, rechaza payloads inesperados y transforma valores cuando aplica.

## CORS

En desarrollo permite cualquier origen.

En produccion usa:

```env
FRONTEND_URL
```

## Tests

```bash
npm run test
```

Estado actual:

```text
14 test suites passed
14 tests passed
```

Los tests usan mocks para `PrismaService`, evitando conexion real a base de datos durante pruebas unitarias.

## Consideraciones Tecnicas

- `PrismaService` requiere `DATABASE_URL`.
- El Dockerfile ejecuta `npx prisma generate` durante build.
- El contenedor aplica migraciones con `npx prisma migrate deploy` antes de iniciar.
- Actualmente no hay autenticacion real; los recursos usan `userId` enviado desde el cliente.
