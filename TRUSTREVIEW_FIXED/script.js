/* ==========================================================================
   TRUSTREVIEW - SCRIPT UNIFICADO
   ========================================================================== */

/* --- DATOS --- */
const movies = [
    { id: 1, title: 'El Exorcista',      poster: 'imagenes/exorcista.png',      rating: 4.5 },
    { id: 2, title: 'Pinocho',           poster: 'imagenes/pinocho.png',         rating: 3.8 },
    { id: 3, title: 'The Batman',        poster: 'imagenes/batman.png',          rating: 4.2 },
    { id: 4, title: 'Black Panther',     poster: 'imagenes/panther.png',         rating: 4.0 },
    { id: 5, title: '100',              poster: 'imagenes/100.png',             rating: 3.5 },
    { id: 6, title: 'La Casa de Papel', poster: 'imagenes/lacasadepapel.png',   rating: 4.8 },
    { id: 7, title: 'Alguien',          poster: 'imagenes/alguien.png',         rating: 3.0 },
    { id: 8, title: 'Peaky Blinders',   poster: 'imagenes/peaky.png',           rating: 3.9 }
];

const comunidadesData = [
    { id: 1, nombre: "SerieToon",    desc: "Fans de las mejores series actuales." },
    { id: 2, nombre: "Cinefilos Hub", desc: "Debates sobre cine y estrenos." },
    { id: 3, nombre: "Fútbol Live",  desc: "Comunidad para seguir los partidos." },
    { id: 4, nombre: "Gamer Zone",   desc: "Reviews de juegos y hardware." }
];

let misComunidades = new Set();
let usuarioActual = localStorage.getItem("usuarioLogueado") || null;

/* ==========================================================================
   TOAST
   ========================================================================== */
function mostrarToast(mensaje) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = mensaje;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ==========================================================================
   SIDEBAR (☰ desplegable)
   ========================================================================== */
function iniciarMenus() {
    const openBtn   = document.getElementById('openSidebar');
    const closeBtn  = document.getElementById('closeSidebar');
    const sidebar   = document.getElementById('mainSidebar');
    const overlay   = document.getElementById('sidebarOverlay');

    if (!sidebar) return;

    const abrir  = () => { sidebar.classList.add('active');    overlay && overlay.classList.add('active'); };
    const cerrar = () => { sidebar.classList.remove('active'); overlay && overlay.classList.remove('active'); };

    openBtn  && openBtn.addEventListener('click', abrir);
    closeBtn && closeBtn.addEventListener('click', cerrar);
    overlay  && overlay.addEventListener('click', cerrar);
}

/* ==========================================================================
   AUTENTICACIÓN (Modal integrado en index.html)
   ========================================================================== */
window.abrirModal = function(vista) {
    const overlay = document.getElementById('modalOverlay');
    if (!overlay) return;
    overlay.classList.add('active');
    cambiarVista(vista);
};

window.cerrarModal = function() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('active');
};

window.cambiarVista = function(vista) {
    const login    = document.getElementById('vistaLogin');
    const registro = document.getElementById('vistaRegistro');
    if (!login || !registro) return;
    if (vista === 'login') {
        login.style.display = 'block';
        registro.style.display = 'none';
    } else {
        login.style.display = 'none';
        registro.style.display = 'block';
    }
};

window.hacerLogin = function() {
    const user = document.getElementById('loginUser')?.value.trim();
    const msg  = document.getElementById('modal-msg');
    if (!user) { if (msg) msg.textContent = 'Escribe tu nombre de usuario.'; return; }
    localStorage.setItem('usuarioLogueado', user);
    usuarioActual = user;
    cerrarModal();
    actualizarNavbar();
    mostrarToast(`¡Bienvenido, ${user}!`);
};

window.hacerRegistro = function() {
    const name  = document.getElementById('regName')?.value.trim();
    const msg   = document.getElementById('modal-msg-reg');
    if (!name) { if (msg) msg.textContent = 'Escribe tu nombre.'; return; }
    localStorage.setItem('usuarioLogueado', name);
    usuarioActual = name;
    if (msg) msg.textContent = '¡Cuenta creada!';
    setTimeout(() => { cerrarModal(); actualizarNavbar(); mostrarToast(`¡Bienvenido, ${name}!`); }, 800);
};

window.logout = function() {
    localStorage.removeItem('usuarioLogueado');
    usuarioActual = null;
    actualizarNavbar();
    mostrarToast('Sesión cerrada');
};

function actualizarNavbar() {
    const guestDiv = document.getElementById('guestButtons');
    const userDiv  = document.getElementById('userButtons');
    const nameSpan = document.getElementById('display-user');

    if (usuarioActual) {
        if (guestDiv) guestDiv.style.display = 'none';
        if (userDiv)  userDiv.style.display  = 'flex';
        if (nameSpan) nameSpan.textContent   = usuarioActual;
    } else {
        if (guestDiv) guestDiv.style.display = 'flex';
        if (userDiv)  userDiv.style.display  = 'none';
    }
}

// Soporte para páginas independientes de login/registro (login.html, registro.html)
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = document.getElementById("username")?.value;
        if (user) { localStorage.setItem("usuarioLogueado", user); window.location.href = "index.html"; }
    });
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("regName")?.value;
        if (name) { localStorage.setItem("usuarioLogueado", name); window.location.href = "index.html"; }
    });
}

/* ==========================================================================
   CARTELERA (películas dinámicas)
   ========================================================================== */
function cargarCartelera() {
    const container = document.getElementById('container-movies');
    if (!container) return;

    container.innerHTML = '';
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <p class="movie-title">${movie.title}</p>
                <div class="star-rating-manual" data-movie-id="${movie.id}">
                    <span class="star" data-value="1">★</span>
                    <span class="star" data-value="2">★</span>
                    <span class="star" data-value="3">★</span>
                    <span class="star" data-value="4">★</span>
                    <span class="star" data-value="5">★</span>
                </div>
                <p class="movie-rating">⭐ ${movie.rating}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Estrellas interactivas (delegación)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('star') && e.target.closest('.star-rating-manual')) {
        const value = parseInt(e.target.getAttribute('data-value'));
        const container = e.target.parentElement;
        container.querySelectorAll('.star').forEach((s, i) => {
            s.classList.toggle('active', i < value);
        });
        mostrarToast(`Calificaste con ${value} estrella${value > 1 ? 's' : ''}`);
    }
});

/* ==========================================================================
   COMUNIDADES
   ========================================================================== */
function cargarComunidades() {
    const contenedor = document.getElementById('comunidades-app');
    if (!contenedor) return;

    contenedor.innerHTML = comunidadesData.map(com => `
        <div class="comunidad-item">
            <span class="comunidad-nombre">${com.nombre}</span>
            <p class="comunidad-descripcion">${com.desc}</p>
            <button class="btn-unirse" id="btn-${com.id}" onclick="toggleUnion(${com.id}, '${com.nombre}')">
                Unirse
            </button>
        </div>
    `).join('');
}

window.toggleUnion = function(id, nombre) {
    const boton = document.getElementById(`btn-${id}`);
    if (misComunidades.has(nombre)) {
        misComunidades.delete(nombre);
        boton.textContent = "Unirse";
        boton.classList.remove('unido');
        mostrarToast(`Has salido de ${nombre}`);
    } else {
        misComunidades.add(nombre);
        boton.textContent = "Unido ✓";
        boton.classList.add('unido');
        mostrarToast(`¡Bienvenido a ${nombre}!`);
    }
};

/* ==========================================================================
   MURO DE RESEÑAS
   ========================================================================== */
function iniciarMuro() {
    const btnPublicar      = document.getElementById('btn-publicar');
    const inputResena      = document.getElementById('input-resena');
    const contenedorResenas = document.getElementById('contenedor-resenas');

    if (!btnPublicar || !inputResena) return;

    const publicar = () => {
        const texto = inputResena.value.trim();
        if (!texto) return;
        const div = document.createElement('div');
        div.className = 'review-item new-post-animation';
        div.innerHTML = `
            <div class="user-badge-mini">👤</div>
            <div class="review-body">
                <strong>${usuarioActual || 'Invitado'}</strong>
                <p>"${texto}"</p>
                <div class="review-footer">❤️ 0 · 💬 0 respuestas</div>
            </div>
        `;
        contenedorResenas.insertBefore(div, contenedorResenas.firstChild);
        inputResena.value = "";
        mostrarToast("Reseña publicada");
    };

    btnPublicar.addEventListener('click', publicar);
    inputResena.addEventListener('keypress', (e) => { if (e.key === 'Enter') publicar(); });
}

async function enviarPreguntaGemini() {
    const promptElement = document.getElementById('aiPrompt');
    const respuestaElement = document.getElementById('aiResponse');
    const prompt = promptElement?.value.trim();

    if (!prompt) {
        mostrarToast('Escribe tu pregunta para Gemini.');
        return;
    }

    if (respuestaElement) {
        respuestaElement.textContent = 'Generando respuesta...';
    }

    try {
        const res = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Error al generar respuesta de Gemini.');
        }

        if (respuestaElement) {
            respuestaElement.textContent = data.answer;
        }
    } catch (error) {
        if (respuestaElement) {
            respuestaElement.textContent = 'No se pudo obtener respuesta de Gemini.';
        }
        mostrarToast(error.message || 'Error de IA');
        console.error('Gemini fetch error:', error);
    }
}

async function verificarServidorGemini() {
    const statusElement = document.getElementById('aiStatus');
    if (statusElement) {
        statusElement.textContent = 'Verificando servicio AI...';
        statusElement.classList.remove('error');
        statusElement.classList.remove('ok');
    }

    try {
        const res = await fetch('/api/health');
        const data = await res.json();

        if (res.ok) {
            if (statusElement) {
                statusElement.textContent = `Servicio AI activo. Modelo: ${data.model || 'desconocido'}`;
                statusElement.classList.add('ok');
            }
        } else {
            if (statusElement) {
                statusElement.textContent = `Servicio AI no disponible: ${data.error || res.status}`;
                statusElement.classList.add('error');
            }
        }
    } catch (error) {
        if (statusElement) {
            statusElement.textContent = 'No se pudo conectar con el servidor AI.';
            statusElement.classList.add('error');
        }
        console.error('Error al verificar servicio AI:', error);
    }
}

/* ==========================================================================
   CERRAR MODAL CON ESC o click fuera
   ========================================================================== */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModal();
});
document.addEventListener('click', (e) => {
    const overlay = document.getElementById('modalOverlay');
    if (overlay && e.target === overlay) cerrarModal();
});

/* ==========================================================================
   INICIO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    iniciarMenus();
    actualizarNavbar();
    cargarCartelera();
    cargarComunidades();
    iniciarMuro();

    const aiSendBtn = document.getElementById('aiSendBtn');
    if (aiSendBtn) {
        aiSendBtn.addEventListener('click', enviarPreguntaGemini);
    }

    const aiCheckBtn = document.getElementById('aiCheckBtn');
    if (aiCheckBtn) {
        aiCheckBtn.addEventListener('click', verificarServidorGemini);
    }

    verificarServidorGemini();
});
