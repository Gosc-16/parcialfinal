const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

if (!loggedInUser) {
    window.location.href = 'index.html';
}

const logoutButton = document.getElementById('logoutButton');
const tabButtons = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const buscador = document.getElementById('buscador');
const categoriaFilter = document.getElementById('categoria');
const ubicacionFilter = document.getElementById('ubicacion');
const limpiarFiltrosBtn = document.getElementById('limpiar-filtros');
const eventosContainer = document.getElementById('eventos-container');
const misEventosContainer = document.getElementById('mis-eventos-container');
const userInfoDisplay = document.getElementById('user-info-display');
const noEventsAll = document.getElementById('no-events-all');
const noEventsMine = document.getElementById('no-events-mine');
const infoModal = document.getElementById('infoModal');
const infoModalTitle = document.getElementById('infoModalTitle');
const infoModalMessage = document.getElementById('infoModalMessage');
const infoModalCloseButton = document.getElementById('infoModalCloseButton');
const confirmModal = document.getElementById('confirmModal');
const confirmModalTitle = document.getElementById('confirmModalTitle');
const confirmModalMessage = document.getElementById('confirmModalMessage');
const confirmCancelButton = document.getElementById('confirmCancelButton');
const confirmOKButton = document.getElementById('confirmOKButton');
let currentConfirmAction = null;

const initialEventsData = [
    {
        id: 'evt001',
        nombre: 'Carrera Urbano 5K',
        fecha: '2025-07-20',
        ubicacion: 'Parque de la Reserva',
        categoria: 'Individual',
        descripcion: 'Participa en nuestra carrera de 5 kilómetros por las calles de la ciudad.',
        imagen: 'img/evento1.jpg',
        capacidad: 100,
        inscritos: 0,
        estado: 'activo'
    },
    {
        id: 'evt002',
        nombre: 'Competencia de Natación Libre',
        fecha: '2025-08-01',
        ubicacion: 'Club Regatas',
        categoria: 'Individual',
        descripcion: 'Desafía tus límites en esta competencia de natación estilo libre.',
        imagen: 'img/evento2.jpg',
        capacidad: 500,
        inscritos: 0,
        estado: 'activo'
    },
    {
        id: 'evt003',
        nombre: 'Carrera de Postas por Equipos',
        fecha: '2025-07-28',
        ubicacion: 'Campo de Marte',
        categoria: 'Colectivo',
        descripcion: 'Forma tu equipo y demuestren su velocidad en esta emocionante carrera de postas.',
        imagen: 'img/evento3.jpg',
        capacidad: 16,
        inscritos: 0,
        estado: 'activo'
    },
    {
        id: 'evt004',
        nombre: 'Clase Maestra de Funcional',
        fecha: '2025-07-15',
        ubicacion: 'Gimnasio BodyFit',
        categoria: 'Gimnasio',
        descripcion: 'Una sesión intensiva de entrenamiento funcional para todos los niveles.',
        imagen: 'img/evento4.jpg',
        capacidad: 24,
        inscritos: 0,
        estado: 'activo'
    },
    {
        id: 'evt005',
        nombre: 'Taller de Surf para Principiantes',
        fecha: '2025-08-10',
        ubicacion: 'Playa Waikiki',
        categoria: 'Individual',
        descripcion: 'Aprende los fundamentos del surf y atrévete a dominar las olas.',
        imagen: 'img/evento5.jpg',
        capacidad: 50,
        inscritos: 0,
        estado: 'activo'
    },
    {
        id: 'evt006',
        nombre: 'Aventura de Esquí en Cordillera',
        fecha: '2025-08-20',
        ubicacion: 'Nevado Pastoruri',
        categoria: 'Individual',
        descripcion: 'Explora las montañas en una emocionante jornada de esquí.',
        imagen: 'img/evento6.jpg',
        capacidad: 20,
        inscritos: 0,
        estado: 'activo'
    },
    {
        id: 'evt007',
        nombre: 'Reto Físico de Gimnasio',
        fecha: '2025-08-25',
        ubicacion: 'Centro Deportivo CEVA',
        categoria: 'Gimnasio',
        descripcion: 'Pon a prueba tu resistencia y fuerza en este desafiante circuito de gimnasio.',
        imagen: 'img/evento7.jpg',
        capacidad: 200,
        inscritos: 0,
        estado: 'activo'
    },
    {
        id: 'evt008',
        nombre: 'Carrera de Obstáculos Extrema',
        fecha: '2025-07-30',
        ubicacion: 'Parque Zonal Huiracocha',
        categoria: 'Colectivo',
        descripcion: 'Supérate en la carrera de obstáculos más desafiante de la temporada.',
        imagen: 'img/evento8.jpg',
        capacidad: 32,
        inscritos: 0,
        estado: 'activo'
    },
];

class Evento {
    constructor(id, nombre, fecha, ubicacion, categoria, descripcion, imagen, capacidad, inscritos, estado) {
        this.id = id;
        this.nombre = nombre;
        this.fecha = fecha;
        this.ubicacion = ubicacion;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.capacidad = capacidad;
        this.inscritos = inscritos;
        this.estado = estado;
    }
    render(isRegistered = false) {
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');
        eventCard.dataset.eventId = this.id;
        const buttonText = isRegistered ? 'Cancelar Inscripción' : 'Inscribirse';
        const buttonClass = isRegistered ? 'btn cancelar' : 'btn inscribir';
        const buttonAction = isRegistered ? 'cancelar' : 'inscribir';
        const fechaFormateada = new Date(this.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        eventCard.innerHTML = `
            <img src="${this.imagen}" alt="${this.nombre}">
            <div class="event-card-content">
                <h3>${this.nombre}</h3>
                <p><strong>Fecha:</strong> ${fechaFormateada}</p>
                <p><strong>Ubicación:</strong> ${this.ubicacion}</p>
                <p><strong>Categoría:</strong> ${this.categoria}</p>
                <p>${this.descripcion.substring(0, 100)}...</p>
                <div class="event-card-actions">
                    <button class="${buttonClass}" data-action="${buttonAction}" data-event-id="${this.id}">${buttonText}</button>
                </div>
            </div>
        `;
        return eventCard;
    }
}

class EventManager {
    constructor(initialEvents, currentUserEmail) {
        this.events = initialEvents.map(eventData => new Evento(
            eventData.id,
            eventData.nombre,
            eventData.fecha,
            eventData.ubicacion,
            eventData.categoria,
            eventData.descripcion,
            eventData.imagen,
            eventData.capacidad,
            eventData.inscritos,
            eventData.estado
        ));
        this.currentUserEmail = currentUserEmail;
        this.userRegistrations = this.loadUserRegistrations();
    }
    loadUserRegistrations() {
        const allRegistrations = JSON.parse(localStorage.getItem('userEventRegistrations')) || {};
        return allRegistrations[this.currentUserEmail] || [];
    }
    saveRegistrations() {
        const allRegistrations = JSON.parse(localStorage.getItem('userEventRegistrations')) || {};
        allRegistrations[this.currentUserEmail] = this.userRegistrations;
        localStorage.setItem('userEventRegistrations', JSON.stringify(allRegistrations));
    }
    isUserRegistered(eventId) {
        return this.userRegistrations.includes(eventId);
    }
    renderEvents(container, eventList, noEventsMsgElement) {
        container.innerHTML = '';
        if (eventList.length === 0) {
            noEventsMsgElement.style.display = 'block';
            return;
        }
        noEventsMsgElement.style.display = 'none';
        eventList.forEach(event => {
            const isRegistered = this.isUserRegistered(event.id);
            container.appendChild(event.render(isRegistered));
        });
    }
    renderAllEvents() {
        const activeEvents = this.events.filter(event => event.estado === 'activo');
        this.renderEvents(eventosContainer, activeEvents, noEventsAll);
    }
    renderMyEvents() {
        const myEvents = this.events.filter(event => this.isUserRegistered(event.id));
        this.renderEvents(misEventosContainer, myEvents, noEventsMine);
    }
    registerForEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) {
            showInfoModal('Error', 'Evento no encontrado.');
            return false;
        }
        if (this.isUserRegistered(eventId)) {
            showInfoModal('Información', 'Ya estás inscrito en este evento.');
            return false;
        }
        if (event.inscritos >= event.capacidad) {
            showInfoModal('Cupo Lleno', 'Lo sentimos, el evento ha alcanzado su capacidad máxima.');
            return false;
        }
        this.userRegistrations.push(eventId);
        event.inscritos++;
        this.saveRegistrations();
        showInfoModal('¡Éxito!', `Te has inscrito en "${event.nombre}"`);
        this.renderAllEvents();
        this.renderMyEvents();
        return true;
    }
    cancelEventRegistration(eventId) {
        const eventIndex = this.userRegistrations.indexOf(eventId);
        if (eventIndex > -1) {
            const event = this.events.find(e => e.id === eventId);
            const eventName = event ? event.nombre : 'el evento';
            if (event) {
                event.inscritos--;
            }
            this.userRegistrations.splice(eventIndex, 1);
            this.saveRegistrations();
            showInfoModal('Cancelación Exitosa', `Has cancelado tu inscripción en "${eventName}".`);
            this.renderAllEvents();
            this.renderMyEvents();
            displayUserInfo();
            const eventosTabButton = document.querySelector('.tab[data-tab="eventos"]');
            if (eventosTabButton) {
                eventosTabButton.click();
            }
            return true;
        } else {
            showInfoModal('Error', 'No estás inscrito en este evento.');
            return false;
        }
    }
    applyFilters() {
        const searchTerm = buscador.value.toLowerCase().trim();
        const categoria = categoriaFilter.value;
        const ubicacion = ubicacionFilter.value;
        let filteredEvents = this.events.filter(event => event.estado === 'activo');
        if (searchTerm) {
            filteredEvents = filteredEvents.filter(event =>
                event.nombre.toLowerCase().includes(searchTerm) ||
                event.descripcion.toLowerCase().includes(searchTerm) ||
                event.ubicacion.toLowerCase().includes(searchTerm)
            );
        }
        if (categoria) {
            filteredEvents = filteredEvents.filter(event => event.categoria === categoria);
        }
        if (ubicacion) {
            filteredEvents = filteredEvents.filter(event => event.ubicacion === ubicacion);
        }
        this.renderEvents(eventosContainer, filteredEvents, noEventsAll);
    }
    clearFilters() {
        buscador.value = '';
        categoriaFilter.value = '';
        ubicacionFilter.value = '';
        this.applyFilters();
    }
}

function showInfoModal(title, message) {
    infoModalTitle.textContent = title;
    infoModalMessage.textContent = message;
    infoModal.classList.remove('hidden');
}

function hideInfoModal() {
    infoModal.classList.add('hidden');
}

function showConfirmModal(title, message, onConfirmCallback) {
    confirmModalTitle.textContent = title;
    confirmModalMessage.textContent = message;
    confirmModal.classList.remove('hidden');
    currentConfirmAction = onConfirmCallback;
}

function hideConfirmModal() {
    confirmModal.classList.add('hidden');
    currentConfirmAction = null;
}

function displayUserInfo() {
    if (loggedInUser && eventManager.userRegistrations.length > 0) {
        userInfoDisplay.innerHTML = `
            <h3>Datos de tu Registro:</h3>
            <p><strong>Nombre:</strong> ${loggedInUser.nombre}</p>
            <p><strong>DNI:</strong> ${loggedInUser.dni}</p>
            <p><strong>Teléfono:</strong> ${loggedInUser.telefono}</p>
            <p class="message-email">¡Te enviamos los datos completos a tu correo: <strong>${loggedInUser.email}</strong>!</p>
        `;
        userInfoDisplay.style.display = 'block';
    } else {
        userInfoDisplay.innerHTML = '';
        userInfoDisplay.style.display = 'none';
    }
}

const eventManager = new EventManager(initialEventsData, loggedInUser.email);

document.addEventListener('DOMContentLoaded', () => {
    eventManager.renderAllEvents();
    displayNoEventsMessage(eventosContainer, noEventsAll);
    displayNoEventsMessage(misEventosContainer, noEventsMine);
});

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.dataset.tab;
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(tabId).classList.add('active');
        if (tabId === 'eventos') {
            eventManager.renderAllEvents();
        } else if (tabId === 'mis-eventos') {
            displayUserInfo();
            eventManager.renderMyEvents();
        }
    });
});

logoutButton.addEventListener('click', () => {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
});

buscador.addEventListener('input', () => eventManager.applyFilters());
categoriaFilter.addEventListener('change', () => eventManager.applyFilters());
ubicacionFilter.addEventListener('change', () => eventManager.applyFilters());
limpiarFiltrosBtn.addEventListener('click', () => eventManager.clearFilters());

document.querySelectorAll('.eventos-grid').forEach(container => {
    container.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'BUTTON' && target.dataset.eventId) {
            const eventId = target.dataset.eventId;
            const action = target.dataset.action;
            if (action === 'inscribir') {
                eventManager.registerForEvent(eventId);
            } else if (action === 'cancelar') {
                const eventName = eventManager.events.find(e => e.id === eventId)?.nombre || 'este evento';
                showConfirmModal(
                    'Confirmar Cancelación',
                    `¿Estás seguro de que quieres cancelar tu inscripción en "${eventName}"?`,
                    () => {
                        eventManager.cancelEventRegistration(eventId);
                        hideConfirmModal();
                    }
                );
            }
        }
    });
});

infoModalCloseButton.addEventListener('click', hideInfoModal);
confirmCancelButton.addEventListener('click', hideConfirmModal);
confirmOKButton.addEventListener('click', () => {
    if (currentConfirmAction) {
        currentConfirmAction();
    }
});

window.addEventListener('click', (event) => {
    if (event.target === infoModal) {
        hideInfoModal();
    }
    if (event.target === confirmModal) {
        hideConfirmModal();
    }
});

function displayNoEventsMessage(container, messageElement) {
    if (container.children.length === 0) {
        messageElement.style.display = 'block';
    } else {
        messageElement.style.display = 'none';
    }
}
