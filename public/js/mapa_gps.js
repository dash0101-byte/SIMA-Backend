document.addEventListener('DOMContentLoaded', () => {
    const ESP32_URL = "http://172.16.117.50/gps";

    const map = L.map('map').setView([0, 0], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    const dronDot = L.circleMarker([0, 0], {
        radius: 9,
        color: '#ffffff',
        weight: 3,
        fillColor: '#161212',
        fillOpacity: 1
    }).addTo(map);

    let pulseMarker = null;
    let firstFix = true;

    const pathCoords = [];

    const pathLine = L.polyline(pathCoords, {
        color: '#646464',
        weight: 3,
        opacity: 0.8
    }).addTo(map);

    const centerControl = L.control({ position: 'topright' });

    centerControl.onAdd = function () {
        const div = L.DomUtil.create('div', 'leaflet-control-center');
        div.innerHTML = '<i class="fas fa-crosshairs"></i>';
        div.title = "Centrar dron";

        div.onclick = () => {
            const pos = dronDot.getLatLng();
            if (!pos) return;
            map.panTo(pos);
        };

        return div;
    };

    centerControl.addTo(map);

    function darkenColor(hex, factor = 0.35) {
        hex = hex.replace('#', '');

        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        r = Math.max(0, Math.floor(r * (1 - factor)));
        g = Math.max(0, Math.floor(g * (1 - factor)));
        b = Math.max(0, Math.floor(b * (1 - factor)));

        return '#' +
            r.toString(16).padStart(2, '0') +
            g.toString(16).padStart(2, '0') +
            b.toString(16).padStart(2, '0');
    }

    async function obtenerGPS() {
        const t0 = performance.now();

        try {
            const res = await fetch(ESP32_URL);
            const data = await res.json();
            const latency = Math.round(performance.now() - t0);

            if (!data.lat || !data.lon) return;

            const pos = [data.lat, data.lon];

            dronDot.setLatLng(pos);

            pathCoords.push(pos);
            pathLine.setLatLngs(pathCoords);

            if (!pulseMarker) {
                pulseMarker = L.marker(pos, {
                    icon: L.divIcon({
                        html: '<div class="gps-pulse"></div>',
                        iconSize: [40, 40],
                        iconAnchor: [20, 20]
                    }),
                    interactive: false
                }).addTo(map);
            } else {
                pulseMarker.setLatLng(pos);
            }

            if (firstFix) {
                map.setView(pos, 19);
                firstFix = false;
            }

            let color = '#e74c3c';

            if (data.sats >= 8) {
                color = '#1abc9c';
            } else if (data.sats >= 5) {
                color = '#f1c40f';
            }

            const pulseEl = pulseMarker.getElement().firstChild;

            pulseEl.style.background = color;
            pulseEl.style.borderColor = darkenColor(color, 0.35);

            document.getElementById("gps-sats").textContent = data.sats ?? "—";
            document.getElementById("gps-alt").textContent = `${data.alt ?? "—"} m`;
            document.getElementById("gps-speed").textContent = `${Number(data.speed ?? 0).toFixed(0)} cm/s`;
            document.getElementById("gps-latency").textContent = `${latency} ms`;
            document.getElementById("status-text").textContent = "Dron conectado";

        } catch (error) {
            document.getElementById("status-text").textContent = "ESP32 desconectado";
        }
    }

    obtenerGPS();
    setInterval(obtenerGPS, 1000);
});