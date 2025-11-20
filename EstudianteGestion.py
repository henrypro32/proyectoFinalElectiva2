from datetime import datetime

class Usuario:
    def __init__(self, id, email, nombre, password_hash, rol, fecha_registro=None):
        self.id = id
        self.email = email
        self.nombre = nombre
        self.password_hash = password_hash
        self.rol = rol
        self.fecha_registro = fecha_registro or datetime.utcnow().isoformat()
    def to_json(self):
        return self.__dict__

class Proyecto:
    def __init__(self, id, titulo, descripcion, archivo_url, tipo_archivo, tamaño_archivo, semestre, año, profesor, estado, descargas, vistas, usuario_id, materia_id):
        self.id = id
        self.titulo = titulo
        self.descripcion = descripcion
        self.archivo_url = archivo_url
        self.tipo_archivo = tipo_archivo
        self.tamaño_archivo = tamaño_archivo
        self.semestre = semestre
        self.año = año
        self.profesor = profesor
        self.estado = estado
        self.descargas = descargas
        self.vistas = vistas
        self.usuario_id = usuario_id
        self.materia_id = materia_id
    def to_json(self):
        return self.__dict__

class Materia:
    def __init__(self, id, nombre, descripcion):
        self.id = id
        self.nombre = nombre
        self.descripcion = descripcion
    def to_json(self):
        return self.__dict__


from datetime import datetime

class Usuario:
    def __init__(self, id, email, nombre, password_hash, rol, fecha_registro=None):
        self.id = id
        self.email = email
        self.nombre = nombre
        self.password_hash = password_hash
        self.rol = rol
        self.fecha_registro = fecha_registro or datetime.utcnow().isoformat()
    def to_json(self):
        return self.__dict__

class ProyectoAcademico:
    def __init__(self, id, titulo, descripcion, archivo_url, tipo_archivo, tamano_archivo, semestre, anio, profesor, estado, descargas, vistas, usuario_id, materia_id):
        self.id = id
        self.titulo = titulo
        self.descripcion = descripcion
        self.archivo_url = archivo_url
        self.tipo_archivo = tipo_archivo
        self.tamano_archivo = tamano_archivo
        self.semestre = semestre
        self.anio = anio
        self.profesor = profesor
        self.estado = estado
        self.descargas = descargas
        self.vistas = vistas
        self.usuario_id = usuario_id
        self.materia_id = materia_id
    def to_json(self):
        return self.__dict__

class Materia:
    def __init__(self, id, nombre, descripcion):
        self.id = id
        self.nombre = nombre
        self.descripcion = descripcion
    def to_json(self):
        return self.__dict__

