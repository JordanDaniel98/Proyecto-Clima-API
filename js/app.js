const container = document.querySelector(".container");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

initEvents();

function initEvents() {
    document.addEventListener("DOMContentLoaded", () => {
        formulario.addEventListener("submit", buscarClima);
    });
}

function buscarClima(e) {
    e.preventDefault();
    const ciudad = document.querySelector("#ciudad").value;
    const pais = document.querySelector("#pais").value;

    const arrayValidar = [ciudad, pais];

    if (arrayValidar.includes("")) {
        generarAlerta("Ambos campos son obligatorios");
        return;
    }

    consultarAPI(ciudad, pais);
}

function consultarAPI(ciudad, pais) {
    const key = "21c2d6d8cbb8a1e218bd32001972e5be";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${key}`;

    fetch(url)
        .then((respuesta) => {
            if (!respuesta.ok) {
                console.log(respuesta);
                generarAlerta("Ciudad no encontrada");
                throw new Error("Error de servidor");
            }
            return respuesta.json();
        })
        .then((datos) => {
            generarClimaHTML(datos);
        })
        .catch((error) => {
            console.log("Ocurrió un error al obtener los datos de la API");
            console.log(error);
            throw new Error("No se pudieron obtener los datos de la API");
        });
}

function generarClimaHTML(datos) {
    // const { temp, temp_max, temp_min } = datos.main;
    const {
        main: { temp, temp_max, temp_min },
    } = datos;
    console.log(temp);
}
function generarAlerta(mensaje) {
    const isAlert = document.querySelector(".bg-red-100");
    if (!isAlert) {
        const alerta = document.createElement("div");
        alerta.textContent = mensaje;
        alerta.classList.add(
            "bg-red-100",
            "border-red-400",
            "text-red-700",
            "py-3",
            "px-4",
            "rounded",
            "max-w-md",
            "mx-auto",
            "mt-6",
            "text-center"
        );
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>
        `;
        container.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}
