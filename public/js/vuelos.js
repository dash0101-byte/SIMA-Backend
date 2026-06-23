const buscador = document.getElementById("buscarVuelo");
const filas = document.querySelectorAll(".fila-vuelo");
const contador = document.getElementById("contadorVuelos");

function actualizarContador() {
    let visibles = 0;

    filas.forEach(fila => {
        if (!fila.classList.contains("oculto")) {
            visibles++;
        }
    });

    contador.textContent = "Vuelos visibles: " + visibles;
}

if (buscador) {
    buscador.addEventListener("keyup", function () {
        const texto = this.value.toLowerCase();

        filas.forEach(fila => {
            const contenido = fila.textContent.toLowerCase();

            if (contenido.includes(texto)) {
                fila.classList.remove("oculto");
                fila.style.display = "";
            } else {
                fila.classList.add("oculto");
                fila.style.display = "none";
            }
        });

        actualizarContador();
    });
}

actualizarContador();