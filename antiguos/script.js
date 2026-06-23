// Datos simulados. Luego los reemplazas por tu API real.
const datosDron = {
    bateria: 78,
    temperatura: 26,
    humedad: 55,
    magnetica: "Cargando en base magnética",
    lat: 19.4326,
    lng: -99.1332
};

// Mostrar datos
document.getElementById("bateria").textContent = datosDron.bateria + "%";
document.getElementById("temperatura").textContent = datosDron.temperatura + "°C";
document.getElementById("humedad").textContent = datosDron.humedad + "%";
document.getElementById("magnetica").textContent = datosDron.magnetica;

// Mapa
var mapa = L.map('mapa').setView([datosDron.lat, datosDron.lng], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(mapa);

L.marker([datosDron.lat, datosDron.lng])
  .addTo(mapa)
  .bindPopup("Posición actual del dron")
  .openPopup();
