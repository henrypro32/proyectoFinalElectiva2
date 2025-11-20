# API (documentación rápida)

Este documento resume los endpoints disponibles en el backend mock (Flask, datos en memoria).

Base URL: http://127.0.0.1:5000

Autenticación: JWT (Authorization: Bearer <token>)

Endpoints principales

- POST /auth/register
  - Body JSON: { email, nombre, password, rol? }
  - Respuesta: 201 creado o 400/409

- POST /auth/login
  - Body JSON: { email, password }
  - Respuesta: { access_token }

- POST /auth/login-test
  - Body JSON: { email, password }
  - Usuarios de prueba: admin@local / adminpass ; user@example.com / secret
  - Respuesta: { access_token }

- GET /seed
  - No requiere auth.
  - Pobla datos en memoria y devuelve { usuarios, materias, proyectos }

- GET /proyectos
  - Requiere JWT en el backend actual.
  - Query params soportados: estado, usuario_id, materia_id
  - Retorna array de proyectos (JSON)

- GET /public/proyectos
  - NO requiere auth (endpoint público para desarrollo)
  - Query params soportados: estado, usuario_id, materia_id
  - Retorna array de proyectos (JSON)

- POST /proyectos
  - Requiere JWT
  - Body JSON: { titulo, descripcion, archivo_url, tipo_archivo, tamano_archivo, semestre, anio, profesor, materia_id }
  - Crea proyecto en memoria con estado 'pendiente'

- GET /proyectos/<id>
  - Requiere JWT

- PUT /proyectos/<id>
  - Requiere JWT
  - Actualiza campos permitidos

- DELETE /proyectos/<id>
  - Requiere JWT

- POST /proyectos/upload-url
  - Requiere JWT
  - Body: { filename }
  - Devuelve un presigned URL generado por boto3 (stub). En local puede devolver URL funcional si AWS creds están configuradas.

ADMIN (solo rol admin)

- GET /admin/proyectos-pendientes
  - Requiere JWT de admin

- PUT /admin/proyectos/<id>/estado
  - Requiere JWT de admin
  - Body: { estado: 'aprobado'|'rechazado' }

Notas
-----
- Actualmente la lógica de autenticación usa el email como identidad en el JWT. La verificación de rol se hace buscando el usuario en la lista en memoria.
- Para producción: sustituir almacenamiento en memoria por PostgreSQL y proteger el secret JWT con variables de entorno seguras.

