const registerButton = document.getElementById('register');
const loginButton = document.getElementById('login');
const container = document.getElementById('container');

const signUpForm = document.getElementById('signUpForm');
const signUpNameInput = document.getElementById('signUpName');
const signUpEmailInput = document.getElementById('signUpEmail');
const signUpDniInput = document.getElementById('signUpDni');
const signUpPhoneInput = document.getElementById('signUpPhone');
const signUpPasswordInput = document.getElementById('signUpPassword');

const signInForm = document.getElementById('signInForm');
const signInEmailInput = document.getElementById('signInEmail');
const signInPasswordInput = document.getElementById('signInPassword');

const successModal = document.getElementById('successModal');
const closeSuccessButton = document.querySelector('.success-close');
const modalLoginButton = document.getElementById('modalLoginButton');

const alertModal = document.getElementById('alertModal');
const closeAlertButton = document.querySelector('.alert-close');
const alertModalTitle = document.getElementById('alertModalTitle');
const alertModalMessage = document.getElementById('alertModalMessage');
const alertModalOKButton = document.getElementById('alertModalOKButton');

function showAlertModal(title, message) {
    alertModalTitle.textContent = title;
    alertModalMessage.textContent = message;
    alertModal.style.display = 'flex';
}

registerButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

loginButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = signUpNameInput.value.trim();
    const email = signUpEmailInput.value.trim();
    const dni = signUpDniInput.value.trim();
    const phone = signUpPhoneInput.value.trim();
    const password = signUpPasswordInput.value.trim();

    if (!name || !email || !dni || !phone || !password) {
        showAlertModal('Error de Registro', 'Por favor, completa todos los campos para registrarte.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlertModal('Email Inválido', 'Por favor, ingresa un formato de correo electrónico válido.');
        return;
    }
    if (!email.endsWith('.com') && !email.endsWith('.pe')) {
        showAlertModal('Email Inválido', 'El correo debe terminar en ".com" o ".pe".');
        return;
    }

    const dniRegex = /^[0-9]{8}$/;
    if (!dniRegex.test(dni)) {
        showAlertModal('DNI Inválido', 'El DNI debe contener exactamente 8 números.');
        return;
    }

    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        showAlertModal('Teléfono Inválido', 'El número de teléfono debe contener exactamente 9 números.');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = users.some(user => user.email === email);

    if (userExists) {
        showAlertModal('Error de Registro', 'Este email ya está registrado. Por favor, usa otro o inicia sesión.');
    } else {
        users.push({ name, email, dni, phone, password });
        localStorage.setItem('users', JSON.stringify(users));

        successModal.style.display = 'flex';
        signUpNameInput.value = '';
        signUpEmailInput.value = '';
        signUpDniInput.value = '';
        signUpPhoneInput.value = '';
        signUpPasswordInput.value = '';
    }
});

signInForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signInEmailInput.value.trim();
    const password = signInPasswordInput.value.trim();

    if (!email || !password) {
        showAlertModal('Error de Login', 'Por favor, ingresa tu email y contraseña.');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(user => user.email === email && user.password === password);

    if (foundUser) {
        sessionStorage.setItem('loggedInUser', JSON.stringify(foundUser));
        window.location.href = 'home.html';
    } else {
        showAlertModal('Error de Login', 'Email o contraseña incorrectos.');
    }
});

closeSuccessButton.addEventListener('click', () => {
    successModal.style.display = 'none';
    container.classList.remove("right-panel-active");
});

modalLoginButton.addEventListener('click', () => {
    successModal.style.display = 'none';
    container.classList.remove("right-panel-active");
});

window.addEventListener('click', (event) => {
    if (event.target == successModal) {
        successModal.style.display = 'none';
        container.classList.remove("right-panel-active");
    }
});

closeAlertButton.addEventListener('click', () => {
    alertModal.style.display = 'none';
});

alertModalOKButton.addEventListener('click', () => {
    alertModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == alertModal) {
        alertModal.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
        // window.location.href = 'home.html';
    }
});
