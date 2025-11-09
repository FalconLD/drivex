// ===================================================================
//                FUNCIONES DE UTILIDAD
// ===================================================================

/**
 * Función para crear y mostrar una notificación toast individual.
 * @param {string} body - El texto del mensaje.
 * @param {string} tags - Las clases CSS para el estilo (ej. "success", "error").
 */
function createToast(body, tags) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${tags}`;
    toast.textContent = body;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 5000);
}


// ===================================================================
//                LÓGICA DE INICIALIZACIÓN PRINCIPAL
// ===================================================================

document.addEventListener('DOMContentLoaded', function() {

    /**
     * 1. SISTEMA DE NOTIFICACIONES TOAST
     */
    const messagesContainer = document.getElementById('django-messages');
    if (messagesContainer) {
        const messageItems = messagesContainer.querySelectorAll('.django-message-item');
        messageItems.forEach(item => {
            const messageBody = item.textContent;
            const messageTags = Array.from(item.classList).filter(c => c !== 'django-message-item').join(' ');
            createToast(messageBody, messageTags);
        });
        messagesContainer.remove();
    }

    /**
     * 2. LÓGICA DE INTRO CON VIDEO (ACTUALIZADA)
     * - Se reproduce automáticamente la primera vez que se visita el sitio.
     * - Se puede volver a ver haciendo clic en el logo.
     * - En visitas posteriores, se muestra el contenido principal directamente.
     */
    const video = document.getElementById('intro-video');
    const audio = document.getElementById('intro-audio');
    const btn = document.getElementById('play-intro');
    const splash = document.getElementById('intro-splash');
    const mainContent = document.getElementById('main-content');

    if (video && audio && splash && mainContent) {
        
        const urlParams = new URLSearchParams(window.location.search);
        const playIntroFromLogo = urlParams.get('intro') === 'true';
        const introHasBeenPlayed = localStorage.getItem('introPlayed');

        const onIntroEnd = () => {
            splash.style.display = 'none';
            mainContent.style.display = 'block';
        };

        if (playIntroFromLogo) {
            // CASO 1: El usuario hizo clic en el logo (?intro=true en la URL).
            // Mostramos la intro con el botón para que sea interactiva.
            splash.style.display = 'flex';
            mainContent.style.display = 'none';
            btn.style.display = 'block';
            btn.addEventListener('click', () => {
                video.muted = false;
                video.play();
                audio.play();
                btn.style.display = 'none';
                video.onended = onIntroEnd;
            }, { once: true }); // {once: true} evita añadir listeners duplicados

        } else if (!introHasBeenPlayed) {
            // CASO 2: Es la PRIMERA VEZ que el usuario visita (no hay nada en localStorage).
            // Reproducimos la intro automáticamente y sin botón.
            splash.style.display = 'flex';
            mainContent.style.display = 'none';
            btn.style.display = 'none';
            
            // Un pequeño truco para que los navegadores modernos permitan el audio automático.
            // Si el video ya está en autoplay, solo necesitamos desmutearlo y sincronizar.
            setTimeout(() => {
                video.muted = false;
                audio.currentTime = video.currentTime; // Sincroniza el audio con el video
                audio.play();
                video.play();
            }, 100); // Un pequeño retardo

            video.onended = onIntroEnd;
            
            // Guardamos en localStorage que la intro ya se ha reproducido.
            localStorage.setItem('introPlayed', 'true');

        } else {
            // CASO 3: Es una visita posterior y no se hizo clic en el logo.
            // Ocultamos la intro y mostramos el contenido principal directamente.
            splash.style.display = 'none';
            mainContent.style.display = 'block';
        }
    }


    /**
     * 3. MENÚ DE NAVEGACIÓN MÓVIL
     */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    /**
     * 4. ANIMACIONES "FADE-IN" AL HACER SCROLL
     */
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }

});