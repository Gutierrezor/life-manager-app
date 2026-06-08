# Senior Review

Este documento resume una revision tecnica del estado actual de LifeManager App desde una perspectiva de mantenimiento, escalabilidad y entrega.

## Resumen Ejecutivo

La aplicacion tiene una base solida para un MVP:

- Backend modular en NestJS.
- Persistencia relacional con Prisma y PostgreSQL.
- Frontend funcional en React.
- Docker Compose operativo.
- Seed repetible para datos demo.
- Builds y tests pasando.

El principal riesgo tecnico no esta en que la app no funcione, sino en que todavia mezcla decisiones de prototipo con necesidades de producto real. El caso mas importante es `userId: 1` en frontend.

## Fortalezas

### Arquitectura Del Backend

Los modulos estan separados por dominio:

- `notes`
- `note-categories`
- `calendar-events`
- `reminders`
- `habits`
- `finances`
- `prisma`

Esto permite evolucionar cada area sin mezclar demasiada logica.

### Modelo De Datos

El schema cubre bien la idea del producto:

- Notas con categorias.
- Calendario.
- Recordatorios.
- Habitos con logs diarios.
- Finanzas con categorias y transacciones.

Las relaciones usan `onDelete` razonables:

- Datos del usuario se eliminan en cascada.
- Categorias opcionales usan `SetNull` para no borrar notas o transacciones.

### Infraestructura Local

Docker Compose levanta:

- PostgreSQL.
- Backend.
- Frontend.

Esto reduce friccion para probar el proyecto.

### Validacion

El backend usa `ValidationPipe` global con:

- `whitelist: true`
- `forbidNonWhitelisted: true`
- `transform: true`

Esto es una buena base para proteger contratos de API.

## Riesgos Tecnicos

### 1. `userId: 1` En Frontend

Impacto: alto.

El frontend crea recursos usando un usuario fijo. Funciona con el seed actual, pero no escala a usuarios reales.

Recomendacion:

- Implementar autenticacion.
- Guardar sesion/token.
- Obtener `userId` desde backend, no desde el cliente.
- Idealmente, que los endpoints deriven el usuario del token y no acepten `userId` en el body.

### 2. Frontend Concentrado En `App.tsx`

Impacto: medio-alto.

`App.tsx` contiene estado, formularios, renderizado y handlers de multiples dominios. Es aceptable para MVP, pero dificulta mantenimiento.

Recomendacion:

- Separar por vistas:
  - `DashboardView`
  - `NotesView`
  - `FinancesView`
  - `HabitsView`
  - `RemindersView`
  - `CalendarView`
- Extraer hooks:
  - `useDashboardData`
  - `useToast`
  - `useCurrency`

### 3. Migraciones Con Historia Sucia

Impacto: medio.

Hay migraciones historicas de modelos anteriores. En desarrollo no bloquea, pero para entrega profesional conviene limpiar.

Recomendacion:

- Mantenerlas mientras se desarrolla.
- Antes de entrega final, reiniciar migraciones en una rama controlada.
- Crear una migracion inicial limpia desde el schema actual.

### 4. Tests Poco Profundos

Impacto: medio.

Los tests pasan, pero actualmente validan principalmente que controllers/services se construyen.

Recomendacion:

- Agregar pruebas de comportamiento para servicios.
- Probar errores `NotFoundException`.
- Probar resumen financiero.
- Probar check/uncheck de habitos.

### 5. Sin Autenticacion Real

Impacto: alto si el proyecto va a produccion.

Existe `JWT_SECRET`, pero no hay flujo de auth completo.

Recomendacion:

- Crear modulo `auth`.
- Hash de password con bcrypt/argon2.
- Login con JWT.
- Guards en endpoints.
- `User` derivado del token.

## Observaciones Por Modulo

### Notes

Estado: funcional.

Bien:

- CRUD completo.
- Categoria opcional.
- Incluye categoria en consultas.

Mejorar:

- Busqueda por texto.
- Filtro por categoria.
- Favoritos visibles en UI.

### Note Categories

Estado: funcional.

Bien:

- CRUD backend completo.
- Creacion desde frontend.

Mejorar:

- Edicion y eliminacion desde frontend.
- Validacion de colores hex.

### Calendar Events

Estado: funcional.

Bien:

- CRUD backend completo.
- Vista dedicada en frontend.

Mejorar:

- Validar que `endDate` sea posterior a `startDate`.
- Vista mensual/semanal mas completa si el producto crece.

### Reminders

Estado: funcional.

Bien:

- CRUD backend completo.
- Estados definidos por enum.

Mejorar:

- Acciones de completar/cancelar desde UI.
- Filtros por estado.

### Habits

Estado: funcional y visualmente mejorado.

Bien:

- Logs diarios.
- Toggle de dia actual.
- Fila visual de ultimos 7 dias.

Mejorar:

- Permitir marcar dias pasados.
- Mostrar racha actual.
- Mostrar porcentaje semanal.

### Finances

Estado: funcional.

Bien:

- Categorias por tipo.
- Transacciones.
- Summary correcto con `totalIncome`, `totalExpense`, `balance`.
- Creacion de categorias desde UI.

Mejorar:

- Filtro por rango de fechas.
- Edicion/eliminacion desde UI.
- Graficos o breakdown por categoria.

## Recomendaciones De Refactor

### Frontend

Estructura propuesta:

```text
frontend/src/
├── api/
│   ├── api.ts
│   ├── finances.ts
│   ├── habits.ts
│   └── notes.ts
├── components/
│   ├── Toast.tsx
│   └── CalendarView.tsx
├── hooks/
│   ├── useDashboardData.ts
│   └── useToast.ts
├── views/
│   ├── DashboardView.tsx
│   ├── FinancesView.tsx
│   ├── HabitsView.tsx
│   ├── NotesView.tsx
│   └── RemindersView.tsx
└── App.tsx
```

### Backend

Estructura actual es correcta. Los proximos cambios deberian ser:

- `auth/`
- `users/`
- guards para proteger rutas.
- decorador `@CurrentUser()`.

## Checklist De Entrega

Antes de considerar el proyecto listo para presentar:

- [x] Frontend build.
- [x] Backend build.
- [x] Docker Compose operativo.
- [x] Seed operativo.
- [x] Tests unitarios pasando.
- [x] README principal documentado.
- [ ] Autenticacion real.
- [ ] Limpieza de migraciones.
- [ ] Tests de comportamiento.
- [ ] README de despliegue.
- [ ] Variables de entorno seguras para produccion.

## Roadmap Tecnico

### Fase 1: Estabilizacion

- Mantener Docker como camino oficial.
- Documentar setup.
- Mantener seed repetible.
- Corregir errores visibles de UI.

### Fase 2: Producto Real

- Autenticacion.
- Usuarios reales.
- Separar frontend por vistas.
- Mejorar validaciones de negocio.

### Fase 3: Calidad

- Tests de comportamiento.
- E2E basicos.
- Limpieza de migraciones.
- CI simple con build + test.

### Fase 4: Experiencia

- Filtros.
- Busqueda.
- Estadisticas.
- Mejoras visuales.
- Responsive audit.
