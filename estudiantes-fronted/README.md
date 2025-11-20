# EstudiantesFronted

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Conectar con el backend (Flask)

Este proyecto frontend espera que el backend esté disponible en http://localhost:5000. A continuación se indican pasos rápidos para ejecutar el backend de Python incluido en el repositorio.

1) Crear un entorno virtual (Windows cmd.exe):

```cmd
python -m venv .venv
.venv\Scripts\activate
```

2) Instalar dependencias para el backend (desde la raíz del proyecto donde están los archivos .py):

```cmd
pip install -r requirements.txt
```

3) Ejecutar el servicio Flask (ejemplo):

```cmd
set FLASK_APP=EstudiantesServicesJWT.py
python -m flask run --host=0.0.0.0 --port=5000
```

4) Ejecutar el frontend (en otra terminal, desde la carpeta `estudiantes-fronted`):

```cmd
cd estudiantes-fronted
npm install
npm run start
```

Notas:
- Si el backend usa credenciales AWS (S3) debes exportar las variables de entorno `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` y `AWS_S3_BUCKET` antes de ejecutar la app.
- Si el backend no está completo, revisa `EstudiantesServicesJWT.py` y `EstudianteGestion.py` para completar los endpoints necesarios.
