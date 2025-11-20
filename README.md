# Plataforma de Proyectos Académicos (Mock)

Objetivo
-------
Crear una plataforma web donde estudiantes de Ingeniería de Sistemas puedan consultar y compartir trabajos/proyectos de semestres anteriores.

Notas importantes
-----------------
- Este repositorio contiene un backend en Python/Flask que usa datos en memoria (seed) — NO se conecta a una base de datos real. La persistencia la implementará otra persona.
- El frontend es Angular (standalone components). Está preparado para consumir los endpoints del backend.

Arquitectura técnica (plan/plataforma propuesta)
----------------------------------------------
- Frontend: Angular (despliegue por ejemplo en Cloudflare Pages)
- Backend: Python + Flask (en producción se sugiere empaquetar como AWS Lambda detrás de API Gateway)
- Base de datos: PostgreSQL (AWS RDS) — no implementado aquí
- Almacenamiento: AWS S3 (archivos PDF/ZIP)
- Autenticación: JWT con roles (estudiante / admin)

Estructura principal de datos (esquema sugerido)
-----------------------------------------------
usuarios (id, email, nombre, password_hash, rol, fecha_registro)
materias (id, nombre, descripcion)
proyectos (id, titulo, descripcion, archivo_url, tipo_archivo, tamano_archivo, semestre, anio, profesor, estado, descargas, vistas, usuario_id, materia_id)

Endpoints implementados (mock / en memoria)
-----------------------------------------
- POST /auth/register         -> Registrar usuario (mock)
- POST /auth/login            -> Login (verifica contra usuarios en memoria y devuelve JWT)
- POST /auth/login-test       -> Login de prueba (admin@local/adminpass, user@example.com/secret)
- GET  /seed                 -> Poblado en memoria: retorna usuarios, materias y proyectos de ejemplo (útil para front sin login)
- GET  /proyectos            -> Lista proyectos (requiere JWT en backend actual; frontend usa /seed como fallback)
- POST /proyectos            -> Crea proyecto (requiere JWT; se marca 'pendiente')
- GET  /proyectos/<id>       -> Obtener proyecto por id
- PUT  /proyectos/<id>       -> Actualizar proyecto
- DELETE /proyectos/<id>     -> Eliminar proyecto
- POST /proyectos/upload-url -> Retorna presigned URL (stub con boto3; necesita credenciales reales en producción)
- GET  /admin/proyectos-pendientes  -> Solo admin, projects en estado 'pendiente'
- PUT  /admin/proyectos/<id>/estado -> Solo admin, cambiar estado (aprobado/rechazado)

Cómo ejecutar localmente (Windows, cmd.exe)
------------------------------------------
1) Backend (Flask, datos en memoria)

   - Asegúrate de tener Python 3.8+ y `pip`.
   - Dentro de la carpeta del proyecto (donde está `EstudiantesServicesJWT.py`):

```cmd
cd /d "d:\Usuarios\Jeferson\Documentos\Electiva2Dev\ProjectFinal"
pip install -r requirements.txt
python EstudiantesServicesJWT.py
```

   - El servidor correrá por defecto en `http://0.0.0.0:5000`.
   - Para poblar los datos de prueba (si es necesario), llamar:

```cmd
curl http://127.0.0.1:5000/seed
```

2) Frontend (Angular)

   - Desde la carpeta `estudiantes-fronted`:

```cmd
cd /d "d:\Usuarios\Jeferson\Documentos\Electiva2Dev\ProjectFinal\estudiantes-fronted"
npm install
npm run start -- --port 4300
```

   - Abrir `http://localhost:4300/` en el navegador. La app redirige a `/proyectos` por defecto y usa `/seed` como fallback cuando no hay JWT.

Comandos útiles (Windows - cmd.exe)
---------------------------------
- Obtener token de prueba (login rápido):

```cmd
curl -X POST http://127.0.0.1:5000/auth/login-test -H "Content-Type: application/json" -d "{\"email\":\"admin@local\",\"password\":\"adminpass\"}"
```

- Listar proyectos (sin token, usa /seed en front) / Con token para /proyectos:

```cmd
REM Con token en variable de entorno (ejemplo en cmd):
set TOKEN=eyJhbGciOiJI... (reemplaza con el access_token real)
curl -H "Authorization: Bearer %TOKEN%" http://127.0.0.1:5000/proyectos

REM Sin token (usar seed directamente):
curl http://127.0.0.1:5000/seed
```

Notas para quien implemente la BD
--------------------------------
- La API actual funciona con estructuras en memoria. Para persistencia real hay que mapear las entidades `usuarios`, `materias`, `proyectos` a tablas en PostgreSQL y reemplazar las operaciones sobre listas por consultas SQL (por ejemplo usando SQLAlchemy o raw psycopg).
- Mantener la interfaz HTTP (endpoints y payloads) para que el frontend no tenga que cambiar.

Contacto
--------
Si quieres, puedo:
- ajustar el backend para aceptar `GET /proyectos` sin JWT (para pruebas),
- o añadir un archivo JSON estático `/mock/proyectos.json` y servirlo desde el frontend.

