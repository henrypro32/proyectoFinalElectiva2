# Instrucciones de despliegue

Este documento contiene los pasos para ejecutar localmente el backend y el frontend, y las instrucciones para desplegar en AWS (Elastic Beanstalk para el backend y S3+CloudFront para el frontend).

---

## 1) Ejecutar backend localmente (verificar endpoints)

Recomendado: crear un entorno virtual y instalar dependencias.

En Windows (cmd.exe):

```cmd
cd /d d:\Usuarios\Jeferson\Documentos\Electiva2Dev\ProjectFinal
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python EstudiantesServicesJWT.py
```

El backend arrancará en http://0.0.0.0:5000. Puedes probar:

GET http://localhost:5000/public/proyectos
GET http://localhost:5000/seed

El endpoint `/seed` crea datos quemados en memoria (no es persistente entre reinicios).

---

## 2) Ejecutar frontend localmente

```cmd
cd /d d:\Usuarios\Jeferson\Documentos\Electiva2Dev\ProjectFinal\estudiantes-fronted
npm install
npm start
```

La app debe cargar en http://localhost:4200 y, por defecto, el frontend intentará usar `http://localhost:5000` como API. Puedes ajustar la URL del backend en tiempo de ejecución usando la variable global `window.__env.API_URL` (se inyecta por defecto a `http://localhost:5000` en `index.html`).

---

## 3) Preparar archivos para despliegue

Frontend: construir la app (producción):

```cmd
cd estudiantes-fronted
npm run build -- --configuration production
# o: ng build --configuration production

# El build genera la carpeta `dist/` (por ejemplo dist/estudiantes-fronted)
```

Backend:
- Ya existe `requirements.txt` y `Procfile` para ejecutar con gunicorn.

---

## 4) Despliegue sugerido en AWS

Opción A (recomendada para este proyecto):
- Backend: Elastic Beanstalk (Python)
- Frontend: S3 (hosting estático) + CloudFront

Requisitos previos (en tu máquina): `aws` CLI configurado, `eb` CLI instalado, y credenciales con permisos.

### Backend -> Elastic Beanstalk

1. Instalar EB CLI: `pip install awsebcli` (o usar `brew` / paquete de sistema).
2. Inicializar app EB:

```cmd
cd d:\Usuarios\Jeferson\Documentos\Electiva2Dev\ProjectFinal
eb init -p python-3.11 proyecto-final-electiva2 --region us-east-1
# seleccionar la cuenta y crear la aplicación
```

3. Crear entorno y desplegar:

```cmd
eb create proyecto-final-env --single
eb deploy
```

4. Si necesitas variables de entorno (por ejemplo S3 bucket o AWS keys), configúralas:

```cmd
eb setenv AWS_S3_BUCKET=mi-bucket AWS_ACCESS_KEY_ID=XXX AWS_SECRET_ACCESS_KEY=YYY
eb deploy
```

Elastic Beanstalk ejecutará `gunicorn EstudiantesServicesJWT:app` gracias al `Procfile` incluido.

### Frontend -> S3 + CloudFront

1. Crear bucket S3 (único nombre global):

```cmd
aws s3 mb s3://mi-bucket-frontend --region us-east-1
```

2. Hacer público o configurar CloudFront con OAI. Para pruebas rápidas puedes hacer público:

```cmd
aws s3 sync dist/estudiantes-fronted s3://mi-bucket-frontend --delete
# Asegúrate que el index.html y assets se subieron
```

3. (Opcional) Crear distribución CloudFront que apunte al bucket S3 y habilitar https.

4. Para apuntar el frontend al backend desplegado, sobrescribe la variable runtime `window.__env.API_URL` en `index.html` antes de subirlo a S3, o sube un archivo `env.js` que defina `window.__env.API_URL` y referencia `env.js` antes del bundle en `index.html`.

---

## 5) Nota sobre la base de datos

Actualmente el backend usa estructuras en memoria y un endpoint `/seed` para poblar datos de ejemplo. Esto cumple las especificaciones temporales (archivos quemados). Cuando quieras persistencia, te recomiendo RDS (Postgres) y adaptar `EstudiantesServicesJWT.py` para usar SQLAlchemy.

---

Si quieres, puedo:
- Generar automáticamente un `env.js` en `estudiantes-fronted/dist/` con la URL del backend para que al subirlo a S3 use el backend en Elastic Beanstalk.
- Preparar un `Dockerrun.aws.json` o Dockerfile y una configuración para desplegar con ECS/ Fargate si prefieres contenedores.
- Crear una GitHub Action que haga build y despliegue automático a S3/EB cuando se haga push a `FrontoImplementation-local`.

Dime cuál de estas opciones prefieres y preparo los archivos/scripts necesarios.
