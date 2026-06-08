# LifeManager App Para Curriculo

Este documento resume como presentar LifeManager App en un curriculo, LinkedIn, GitHub o entrevista tecnica.

## Titulo Corto

LifeManager App - Aplicacion full-stack de productividad personal

## Descripcion Para Curriculo

Desarrolle una aplicacion web full-stack para gestionar notas, calendario, recordatorios, habitos y finanzas personales, usando React, TypeScript, NestJS, Prisma y PostgreSQL. Implemente una API REST modular, persistencia relacional, dashboard financiero, seguimiento de habitos por dias, seed de datos, Docker Compose y pruebas unitarias.

## Version Corta Para CV

```text
LifeManager App | React, TypeScript, NestJS, Prisma, PostgreSQL, Docker
- Construccion de una aplicacion full-stack para productividad personal con modulos de notas, calendario, recordatorios, habitos y finanzas.
- Diseno de API REST modular en NestJS con validacion global, Prisma ORM y PostgreSQL.
- Implementacion de dashboard financiero, seguimiento de habitos por 7 dias, seed de datos, Docker Compose y tests unitarios con Jest.
```

## Version Para LinkedIn

```text
Construí LifeManager App, una aplicación full-stack de productividad personal con React, TypeScript, NestJS, Prisma y PostgreSQL.

El proyecto incluye módulos de notas, calendario, recordatorios, hábitos y finanzas, además de dashboard financiero, seguimiento visual de hábitos, seed de datos, Docker Compose y pruebas unitarias.

Lo desarrollé con enfoque de arquitectura modular, validación de datos, persistencia relacional y documentación técnica para facilitar ejecución, mantenimiento y presentación del proyecto.
```

## Pitch De 30 Segundos

LifeManager App es una aplicacion full-stack que centraliza productividad personal: notas, calendario, recordatorios, habitos y finanzas. La construi con React y TypeScript en el frontend, NestJS en el backend, Prisma como ORM y PostgreSQL como base de datos. Tambien la deje lista para ejecucion con Docker Compose, seed de datos, validaciones globales y tests unitarios. El proyecto demuestra que puedo llevar una idea desde modelo de datos hasta UI funcional, API REST, pruebas y documentacion.

## Que Demuestra Este Proyecto

- Capacidad para construir un producto full-stack completo.
- Organizacion de backend por modulos de dominio.
- Manejo de base de datos relacional con Prisma.
- Construccion de una API REST mantenible.
- Integracion frontend-backend con Axios.
- Uso de Docker Compose para entorno reproducible.
- Pruebas unitarias basicas con Jest.
- Documentacion tecnica para otros desarrolladores.

## Funcionalidades Presentables

- Dashboard con resumen financiero.
- CRUD base de notas.
- Categorias de notas desde la interfaz.
- Calendario de eventos.
- Recordatorios.
- Habitos con fila de seguimiento de los ultimos 7 dias.
- Finanzas con ingresos, gastos, balance, categorias y transacciones.
- Seed de datos iniciales.
- Docker Compose para levantar todo el proyecto.

## Tecnologias

Frontend:

- React
- TypeScript
- Vite
- Axios
- CSS

Backend:

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Jest

DevOps/local:

- Docker
- Docker Compose
- Nginx

## Puntos Para Explicar En Entrevista

### Arquitectura

El backend esta separado por dominios: notas, categorias, calendario, recordatorios, habitos y finanzas. Cada modulo tiene controller, service y DTOs. Prisma centraliza el acceso a datos mediante `PrismaService`.

### Base De Datos

Use PostgreSQL con Prisma. El modelo principal es `User`, relacionado con notas, categorias, eventos, recordatorios, habitos, logs de habitos, categorias financieras y transacciones.

### Validacion

El backend usa `ValidationPipe` global con whitelist y rechazo de propiedades no declaradas, para proteger los contratos de entrada.

### Docker

El proyecto se ejecuta con `docker compose up --build -d`, levantando PostgreSQL, backend y frontend. El frontend se sirve con Nginx y el backend aplica migraciones antes de iniciar.

### Tests

Los tests unitarios del backend usan mocks de Prisma para validar que controllers y services se construyen sin depender de una base real.

## Limitaciones Que Puedes Mencionar Con Honestidad

Este proyecto esta en fase MVP. Actualmente usa un usuario demo con `userId: 1`; el siguiente paso profesional es implementar autenticacion real con JWT, eliminar el usuario hardcodeado y derivar el usuario desde el token.

Otras mejoras planeadas:

- Dividir `App.tsx` en vistas y hooks.
- Agregar tests de comportamiento.
- Limpiar migraciones para una version final.
- Agregar autenticacion.
- Agregar despliegue publico.

## Checklist Antes De Publicarlo En GitHub

- [x] README principal claro.
- [x] README de backend.
- [x] README de frontend.
- [x] Revision senior documentada.
- [x] Seed disponible.
- [x] Tests backend pasando.
- [x] Builds pasando.
- [x] Docker Compose operativo.
- [ ] Agregar capturas de pantalla.
- [ ] Agregar demo desplegada.
- [ ] Agregar `.env.example` revisado.
- [ ] Agregar licencia si sera publico.

## Recomendacion Para El Repositorio

Nombre sugerido:

```text
life-manager-app
```

Descripcion corta de GitHub:

```text
Full-stack personal productivity app built with React, TypeScript, NestJS, Prisma, PostgreSQL and Docker.
```

Topics sugeridos:

```text
react typescript nestjs prisma postgresql docker fullstack productivity-app
```
