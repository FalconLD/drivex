# Security Clearance — DriveX Rental Car

| Campo | Valor |
|-------|-------|
| **Proyecto** | DriveX Rental Car |
| **Ruta** | `Revisar/Proyectos Integradores/Proyecto Integrador Segundo Semestre` |
| **Fecha** | 2026-06-12 |
| **Agente** | Security (Oleada P0) |
| **Resultado** | **CLEARED** |

## Auditoría .gitignore

| Patrón requerido | Presente | PASS |
|------------------|----------|------|
| `.env` | Sí | ✅ |
| `venv/` / `.venv/` | Sí | ✅ |
| `node_modules/` | N/A (proyecto Python) | ✅ |
| `__pycache__/` | Sí | ✅ |
| `*.sqlite3` | Sí | ✅ |
| `data_backup.json` (PII real) | Sí — ignorado, nunca commiteado (`git log --all -- data_backup.json` vacío) | ✅ |
| `media/` | **Versionado a propósito** — solo imágenes de demo, sin PII | ✅ |

## Búsqueda de secretos

| Verificación | Herramienta | Resultado | PASS |
|--------------|-------------|-----------|------|
| Credenciales hardcodeadas en settings.py | manual | Refactorizado a variables de entorno; defaults son credenciales demo documentadas | ✅ |
| `testerdb.py` con credenciales locales | manual | **Eliminado** (script de debugging huérfano, sin referencias) | ✅ |
| Patrones password/token/api_key en código | Grep | Solo credenciales demo del seeder (`Admin123!`, `Demo123!`) — intencionales y documentadas en README | ✅ |
| `.env` o archivos sensibles en historial Git | `git log --all --name-only` + filtro | Ninguno (`.env`, `credencial`, `.pem`, `.key` ausentes) | ✅ |
| `data_backup.json` (usuarios reales + PII) en historial | `git log --all -- data_backup.json` | Nunca commiteado | ✅ |
| Rutas absolutas `C:\Users\` | Grep | Ninguna | ✅ |
| Fixture `demo_data.json` sin PII | manual | Solo catálogo (categorías/vehículos/pilotos); usuarios y reservas reales excluidos del fixture | ✅ |

## Archivos sensibles detectados

| Archivo | Acción tomada |
|---------|---------------|
| `ProyectoY/settings.py` (SECRET_KEY + password BD hardcodeados) | Externalizado a env vars con defaults demo; clave antigua queda en historial pero es `django-insecure-*` de desarrollo, sin valor en producción — riesgo aceptado |
| `DriveX/testerdb.py` (credenciales BD local) | Eliminado del working tree (queda en historial; credencial local trivial `1234`, BD inexistente — riesgo aceptado) |
| `data_backup.json` (5 usuarios reales, emails, hashes, sesiones) | Permanece ignorado y fuera del historial |

## Tamaño del repositorio

| Métrica | Valor | OK |
|---------|-------|-----|
| Working tree a versionar (sin `.git`/`.venv`) | 111 MB (87 MB es `media/` de demo) | ⚠️ Sobre los 100 MB recomendados — **aceptado**: las imágenes de demo son requisito explícito del proyecto; ningún archivo individual supera el límite de 100 MB de GitHub |

## Decisión

- [x] **CLEARED** — Autorizado para push
- [ ] BLOCKED

### Notas

- Secret scanning de GitHub se verificará post-push sobre el repo remoto (gate post-push).
- Credenciales demo (`Admin123!` / `Demo123!` / BD `1234`) son intencionales, documentadas en README y solo válidas en entorno local/demo.
