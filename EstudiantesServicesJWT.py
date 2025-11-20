
from flask import Flask, request, jsonify
from EstudianteGestion import Usuario, ProyectoAcademico, Materia
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import boto3
import os
from uuid import uuid4

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'uptc2025'
jwt = JWTManager(app)

# Simulación de base de datos en memoria
usuarios = []
proyectos = []
materias = []
estudiantes = []

# --- Datos de prueba (seed) ---
# Crear dos usuarios: un admin y un estudiante
try:
    admin_pass = generate_password_hash('adminpass')
    alumno_pass = generate_password_hash('secret')
    admin = Usuario(str(uuid4()), 'admin@local', 'Admin', admin_pass, 'admin')
    alumno = Usuario(str(uuid4()), 'user@example.com', 'Estudiante', alumno_pass, 'estudiante')
    usuarios.append(admin.to_json())
    usuarios.append(alumno.to_json())

    # Crear una materia de prueba
    materia = Materia(str(uuid4()), 'Matemáticas', 'Matemáticas básicas')
    materias.append(materia.to_json())

    # Crear un proyecto de prueba asociado al alumno
    proyecto_demo = ProyectoAcademico(
        id=str(uuid4()),
        titulo='Proyecto de ejemplo',
        descripcion='Este es un proyecto de demostración',
        archivo_url='https://example.com/archivo.pdf',
        tipo_archivo='pdf',
        tamano_archivo=12345,
        semestre='I',
        anio=2025,
        profesor='Dr. Profesor',
        estado='aprobado',
        descargas=10,
        vistas=25,
        usuario_id=alumno.to_json()['id'],
        materia_id=materia.to_json()['id']
    )
    proyectos.append(proyecto_demo.to_json())
except Exception:
    # Si algo falla aquí, no obstaculizamos el arranque (por ejemplo en entornos sin werkzeug)
    pass


def seed_data():
    """Limpia y crea datos de ejemplo: usuarios, materias y proyectos."""
    global usuarios, proyectos, materias
    usuarios = []
    proyectos = []
    materias = []

    # Usuarios
    admin_pass = generate_password_hash('adminpass')
    alumno_pass = generate_password_hash('secret')
    admin = Usuario(str(uuid4()), 'admin@local', 'Admin', admin_pass, 'admin')
    alumno = Usuario(str(uuid4()), 'user@example.com', 'Estudiante', alumno_pass, 'estudiante')
    otro = Usuario(str(uuid4()), 'otro@local', 'Otro', generate_password_hash('otro123'), 'estudiante')
    usuarios.extend([admin.to_json(), alumno.to_json(), otro.to_json()])

    # Materias
    mat1 = Materia(str(uuid4()), 'Matemáticas', 'Matemáticas básicas')
    mat2 = Materia(str(uuid4()), 'Programación', 'Introducción a la programación')
    materias.extend([mat1.to_json(), mat2.to_json()])

    # Proyectos de ejemplo
    p1 = ProyectoAcademico(
        id=str(uuid4()),
        titulo='Proyecto de Álgebra',
        descripcion='Resolución de problemas algebraicos',
        archivo_url='https://example.com/algebra.pdf',
        tipo_archivo='pdf',
        tamano_archivo=102400,
        semestre='I',
        anio=2025,
        profesor='Dr. Álgebra',
        estado='aprobado',
        descargas=15,
        vistas=150,
        usuario_id=alumno.to_json()['id'],
        materia_id=mat1.to_json()['id']
    )

    p2 = ProyectoAcademico(
        id=str(uuid4()),
        titulo='App de Tareas',
        descripcion='Aplicación web para gestionar tareas',
        archivo_url='https://example.com/tareas.zip',
        tipo_archivo='zip',
        tamano_archivo=204800,
        semestre='II',
        anio=2025,
        profesor='Ing. Sistemas',
        estado='pendiente',
        descargas=3,
        vistas=45,
        usuario_id=otro.to_json()['id'],
        materia_id=mat2.to_json()['id']
    )

    p3 = ProyectoAcademico(
        id=str(uuid4()),
        titulo='Proyecto de Programación',
        descripcion='Implementación de algoritmos clásicos',
        archivo_url='https://example.com/algos.pdf',
        tipo_archivo='pdf',
        tamano_archivo=51200,
        semestre='I',
        anio=2024,
        profesor='Dra. Programación',
        estado='rechazado',
        descargas=0,
        vistas=12,
        usuario_id=alumno.to_json()['id'],
        materia_id=mat2.to_json()['id']
    )

    proyectos.extend([p1.to_json(), p2.to_json(), p3.to_json()])


@app.route('/seed', methods=['GET'])
def seed_endpoint():
    try:
        seed_data()
        return jsonify({
            'mensaje': 'Datos seed creados',
            'usuarios': usuarios,
            'materias': materias,
            'proyectos': proyectos
        }), 200
    except Exception as e:
        return jsonify({'mensaje': 'Error creando seed', 'error': str(e)}), 500


# Configuración AWS S3 (ajusta tus credenciales y bucket)
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID', 'FAKE_KEY')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY', 'FAKE_SECRET')
AWS_S3_BUCKET = os.environ.get('AWS_S3_BUCKET', 'mi-bucket-academico')
s3 = boto3.client('s3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

# Decorador para endpoints admin
def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_email = get_jwt_identity()
        user = next((u for u in usuarios if u['email'] == user_email), None)
        if user and user['rol'] == 'admin':
            return fn(*args, **kwargs)
        return jsonify({"mensaje": "Acceso restringido a administradores"}), 403
    return wrapper


# AUTH
@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    nombre = data.get('nombre')
    password = data.get('password')
    rol = data.get('rol', 'estudiante')
    if not email or not nombre or not password:
        return jsonify({"mensaje": "Faltan campos obligatorios"}), 400
    if any(u for u in usuarios if u['email'] == email):
        return jsonify({"mensaje": "El usuario ya existe"}), 409
    password_hash = generate_password_hash(password)
    usuario = Usuario(str(uuid4()), email, nombre, password_hash, rol)
    usuarios.append(usuario.to_json())
    return jsonify({"mensaje": "Usuario registrado exitosamente"}), 201

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    usuario = next((u for u in usuarios if u['email'] == email), None)
    if usuario and check_password_hash(usuario['password_hash'], password):
        access_token = create_access_token(identity=usuario['email'])
        return jsonify(access_token=access_token), 200
    return jsonify({"mensaje": "Credenciales incorrectas"}), 401


# Endpoint de depuración (temporal): listar usuarios en memoria
@app.route('/_debug/users', methods=['GET'])
def _debug_users():
    # Devuelve la lista completa de usuarios en memoria (incluye password_hash)
    return jsonify(usuarios)


# Endpoint de login de prueba (no seguro) — facilita pruebas locales con los usuarios seed.
@app.route('/auth/login-test', methods=['POST'])
def login_test():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    # Usuario de pruebas creados en seed: admin@local/adminpass y user@example.com/secret
    if (email == 'admin@local' and password == 'adminpass') or (email == 'user@example.com' and password == 'secret'):
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token), 200
    return jsonify({"mensaje": "Credenciales incorrectas (test)"}), 401

# PROYECTOS
@app.route('/proyectos', methods=['GET'])
@jwt_required()
def listar_proyectos():
    # Filtros: estado, usuario_id, materia_id, etc.
    estado = request.args.get('estado')
    usuario_id = request.args.get('usuario_id')
    materia_id = request.args.get('materia_id')
    filtrados = proyectos
    if estado:
        filtrados = [p for p in filtrados if p['estado'] == estado]
    if usuario_id:
        filtrados = [p for p in filtrados if p['usuario_id'] == usuario_id]
    if materia_id:
        filtrados = [p for p in filtrados if p['materia_id'] == materia_id]
    return jsonify(filtrados)


@app.route('/public/proyectos', methods=['GET'])
def listar_proyectos_publicos():
    """Endpoint público que devuelve proyectos sin requerir JWT.
    Útil para desarrollo y para el frontend cuando no hay sesión activa.
    """
    estado = request.args.get('estado')
    usuario_id = request.args.get('usuario_id')
    materia_id = request.args.get('materia_id')
    filtrados = proyectos
    if estado:
        filtrados = [p for p in filtrados if p['estado'] == estado]
    if usuario_id:
        filtrados = [p for p in filtrados if p['usuario_id'] == usuario_id]
    if materia_id:
        filtrados = [p for p in filtrados if p['materia_id'] == materia_id]
    return jsonify(filtrados)

@app.route('/proyectos', methods=['POST'])
@jwt_required()
def crear_proyecto():
    data = request.get_json()
    usuario_email = get_jwt_identity()
    usuario = next((u for u in usuarios if u['email'] == usuario_email), None)
    if not usuario:
        return jsonify({"mensaje": "Usuario no encontrado"}), 404
    # Se espera que el archivo ya esté subido a S3 y se pase la URL
    proyecto = ProyectoAcademico(
        id=str(uuid4()),
        titulo=data.get('titulo'),
        descripcion=data.get('descripcion'),
        archivo_url=data.get('archivo_url'),
        tipo_archivo=data.get('tipo_archivo'),
        tamano_archivo=data.get('tamano_archivo'),
        semestre=data.get('semestre'),
        anio=data.get('anio'),
        profesor=data.get('profesor'),
        estado='pendiente',
        descargas=0,
        vistas=0,
        usuario_id=usuario['id'],
        materia_id=data.get('materia_id')
    )
    proyectos.append(proyecto.to_json())
    return jsonify({"mensaje": "Proyecto creado exitosamente"}), 201

@app.route('/proyectos/<proyecto_id>', methods=['GET'])
@jwt_required()
def obtener_proyecto(proyecto_id):
    proyecto = next((p for p in proyectos if p['id'] == proyecto_id), None)
    if proyecto:
        return jsonify(proyecto), 200
    return jsonify({"mensaje": "Proyecto no encontrado"}), 404

@app.route('/proyectos/<proyecto_id>', methods=['PUT'])
@jwt_required()
def actualizar_proyecto(proyecto_id):
    data = request.get_json()
    proyecto = next((p for p in proyectos if p['id'] == proyecto_id), None)
    if not proyecto:
        return jsonify({"mensaje": "Proyecto no encontrado"}), 404
    for campo in ['titulo', 'descripcion', 'archivo_url', 'tipo_archivo', 'tamano_archivo', 'semestre', 'anio', 'profesor', 'materia_id']:
        if campo in data:
            proyecto[campo] = data[campo]
    return jsonify({"mensaje": "Proyecto actualizado exitosamente"}), 200

@app.route('/proyectos/<proyecto_id>', methods=['DELETE'])
@jwt_required()
def eliminar_proyecto(proyecto_id):
    global proyectos
    proyectos = [p for p in proyectos if p['id'] != proyecto_id]
    return jsonify({"mensaje": "Proyecto eliminado exitosamente"}), 200

# S3: obtener presigned URL para subida de archivos
@app.route('/proyectos/upload-url', methods=['POST'])
@jwt_required()
def obtener_upload_url():
    data = request.get_json()
    filename = data.get('filename')
    if not filename:
        return jsonify({"mensaje": "Falta el nombre de archivo"}), 400
    key = f"proyectos/{str(uuid4())}_{filename}"
    url = s3.generate_presigned_url('put_object', Params={'Bucket': AWS_S3_BUCKET, 'Key': key}, ExpiresIn=3600)
    return jsonify({'upload_url': url, 'archivo_url': f'https://{AWS_S3_BUCKET}.s3.amazonaws.com/{key}'})

# ADMIN
@app.route('/admin/proyectos-pendientes', methods=['GET'])
@admin_required
def proyectos_pendientes():
    pendientes = [p for p in proyectos if p['estado'] == 'pendiente']
    return jsonify(pendientes)

@app.route('/admin/proyectos/<proyecto_id>/estado', methods=['PUT'])
@admin_required
def cambiar_estado_proyecto(proyecto_id):
    data = request.get_json()
    nuevo_estado = data.get('estado')
    proyecto = next((p for p in proyectos if p['id'] == proyecto_id), None)
    if not proyecto:
        return jsonify({"mensaje": "Proyecto no encontrado"}), 404
    proyecto['estado'] = nuevo_estado
    return jsonify({"mensaje": "Estado actualizado"}), 200

@app.route('/admin/estadisticas', methods=['GET'])
@admin_required
def estadisticas():
    total_proyectos = len(proyectos)
    total_usuarios = len(usuarios)
    total_materias = len(materias)
    return jsonify({
        "total_proyectos": total_proyectos,
        "total_usuarios": total_usuarios,
        "total_materias": total_materias
    })

@app.route('/crearEstudiante', methods=['POST'])
@jwt_required()
def crear_estudiante():
    data = request.get_json()
    nombre = data.get('nombre')
    codigo = data.get('codigo')
    promedio = data.get('promedio')


    # Código obsoleto eliminado: gestión de estudiantes
    return jsonify({"mensaje": "Endpoint obsoleto"}), 410

@app.route('/obtenerEstudiante/<codigo>', methods=['GET'])
@jwt_required()
def obtener_estudiante(codigo):
    estudiante = next((e for e in estudiantes if e['codigo'] == codigo), None)

    if estudiante is not None:
        return jsonify(estudiante), 200
    else:
        return jsonify({"mensaje": "Estudiante no encontrado"}), 404

@app.route('/actualizarEstudiante/<codigo>', methods=['PUT'])
@jwt_required()
def actualizar_estudiante(codigo):
    data = request.get_json()
    estudiante = next((e for e in estudiantes if e['codigo'] == codigo), None)

    if estudiante is not None:
        estudiante['nombre'] = data.get('nombre', estudiante['nombre'])
        estudiante['promedio'] = data.get('promedio', estudiante['promedio'])

        return jsonify({"mensaje": "Estudiante actualizado exitosamente"}), 200
    else:
        return jsonify({"mensaje": "Estudiante no encontrado"}), 404

@app.route('/eliminarEstudiante/<codigo>', methods=['DELETE'])
@jwt_required()
def eliminar_estudiante(codigo):
    global estudiantes
    estudiantes = [e for e in estudiantes if e['codigo'] != codigo]

    return jsonify({"mensaje": "Estudiante eliminado exitosamente"}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
