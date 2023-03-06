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

    spinner();

    fetch(url)
        .then((respuesta) => {
            if (!respuesta.ok) {
                console.log(respuesta);
                generarAlerta("Ciudad no encontrada");
                limpiarHTML();
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
    limpiarHTML();
    // const { temp, temp_max, temp_min } = datos.main;
    const {
        main: { temp, temp_max, temp_min },
        name,
    } = datos;

    const centigrados = kelvinACentigrados(temp);
    const centigrados_max = kelvinACentigrados(temp_max);
    const centigrados_min = kelvinACentigrados(temp_min);

    const ciudad = document.createElement("p");
    ciudad.classList.add("font-bold", "text-2xl");
    ciudad.textContent = `Clima en ${name}`;

    const actual = document.createElement("p");
    actual.classList.add("font-bold", "text-6xl");
    actual.innerHTML = `${centigrados} &#8451`;

    const tempMax = document.createElement("p");
    tempMax.classList.add("text-xl");
    tempMax.innerHTML = `Max: ${centigrados_max} &#8451`;

    const tempMin = document.createElement("p");
    tempMin.classList.add("text-xl");
    tempMin.innerHTML = `Min: ${centigrados_min} &#8451`;

    const resultadoDiv = document.createElement("div");
    resultadoDiv.classList.add("text-center", "text-white");

    resultadoDiv.appendChild(ciudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(tempMin);

    resultado.appendChild(resultadoDiv);
}

/*function kelvinACentigrados(grados) {
    return parseInt(grados - 273.15);
}*/

function spinner() {
    limpiarHTML();
    const divSpinner = document.createElement("div");
    divSpinner.classList.add("sk-fading-circle");
    divSpinner.innerHTML = `
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `;
    resultado.appendChild(divSpinner);
}
const kelvinACentigrados = (grados) => {
    return parseInt(grados - 273.15);
};

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
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
