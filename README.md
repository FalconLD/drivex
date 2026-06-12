# DriveX Rental Car

Aplicación web de alquiler de vehículos de lujo con chofer, construida con **Django 5.2 + PostgreSQL**. Incluye catálogo de vehículos por categoría, sistema de reservas, panel de administración del sitio, gestión de pilotos y cálculo de rutas entre sucursales.

> **Proyecto Integrador — Segundo Semestre · PUCE**

## Características

- CRUD de vehículos, categorías y pilotos con imágenes
- Sistema de reservas con estados (pendiente, confirmada, finalizada, cancelada)
- Panel de administración propio (flota, reservas, mantenimiento) + Django Admin
- Autenticación con grupos (`Administradores`, `Clientes`)
- Datos de demostración incluidos: **22 vehículos, 4 categorías, 13 pilotos** con sus imágenes

## Stack

| Componente | Tecnología |
|------------|------------|
| Backend | Django 5.2.4 (Python 3.13) |
| Base de datos | PostgreSQL |
| Imágenes | Pillow + `media/` versionado con assets de demo |
| Contenedores | Docker + Docker Compose |

---

## Instalación y ejecución

### Opción A — Docker (recomendada)

Requiere Docker Desktop. Levanta la app, la base de datos, aplica migraciones y carga los datos de demostración automáticamente:

~~~
docker compose up --build
~~~

Abre http://localhost:8000 — el sitio queda funcional con todo el catálogo cargado.

### Opción B — Local (Windows)

Requiere Python 3.10+ y PostgreSQL.

~~~powershell
# 1. Crear la base de datos (una sola vez, desde psql)
#    CREATE USER drivex_user WITH PASSWORD '1234';
#    CREATE DATABASE drivex_db OWNER drivex_user;

# 2. Entorno virtual + dependencias
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# 3. Configuración (opcional: copiar y editar variables)
copy .env.example .env

# 4. Migraciones + datos de demostración
py manage.py migrate
py manage.py seed_demo

# 5. Iniciar servidor
py manage.py runserver
~~~

### Opción B — Local (Linux / macOS)

~~~bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py seed_demo
python3 manage.py runserver
~~~

---

## Datos de demostración

El comando `seed_demo` es **idempotente** (puede ejecutarse varias veces) y carga:

- Catálogo completo: categorías, vehículos, pilotos (fixture `DriveX/fixtures/demo_data.json`)
- Usuarios de demostración:

| Rol | Usuario | Contraseña | Email |
|-----|---------|------------|-------|
| Administrador | `admin` | `Admin123!` | admin@demo.local |
| Cliente | `usuario` | `Demo123!` | usuario@hotmail.com |

- Una reserva de ejemplo confirmada para el usuario demo

El usuario `admin` es superusuario de Django (acceso a `/admin`) y pertenece al grupo `Administradores` (acceso al panel de administración del sitio).

Las imágenes de vehículos, categorías y pilotos están versionadas en `media/`.

---

## Variables de entorno

Ver `.env.example`. Valores por defecto apuntan al entorno de desarrollo local:

| Variable | Default | Descripción |
|----------|---------|-------------|
| `DB_NAME` | `drivex_db` | Nombre de la BD |
| `DB_USER` | `drivex_user` | Usuario PostgreSQL |
| `DB_PASSWORD` | `1234` | Contraseña (demo) |
| `DB_HOST` | `localhost` | Host (en Docker: `db`) |
| `DB_PORT` | `5432` | Puerto |
| `DJANGO_SECRET_KEY` | clave demo | Cambiar en producción |
| `DJANGO_DEBUG` | `True` | `False` en producción |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` | Hosts permitidos |

---

## Comandos útiles

~~~powershell
py manage.py makemigrations   # Generar migraciones tras cambiar models.py
py manage.py migrate          # Aplicar migraciones
py manage.py seed_demo        # Cargar/recargar datos de demostración
py manage.py createsuperuser  # Crear superusuario adicional
~~~

## Estructura

~~~
├── DriveX/                  # App principal
│   ├── fixtures/demo_data.json   # Catálogo de demostración
│   ├── management/commands/seed_demo.py
│   ├── models.py            # Categoria, Vehiculo, Reserva, Sucursal, Ruta, Piloto
│   ├── views.py / urls.py / forms.py
│   └── templates/DriveX/    # Plantillas del sitio
├── ProyectoY/               # Configuración Django (settings vía env vars)
├── media/                   # Imágenes de demo (versionadas)
├── docker-compose.yml       # App + PostgreSQL + seed automático
├── Dockerfile
├── .env.example
└── requirements.txt
~~~

## Autor

**Leonardo Falconi** — Pontificia Universidad Católica del Ecuador (PUCE)
