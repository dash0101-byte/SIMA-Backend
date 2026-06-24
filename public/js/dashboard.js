// ======================
// SCROLL TO TOP
// ======================
window.addEventListener('scroll', function () {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (!scrollBtn) return;
    if (window.scrollY > 300) {
        scrollBtn.classList.add('show');
    } else {
        scrollBtn.classList.remove('show');
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ======================
// VARIABLES DE NODE.JS
// ======================
// Ruta relativa hacia tu nuevo backend. Si tu compañera montó las rutas 
// de otra forma (ej. "/api/sensores"), solo cámbialo aquí.
const API_URL = "/sensores"; 

const hist = { t: [], h: [], c: [], g: [] };
let lastGeoTime = 0;

// ======================
// FUNCIONES AUXILIARES
// ======================
function push(arr, val) {
    arr.push(val);
    if (arr.length > 15) arr.shift();
}

function trend(arr) {
    if (arr.length < 2) return { icon: "→", cls: "trend-flat", txt: "Estable" };
    const d = arr[arr.length - 1] - arr[arr.length - 2];
    if (d > 0.5) return { icon: "↑", cls: "trend-up", txt: "Subiendo" };
    if (d < -0.5) return { icon: "↓", cls: "trend-down", txt: "Bajando" };
    return { icon: "→", cls: "trend-flat", txt: "Estable" };
}

function setStatus(el, txt, lvl) {
    if(!el) return;
    el.textContent = txt;
    el.className = "card-status " + (lvl === "ok" ? "status-ok" : lvl === "warn" ? "status-warn" : "status-bad");
}

function calcIAQ(d) {
    let score = 100;
    // Evaluamos con las variables en español que vienen de Node.js
    if (d.co2 > 1200) score -= 40;
    else if (d.co2 > 800) score -= 20;
    if (d.humedad < 30 || d.humedad > 70) score -= 15; 
    return Math.max(0, score);
}

// ======================
// UBICACIÓN (OpenStreetMap)
// ======================
async function getLocationName(lat, lon) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
        const res = await fetch(url, { headers: { "Accept-Language": "es" } });
        const d = await res.json();
        const a = d.address || {};
        return [a.suburb || a.neighbourhood || a.village || "", a.city || a.municipality || "", a.state || ""]
            .filter(Boolean).join(", ");
    } catch {
        return "Ubicación no disponible";
    }
}

// ======================
// MOTOR PRINCIPAL (Dron + Sensores)
// ======================
function update() {
    fetch(API_URL)
        .then(r => r.json())
        .then(async (d) => {
            // 1. GRAFICAR SENSORES AMBIENTALES
            // Usamos d.temperatura, d.humedad, etc., para empatar con MongoDB
            push(hist.t, d.temperatura || 0);
            push(hist.h, d.humedad || 0);
            push(hist.c, d.co2 || 0);
            push(hist.g, 0); // Omitimos el gas analógico por ahora

            document.getElementById('temperature').textContent = (d.temperatura || 0).toFixed(1);
            document.getElementById('humidity').textContent = (d.humedad || 0).toFixed(1);
            document.getElementById('co2').textContent = Math.round(d.co2 || 0);
            document.getElementById('pressure').textContent = (d.presion || 0).toFixed(1);
            
            const gasEl = document.getElementById('gas');
            if(gasEl) gasEl.textContent = "--";

            // Calculamos tendencias
            const tt = trend(hist.t);
            const th = trend(hist.h);
            const tc = trend(hist.c);

            document.getElementById('trendTemp').textContent = `${tt.icon} ${tt.txt}`;
            document.getElementById('trendTemp').className = tt.cls;
            document.getElementById('trendHum').textContent = `${th.icon} ${th.txt}`;
            document.getElementById('trendHum').className = th.cls;
            document.getElementById('trendCO2').textContent = `${tc.icon} ${tc.txt}`;
            document.getElementById('trendCO2').className = tc.cls;

            // Alertas de salud
            setStatus(document.getElementById('tempStatus'), 
                d.temperatura < 18 ? "Frío" : d.temperatura > 28 ? "Caliente" : "Confort",
                d.temperatura < 18 || d.temperatura > 28 ? "warn" : "ok");
                
            setStatus(document.getElementById('humStatus'),
                d.humedad < 30 ? "Seco" : d.humedad > 70 ? "Húmedo" : "Ideal",
                d.humedad < 30 || d.humedad > 70 ? "warn" : "ok");
                
            setStatus(document.getElementById('co2Status'),
                d.co2 < 600 ? "Excelente" : d.co2 < 1000 ? "Aceptable" : "Alto",
                d.co2 < 600 ? "ok" : d.co2 < 1000 ? "warn" : "bad");

            // Insignia de Calidad del Aire (IAQ)
            const iaq = calcIAQ(d);
            const globalBadge = document.getElementById("globalBadge");
            if (globalBadge) {
                globalBadge.className = "badge-global " + (iaq > 80 ? "bg-ok" : iaq > 60 ? "bg-warn" : "bg-bad");
                globalBadge.textContent = iaq > 80 ? "Ambiente saludable" : iaq > 60 ? "Ventilación recomendada" : "Mala calidad del aire";
            }

            const alerta = document.getElementById('alerta');
            if (alerta) {
                if (d.co2 > 1200) {
                    alerta.style.display = "block";
                    alerta.textContent = "⚠ CO₂ alto: ventila inmediatamente";
                } else {
                    alerta.style.display = "none";
                }
            }

            // 2. GRAFICAR GPS Y ESTADO DEL DRON
            const droneState = document.getElementById('droneState');
            const droneStatus = document.getElementById('droneStatus');
            const droneCoords = document.getElementById('droneCoords');
            const droneLocation = document.getElementById('droneLocation');

            // Si el backend nos da coordenadas válidas, las separamos
            if (d.gps && d.gps !== 'Inactivo' && d.gps !== '-') {
                const parts = d.gps.split(',');
                if(parts.length === 2) {
                    const lat = parseFloat(parts[0]);
                    const lon = parseFloat(parts[1]);

                    if(droneState) droneState.textContent = d.estado || "En operación";
                    if(droneStatus) {
                        droneStatus.textContent = "Activo";
                        droneStatus.className = "card-status status-ok";
                    }
                    if(droneCoords) droneCoords.textContent = `Lat: ${lat.toFixed(5)} | Lon: ${lon.toFixed(5)}`;

                    // Consultar nombre de la calle cada 15 segundos para no saturar la API externa
                    if (Date.now() - lastGeoTime > 15000 && droneLocation) {
                        lastGeoTime = Date.now();
                        const loc = await getLocationName(lat, lon);
                        droneLocation.textContent = loc;
                    }
                }
            } else {
                // Estado cuando el dron está apagado o la base de datos está vacía
                if(droneState) droneState.textContent = "Desconectado";
                if(droneStatus) {
                    droneStatus.textContent = "Sin señal";
                    droneStatus.className = "card-status status-bad";
                }
                if(droneLocation) droneLocation.textContent = "—";
                if(droneCoords) droneCoords.textContent = "Lat: — | Lon: —";
            }
        })
        .catch(error => console.error("Error leyendo datos del backend:", error));
}

// ======================
// INICIAR CICLO
// ======================
// Arrancamos una sola vez y leemos el backend cada 2 segundos
update();
setInterval(update, 2000);