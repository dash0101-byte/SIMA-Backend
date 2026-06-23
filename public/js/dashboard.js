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

    window.scrollTo({

        top: 0,

        behavior: 'smooth'

    });

}

// ======================
// VARIABLES
// ======================

const ENV_URL = "http://172.16.117.50/env";

const GPS_URL = "http://172.16.117.50/gps";

const hist = {

    t: [],

    h: [],

    c: [],

    g: []

};

let lastGeoTime = 0;

// ======================
// FUNCIONES AUXILIARES
// ======================

function push(arr, val) {

    arr.push(val);

    if (arr.length > 15) {

        arr.shift();

    }

}

function trend(arr) {

    if (arr.length < 2) {

        return {

            icon: "→",

            cls: "trend-flat",

            txt: "Estable"

        };

    }

    const d = arr[arr.length - 1] - arr[arr.length - 2];

    if (d > 0.5) {

        return {

            icon: "↑",

            cls: "trend-up",

            txt: "Subiendo"

        };

    }

    if (d < -0.5) {

        return {

            icon: "↓",

            cls: "trend-down",

            txt: "Bajando"

        };

    }

    return {

        icon: "→",

        cls: "trend-flat",

        txt: "Estable"

    };

}

function setStatus(el, txt, lvl) {

    el.textContent = txt;

    el.className =

        "card-status " +

        (

            lvl === "ok"

                ? "status-ok"

                : lvl === "warn"

                    ? "status-warn"

                    : "status-bad"

        );

}

function calcIAQ(d) {

    let score = 100;

    if (d.co2 > 1200) {

        score -= 40;

    } else if (d.co2 > 800) {

        score -= 20;

    }

    if (d.humidity < 30 || d.humidity > 70) {

        score -= 15;

    }

    if (d.gas < 80000) {

        score -= 10;

    }

    return Math.max(0, score);

}

// ======================
// SENSORES
// ======================

function update() {

    fetch(ENV_URL)

        .then(r => r.json())

        .then(d => {

            push(hist.t, d.temperature);

            push(hist.h, d.humidity);

            push(hist.c, d.co2);

            push(hist.g, d.gas);

            temperature.textContent = d.temperature.toFixed(1);

            humidity.textContent = d.humidity.toFixed(1);

            co2.textContent = Math.round(d.co2);

            pressure.textContent = d.pressure.toFixed(1);

            gas.textContent = Math.round(d.gas);

            const tt = trend(hist.t);

            const th = trend(hist.h);

            const tc = trend(hist.c);

            const tg = trend(hist.g);

            trendTemp.textContent = `${tt.icon} ${tt.txt}`;

            trendTemp.className = tt.cls;

            trendHum.textContent = `${th.icon} ${th.txt}`;

            trendHum.className = th.cls;

            trendCO2.textContent = `${tc.icon} ${tc.txt}`;

            trendCO2.className = tc.cls;

            trendGas.textContent = `${tg.icon} ${tg.txt}`;

            trendGas.className = tg.cls;

            setStatus(

                tempStatus,

                d.temperature < 18

                    ? "Frío"

                    : d.temperature > 28

                        ? "Caliente"

                        : "Confort",

                d.temperature < 18 || d.temperature > 28

                    ? "warn"

                    : "ok"

            );

            setStatus(

                humStatus,

                d.humidity < 30

                    ? "Seco"

                    : d.humidity > 70

                        ? "Húmedo"

                        : "Ideal",

                d.humidity < 30 || d.humidity > 70

                    ? "warn"

                    : "ok"

            );

            setStatus(

                co2Status,

                d.co2 < 600

                    ? "Excelente"

                    : d.co2 < 1000

                        ? "Aceptable"

                        : "Alto",

                d.co2 < 600

                    ? "ok"

                    : d.co2 < 1000

                        ? "warn"

                        : "bad"

            );

            setStatus(

                gasStatus,

                d.gas > 100000

                    ? "Bueno"

                    : "Cuidado",

                d.gas > 100000

                    ? "ok"

                    : "warn"

            );

            const iaq = calcIAQ(d);

            if (document.getElementById("globalBadge")) {

                globalBadge.className =

                    "badge-global " +

                    (

                        iaq > 80

                            ? "bg-ok"

                            : iaq > 60

                                ? "bg-warn"

                                : "bg-bad"

                    );

                globalBadge.textContent =

                    iaq > 80

                        ? "Ambiente saludable"

                        : iaq > 60

                            ? "Ventilación recomendada"

                            : "Mala calidad del aire";

            }

            if (d.co2 > 1200) {

                alerta.style.display = "block";

                alerta.textContent =

                    "⚠ CO₂ alto: ventila inmediatamente";

            }

            else {

                alerta.style.display = "none";

            }

        })

        .catch(error => {

            console.error(error);

        });

}

// ======================
// UBICACIÓN
// ======================

async function getLocationName(lat, lon) {

    try {

        const url =

            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

        const res = await fetch(

            url,

            {

                headers: {

                    "Accept-Language": "es"

                }

            }

        );

        const d = await res.json();

        const a = d.address || {};

        return [

            a.suburb ||

            a.neighbourhood ||

            a.village ||

            "",

            a.city ||

            a.municipality ||

            "",

            a.state ||

            ""

        ]

            .filter(Boolean)

            .join(", ");

    }

    catch {

        return "Ubicación no disponible";

    }

}

// ======================
// ESTADO DEL DRON
// ======================

async function updateDroneStatus() {

    try {

        const res = await fetch(

            GPS_URL,

            {

                cache: "no-store"

            }

        );

        const data = await res.json();

        if (!data.lat || !data.lon) {

            throw "No fix";

        }

        droneState.textContent = "En operación";

        droneStatus.textContent = "Activo";

        droneStatus.className =

            "card-status status-ok";

        droneCoords.textContent =

            `Lat: ${data.lat.toFixed(5)} | Lon: ${data.lon.toFixed(5)}`;

        if (Date.now() - lastGeoTime > 15000) {

            lastGeoTime = Date.now();

            const loc = await getLocationName(

                data.lat,

                data.lon

            );

            droneLocation.textContent = loc;

        }

    }

    catch {

        droneState.textContent = "Desconectado";

        droneStatus.textContent = "Sin señal";

        droneStatus.className =

            "card-status status-bad";

        droneLocation.textContent = "—";

        droneCoords.textContent =

            "Lat: — | Lon: —";

    }

}

// ======================
// INICIAR
// ======================

update();

updateDroneStatus();

setInterval(update, 3000);

setInterval(updateDroneStatus, 5000);