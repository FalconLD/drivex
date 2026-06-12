"""
Seeder idempotente de datos de demostración para DriveX.

Carga el catálogo (categorías, vehículos, pilotos, sucursales, rutas)
desde el fixture `demo_data.json` y crea los usuarios de demostración.

Uso:
    python manage.py seed_demo
"""
from datetime import date, time, timedelta

from django.contrib.auth.models import Group, User
from django.core.management import call_command
from django.core.management.base import BaseCommand

from DriveX.models import Reserva, Vehiculo

ADMIN_USERNAME = 'admin'
ADMIN_EMAIL = 'admin@demo.local'
ADMIN_PASSWORD = 'Admin123!'

DEMO_USERNAME = 'usuario'
DEMO_EMAIL = 'usuario@hotmail.com'
DEMO_PASSWORD = 'Demo123!'
DEMO_NOMBRE = 'Usuario Ejemplo'


class Command(BaseCommand):
    help = 'Carga datos de demostración: catálogo completo + usuarios admin/ejemplo + reserva demo.'

    def handle(self, *args, **options):
        self.stdout.write('Cargando fixture demo_data.json (catálogo)...')
        call_command('loaddata', 'demo_data.json', app_label='DriveX', verbosity=0)
        self.stdout.write(self.style.SUCCESS('  Catálogo cargado.'))

        admin_user, created = User.objects.get_or_create(
            username=ADMIN_USERNAME,
            defaults={
                'email': ADMIN_EMAIL,
                'first_name': 'Administrador',
                'is_staff': True,
                'is_superuser': True,
            },
        )
        if created:
            admin_user.set_password(ADMIN_PASSWORD)
            admin_user.save()
            self.stdout.write(self.style.SUCCESS(f'  Usuario admin creado: {ADMIN_USERNAME} / {ADMIN_EMAIL}'))
        else:
            self.stdout.write(f'  Usuario admin ya existe: {ADMIN_USERNAME}')

        demo_user, created = User.objects.get_or_create(
            username=DEMO_USERNAME,
            defaults={
                'email': DEMO_EMAIL,
                'first_name': 'Usuario',
                'last_name': 'Ejemplo',
            },
        )
        if created:
            demo_user.set_password(DEMO_PASSWORD)
            demo_user.save()
            self.stdout.write(self.style.SUCCESS(f'  Usuario demo creado: {DEMO_USERNAME} / {DEMO_EMAIL}'))
        else:
            self.stdout.write(f'  Usuario demo ya existe: {DEMO_USERNAME}')

        # El panel de administración del sitio usa el grupo "Administradores"
        # (ver DriveX/context_processors.py).
        admin_group, _ = Group.objects.get_or_create(name='Administradores')
        admin_user.groups.add(admin_group)

        if not Reserva.objects.filter(usuario=demo_user).exists():
            vehiculo = Vehiculo.objects.order_by('id').first()
            if vehiculo:
                Reserva.objects.create(
                    vehiculo=vehiculo,
                    usuario=demo_user,
                    nombre_completo=DEMO_NOMBRE,
                    email=DEMO_EMAIL,
                    telefono='0999999999',
                    fecha_servicio=date.today() + timedelta(days=7),
                    hora_servicio=time(10, 0),
                    duracion='4 horas',
                    tipo_servicio='Con chofer',
                    direccion_recogida='Av. Demo 123, Quito',
                    destino='Aeropuerto Mariscal Sucre',
                    solicitudes_especiales='Reserva de demostración generada por seed_demo.',
                    estado=Reserva.ESTADO_CONFIRMADA,
                )
                self.stdout.write(self.style.SUCCESS('  Reserva demo creada.'))
        else:
            self.stdout.write('  Reserva demo ya existe.')

        self.stdout.write(self.style.SUCCESS(
            '\nSeed completado.\n'
            f'  Admin:   {ADMIN_USERNAME} / {ADMIN_PASSWORD} ({ADMIN_EMAIL})\n'
            f'  Usuario: {DEMO_USERNAME} / {DEMO_PASSWORD} ({DEMO_EMAIL})'
        ))
