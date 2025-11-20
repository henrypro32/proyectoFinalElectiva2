// Semilla de datos para demos: materias y proyectos
export const DEFAULT_MATERIAS = [
  { id: 'mat-001', nombre: 'Bases de Datos', descripcion: 'Curso de bases de datos' },
  { id: 'mat-002', nombre: 'Estructuras de Datos', descripcion: 'Algoritmos y estructuras' },
  { id: 'mat-003', nombre: 'Sistemas Operativos', descripcion: 'Conceptos de SO' }
];

export const DEFAULT_PROYECTOS = [
  {
    id: 'local-1700000000001',
    titulo: 'Proyecto BD - Normalización',
    descripcion: 'Normalización de una base de datos de biblioteca',
    archivo_url: 'https://example.com/archivos/proyecto-bd.pdf',
    tipo_archivo: 'pdf',
    tamano_archivo: 245678,
    semestre: '2023-2',
    anio: 2023,
    profesor: 'Dr. Gomez',
    estado: 'pendiente',
    descargas: 0,
    vistas: 0,
    usuario_id: 'user-2',
    materia_id: 'mat-001'
  },
  {
    id: 'local-1700000000002',
    titulo: 'Algoritmos en C++',
    descripcion: 'Tareas resueltas del curso de estructuras',
    archivo_url: 'https://example.com/archivos/algos-cpp.zip',
    tipo_archivo: 'zip',
    tamano_archivo: 1024000,
    semestre: '2022-1',
    anio: 2022,
    profesor: 'Ing. Ruiz',
    estado: 'aprobado',
    descargas: 12,
    vistas: 56,
    usuario_id: 'user-2',
    materia_id: 'mat-002'
  },
  {
    id: 'local-1700000000003',
    titulo: 'Reporte SO - Manejo de memoria',
    descripcion: 'Resumen sobre técnicas de manejo de memoria en sistemas operativos',
    archivo_url: 'https://example.com/archivos/so-memoria.pdf',
    tipo_archivo: 'pdf',
    tamano_archivo: 180000,
    semestre: '2021-2',
    anio: 2021,
    profesor: 'Dra. Lara',
    estado: 'aprobado',
    descargas: 3,
    vistas: 10,
    usuario_id: 'user-3',
    materia_id: 'mat-003'
  }
];
