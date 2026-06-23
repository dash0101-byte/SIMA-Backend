document.addEventListener('DOMContentLoaded', () => {
    const formulariosEliminar = document.querySelectorAll('.form-eliminar');
    const formulariosHacerAdmin = document.querySelectorAll('.form-hacer-admin');
    const formulariosQuitarAdmin = document.querySelectorAll('.form-quitar-admin');

    formulariosEliminar.forEach(form => {
        form.addEventListener('submit', e => {
            if (!confirm('⚠️ ¿Seguro que quieres eliminar este usuario?')) {
                e.preventDefault();
            }
        });
    });

    formulariosHacerAdmin.forEach(form => {
        form.addEventListener('submit', e => {
            if (!confirm('👑 ¿Quieres convertir este usuario en administrador?')) {
                e.preventDefault();
            }
        });
    });

    formulariosQuitarAdmin.forEach(form => {
        form.addEventListener('submit', e => {
            if (!confirm('⚠️ ¿Seguro que quieres quitarle permisos de administrador?')) {
                e.preventDefault();
            }
        });
    });
});