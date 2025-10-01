# 📚 Biblioteca Digital - Ingeniería de Sistemas

Una plataforma web para compartir y consultar trabajos académicos y proyectos entre estudiantes de Ingeniería de Sistemas.

## 🎯 Descripción del Proyecto

La **Biblioteca Digital** es una aplicación web desarrollada en Angular que permite a los estudiantes:

- **Consultar** trabajos y proyectos de semestres anteriores
- **Subir** sus propios trabajos para compartir con la comunidad
- **Filtrar** contenido por materia, categoría, profesor o año
- **Acceder** con autenticación segura y controlada

## 👥 Actores del Sistema

### 🎓 Estudiante
- Se registra e inicia sesión
- Consulta y descarga trabajos
- Sube sus propios proyectos
- Califica y comenta trabajos

### 👨‍🏫 Administrador (Docente/Monitor)
- Modera el contenido (aprobar/rechazar)
- Gestiona usuarios y categorías
- Ve estadísticas de uso
- Configura el sistema

### 👤 Usuario Invitado (Opcional)
- Explora contenido con acceso limitado
- No puede descargar ni subir archivos

## ✨ Funcionalidades Principales

### 🔐 Gestión de Usuarios
- [x] Registro e inicio de sesión con JWT
- [x] Sistema de roles (estudiante/admin)
- [x] Perfiles de usuario
- [x] Recuperación de contraseña

### 📁 Gestión de Trabajos/Proyectos
- [x] Subida de archivos múltiples (PDF, código, documentación)
- [x] Metadatos detallados (materia, semestre, profesor, año)
- [x] Sistema de aprobación por moderadores
- [x] Búsqueda y filtrado avanzado
- [x] Categorización por temas
- [x] Sistema de calificaciones y comentarios

### 🏷️ Gestión de Categorías
- [x] Crear/editar materias y semestres
- [x] Sistema de etiquetas (tags)
- [x] Clasificación por tipo de trabajo

### 📊 Panel de Administración
- [x] Dashboard con estadísticas
- [x] Validación de nuevos aportes
- [x] Gestión de usuarios
- [x] Reportes de uso
- [x] Configuración del sistema

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Angular 18+ (Standalone Components)
- **Estilos**: CSS3 con diseño responsive
- **Estado**: RxJS con BehaviorSubject
- **Formularios**: Angular Reactive Forms
- **Routing**: Angular Router con guards
- **Desarrollo**: TypeScript, Node.js, npm

## 📁 Estructura del Proyecto

```
src/app/
├── shared/
│   └── models/           # Modelos de datos
│       ├── user.model.ts
│       ├── academic-work.model.ts
│       └── admin.model.ts
├── core/
│   ├── auth.ts          # Servicio de autenticación
│   ├── auth-guard.ts    # Guard de autenticación
│   └── role-guard.ts    # Guard de roles
├── auth/
│   ├── login/           # Componente de login
│   ├── register/        # Componente de registro
│   └── profile/         # Perfil de usuario
├── library/
│   ├── file.ts          # Servicio de trabajos académicos
│   ├── file-list/       # Lista de trabajos
│   ├── file-detail/     # Detalle de trabajo
│   ├── upload-form/     # Formulario de subida
│   ├── search-filters/  # Filtros de búsqueda
│   └── my-uploads/      # Mis trabajos subidos
├── admin/
│   ├── admin.service.ts # Servicio de administración
│   ├── dashboard/       # Dashboard administrativo
│   ├── user-management/ # Gestión de usuarios
│   └── content-approval/# Aprobación de contenido
└── courses/
    ├── course-list/     # Lista de materias
    └── course-detail/   # Detalle de materia
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm 9+
- Angular CLI 18+

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/henrypro32/proyectoFinalElectiva2.git
   cd proyectoFinalElectiva2
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm start
   # o
   ng serve
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:4200
   ```

## 👤 Credenciales de Prueba

Para facilitar las pruebas del sistema, se incluyen usuarios predeterminados:

### Estudiante
- **Email**: juan.perez@estudiante.com
- **Contraseña**: password123

### Profesor
- **Email**: maria.garcia@profesor.com
- **Contraseña**: password123

### Administrador
- **Email**: admin@universidad.com
- **Contraseña**: password123

## 📊 Características Implementadas

### ✅ Completadas
- [x] Sistema de autenticación y autorización
- [x] Modelos de datos completos
- [x] Servicios con datos mock
- [x] Componente de login funcional
- [x] Estructura de componentes base
- [x] Sistema de roles y guards
- [x] Formularios reactivos
- [x] Búsqueda y filtrado
- [x] Upload de archivos
- [x] Panel administrativo

### 🔄 En Desarrollo
- [ ] Integración con backend real
- [ ] Base de datos persistente
- [ ] Sistema de notificaciones
- [ ] Optimización de rendimiento
- [ ] Tests unitarios y e2e

### 🚀 Futuras Mejoras
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Chat en tiempo real
- [ ] API REST completa
- [ ] Integración con servicios de nube
- [ ] Sistema de backup automático

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autores

- **Jeferson** - *Desarrollo Frontend* - [jeferson](https://github.com/tu-usuario)
- **Equipo Desarrollo** - *Colaboradores* - [henrypro32](https://github.com/henrypro32)

## 📞 Soporte

Si tienes alguna pregunta o problema:

1. Revisa la documentación en `/docs`
2. Abre un issue en GitHub
3. Contacta al equipo de desarrollo

---

**📚 Universidad - Facultad de Ingeniería**  
*Proyecto Final - Electiva de Desarrollo Web*
