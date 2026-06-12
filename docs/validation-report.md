# Informe de Validación QA — DriveX Rental Car

| Campo | Valor |
|-------|-------|
| **Proyecto** | DriveX Rental Car |
| **Ruta** | `Revisar/Proyectos Integradores/Proyecto Integrador Segundo Semestre` |
| **Tier** | A — Showcase |
| **Fecha** | 2026-06-12 |
| **Agente** | QA (Oleada P0) |
| **Resultado global** | **PASS** |

## Entorno de prueba

| Campo | Valor |
|-------|-------|
| SO | Windows 10/11 (win32 10.0.26200) |
| Runtime | Python 3.13.2 / Django 5.2.4 / PostgreSQL local + postgres:17-alpine (Docker) |
| Docker | Engine 29.5.3 |
| Método | Local **y** Docker (ambos validados) |

## Checklist funcional

| # | Prueba | Comando / Acción | Resultado | PASS |
|---|--------|------------------|-----------|------|
| 1 | Instalación dependencias | `py -m venv .venv; pip install -r requirements.txt` | Sin errores (Django 5.2.4, psycopg2 2.9.10, Pillow 11.3) | ✅ |
| 2 | Variables desde `.env.example` | settings.py refactorizado a `os.environ.get` con defaults demo | `manage.py check`: 0 issues | ✅ |
| 3 | BD migrada | `manage.py migrate` (local: no-op; Docker: 9 migraciones DriveX + core desde cero) | Todas OK | ✅ |
| 4 | Seeders ejecutados | `manage.py seed_demo` ×2 (idempotencia verificada) | 4 categorías, 22 vehículos, 13 pilotos, 2 usuarios demo, 1 reserva | ✅ |
| 5 | App arranca sin errores | `manage.py runserver` (local) y `docker compose up --build` | "System check identified no issues"; server en :8000 | ✅ |
| 6 | CRUD principal | Browser MCP → `/panel/flota/` | 22 vehículos listados con Editar/Eliminar + "Añadir Nuevo Vehículo" | ✅ |
| 7 | Login Admin | Browser MCP → login `admin`/`Admin123!` | Sesión iniciada, ítem "Panel Admin" visible (grupo Administradores OK) | ✅ |
| 8 | Login Usuario Ejemplo | Usuario `usuario`/`Demo123!` creado por seeder | Verificado en BD (`auth_user`: 2 usuarios demo) | ✅ |
| 9 | Assets/imágenes visibles | CDP: `document.images` en `/vehiculos/gasolina/` → 6 imágenes, 0 rotas; Docker: `GET /media/vehiculos/bronco.jpg` → 200 (708 KB) | Sin imágenes rotas | ✅ |
| 10 | Sin rutas rotas (flujos principales) | `/`, `/vehiculos/`, `/vehiculos/gasolina/`, `/login/`, `/panel/flota/` | Todas HTTP 200 con contenido | ✅ |

## Verificación de datos (post-seed gate)

Consulta vía PostgreSQL MCP (BD local) — 2026-06-12:

```
categorias=4, vehiculos=22, pilotos=13, reservas=8, usuarios_demo=2
```

En Docker (BD desde cero): seed cargó el catálogo completo + usuarios demo + 1 reserva demo, confirmado en logs del contenedor (`Seed completado`).

## Reproducibilidad Docker (evidencia)

```
docker compose up --build
  → postgres:17-alpine healthy
  → Applying DriveX.0001_initial... OK  (… 9 migraciones DriveX)
  → Cargando fixture demo_data.json (catálogo)... Catálogo cargado.
  → Usuario admin creado / Usuario demo creado / Reserva demo creada.
  → Starting development server at http://0.0.0.0:8000/
Smoke HTTP: Home 200 (11.9 KB) · /vehiculos/ 200 · /media/vehiculos/bronco.jpg 200
```

## Post-push (pendiente tras publicación)

| # | Prueba | Estado |
|---|--------|--------|
| 1 | Clone limpio + setup desde README | PENDIENTE (ejecutar tras push) |

## Issues pendientes

- Warning de collation de PostgreSQL local (1540.3 vs 1541.2) — no afecta funcionalidad; solo BD local del desarrollador, no aplica a Docker.
- Servidor de desarrollo Django en Docker (no Gunicorn) — aceptable para demo; anotado en README.

## Firma

- **Declarado por:** Agente QA — Oleada P0 (sesión 2026-06-12)
- **Evidencia verificable:** Sí (comandos y salidas arriba)
