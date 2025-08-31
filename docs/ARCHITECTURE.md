# Arquitectura por módulos

Este documento acompaña el diagrama `src/assets/architecture-modules.svg` y explica brevemente los módulos del proyecto.

## Resumen
- CoreModule: servicios singleton (AuthService, ApiInterceptor), AppShell.
- SharedModule: componentes y utilidades reutilizables (FileCard, Pipes).
- AuthModule (lazy): login, registro, perfil.
- LibraryModule (lazy): upload, búsqueda, lista y detalle de archivos.
- CoursesModule (lazy): gestión de materias y relación con archivos.
- AdminModule (lazy, protegido): gestión de usuarios y aprobación de contenido.
- NotificationsModule: sockets/push; SettingsModule: preferencias.

## Cómo usar
- Diagrama: `src/assets/architecture-modules.svg` (usa en README o slides).
- Admin debe protegerse con un `RoleGuard` que verifique el rol del usuario.
- LibraryModule es el núcleo funcional: exponer endpoints `/library/upload`, `/library/:id`.

## Siguientes pasos
- Añadir el diagrama al `README.md` principal (ej.: `![Arquitectura](src/assets/architecture-modules.svg)`).
- Implementar `RoleGuard` y servicios (AuthService, FileService).
- Generar OpenAPI para endpoints de upload y búsqueda.
