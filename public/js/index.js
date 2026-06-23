const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

if (typeof bootstrap !== 'undefined') {
    tooltipTriggerList.forEach(t => new bootstrap.Tooltip(t));
}

window.addEventListener('scroll', function() {
    const scrollBtn = document.querySelector('.scroll-to-top');

    if (scrollBtn) {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleInfoPanel() {
    const panel = document.getElementById('infoPanel');

    if (panel) {
        panel.classList.toggle('show');
    }
}

function closeInfoPanel() {
    const panel = document.getElementById('infoPanel');

    if (panel) {
        panel.classList.remove('show');
    }
}

document.addEventListener('click', function(event) {
    const panel = document.getElementById('infoPanel');
    const btn = document.querySelector('.floating-info-btn');
    const secondaryBtn = document.querySelector('.secondary-button');

    if (panel && btn && secondaryBtn && panel.classList.contains('show')) {
        if (!panel.contains(event.target) && !btn.contains(event.target) && !secondaryBtn.contains(event.target)) {
            closeInfoPanel();
        }
    }
});