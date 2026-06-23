const formularioRegistro = document.getElementById('formularioRegistro');
const password = document.getElementById('password');
const confirmarPassword = document.getElementById('confirmarPassword');
const alertaPassword = document.getElementById('alertaPassword');

if (formularioRegistro) {
    formularioRegistro.addEventListener('submit', function (e) {
        if (password.value !== confirmarPassword.value) {
            e.preventDefault();

            alertaPassword.textContent = 'Las contraseñas no coinciden';
            alertaPassword.style.display = 'block';

            confirmarPassword.focus();
        }
    });
}

if (confirmarPassword) {
    confirmarPassword.addEventListener('input', function () {
        if (password.value === confirmarPassword.value) {
            alertaPassword.style.display = 'none';
        }
    });
}