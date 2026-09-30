# Event Management — Frontend

Frontend de una aplicación web para la gestión de eventos, desarrollado con Angular 20 y conectado a una API REST desarrollada con Spring Boot.

La aplicación permite consultar eventos, buscar y paginar resultados, consultar el detalle y, según los permisos del usuario, crear, editar y eliminar eventos.

La autenticación se realiza mediante JWT.

## Demo

**Aplicación en producción:**  
[Event Management Frontend](https://event-management-frontend-seven-pink.vercel.app/)

## Tecnologías

* Angular 20
* TypeScript 5.9
* RxJS
* Angular Router
* Angular Reactive Forms
* Angular HttpClient
* Standalone Components
* JWT
* CSS responsive
* Jasmine + Karma
* Vercel

## Funcionalidades

### Autenticación

* Inicio de sesión mediante usuario y contraseña.
* Autenticación mediante JWT.
* Token mantenido en memoria durante la sesión.
* Interceptor HTTP para añadir automáticamente el token Bearer.
* Gestión de respuestas `401 Unauthorized`.
* Protección de rutas mediante guard.
* Cierre de sesión.

### Gestión de eventos

* Listado de eventos.
* Búsqueda por nombre.
* Paginación.
* Consulta del detalle.
* Creación de eventos.
* Edición de eventos.
* Eliminación de eventos.
* Selección de categoría.
* Formularios reactivos con validación.

Las operaciones de modificación están restringidas según los permisos definidos en el backend.

### Interfaz

* Diseño responsive.
* Estados de carga y ausencia de resultados.
* Mensajes de error.
* Navegación mediante Angular Router.
* Formularios de login y gestión de eventos.

## Arquitectura

El proyecto utiliza Angular con componentes standalone y una separación por responsabilidades.

```text
src/app/
├── components/
│   ├── event-detail/
│   ├── event-form/
│   ├── event-list/
│   └── login/
│
├── guard/
│   └── auth-guard
│
├── interceptor/
│   └── auth-interceptor
│
├── model/
│   └── ...
│
├── service/
│   ├── api-service
│   └── auth-service
│
├── app.config.ts
├── app.routes.ts
└── app.ts
```

La comunicación con el backend está centralizada mediante servicios. Las peticiones autenticadas utilizan un interceptor HTTP para gestionar el JWT.

## Seguridad

El frontend utiliza JWT para autenticarse con la API.

El token no se almacena en `localStorage` ni en `sessionStorage`, sino que se mantiene en memoria durante la sesión.

La autorización real se realiza en el backend mediante Spring Security. El frontend adapta la interfaz y protege las rutas según el estado de autenticación, pero el control de permisos definitivo corresponde al backend.

Las respuestas:

* `401 Unauthorized`: sesión no válida o no autenticada.
* `403 Forbidden`: usuario autenticado pero sin permisos suficientes.

## API

El frontend consume una API REST desarrollada con Spring Boot.

API en producción:

```text
https://api-gestion-eventos-prod-b1b0.onrender.com/api/v1
```

El backend utiliza PostgreSQL y está desplegado en Render.

## Desarrollo local

### Requisitos

* Node.js
* npm

### Instalación

```bash
npm install
```

### Servidor de desarrollo

```bash
npm start
```

La aplicación estará disponible en:

```text
http://localhost:4200
```

> La configuración actual del frontend utiliza directamente la API de producción. Para trabajar contra un backend local habría que modificar la URL de la API en `ApiService`.

## Tests

Ejecutar los tests:

```bash
npm test
```

Para ejecutarlos sin modo interactivo:

```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

Estado actual:

```text
16 tests SUCCESS
```

## Build

Generar la build de producción:

```bash
npm run build
```

Los archivos generados se encuentran en:

```text
dist/
```

## Despliegue

El frontend está desplegado en Vercel y conectado al repositorio de GitHub.

El backend está desplegado independientemente en Render.

```text
                    HTTPS + JWT
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  Usuario │ ──► │   Angular    │ ──► │ Spring Boot  │
│          │     │    Vercel    │     │    Render    │
└──────────┘     └──────────────┘     └──────┬───────┘
                                             │
                                             ▼
                                      ┌──────────────┐
                                      │  PostgreSQL  │
                                      └──────────────┘
```

El backend permite mediante CORS el origen de producción del frontend.

## Estado del proyecto

Proyecto funcional desplegado en producción.

Incluye:

* Autenticación JWT.
* Control de acceso basado en permisos.
* CRUD de eventos.
* Búsqueda y paginación.
* Formularios reactivos.
* Protección de rutas.
* Interceptor HTTP.
* Tests unitarios.
* Build de producción.
* Despliegue independiente de frontend y backend.

## Próximas mejoras

* Mensajes específicos para errores `403 Forbidden`.
* Mejoras adicionales de UX.
* Ordenación configurable de eventos.
* Gestión de speakers desde el frontend.
* Configuración de diferentes entornos mediante variables de entorno.
* Tests end-to-end.
