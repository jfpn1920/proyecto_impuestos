//------------------------------------//
//--|funcionalidad_menu_hamburguesa|--//
//------------------------------------//
const toggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
toggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});
//----------------------------------------//
//--|funcionalidad_agregar_el_municipio|--//
//----------------------------------------//
const btnAdd = document.querySelector(".btn-add");
const inputMunicipio = document.getElementById("municipioInput");
btnAdd.addEventListener("click", () => {
    const nombreMunicipio = inputMunicipio.value.trim();
    if (nombreMunicipio === "") {
        alert("Por favor, escribe el nombre del municipio.");
        return;
    }
    console.log("Municipio agregado:", nombreMunicipio);
    agregarFila(nombreMunicipio);
    guardarMunicipio(nombreMunicipio);
    inputMunicipio.value = "";
});
//--------------------------------------//
//--|funcionalidad_agregar_el_archivo|--//
//--------------------------------------//
const btnSeleccionar = document.getElementById("btnSeleccionar");
const btnEnviar = document.getElementById("btnEnviar");
const inputArchivo = document.getElementById("inputArchivo");
const areaArchivos = document.getElementById("areaArchivos");
let archivosSeleccionados = [];
document.addEventListener("DOMContentLoaded", () => {
    const archivosGuardados = JSON.parse(localStorage.getItem("archivos")) || [];
    archivosSeleccionados = archivosGuardados;
    mostrarArchivos();
    const municipiosGuardados = JSON.parse(localStorage.getItem("municipiosConArchivo")) || [];
    const tbody = document.getElementById("municipioTableBody");
    municipiosGuardados.forEach(({ municipio, archivo }) => {
        const fila = document.createElement("tr");
        const tdMunicipio = document.createElement("td");
        tdMunicipio.textContent = municipio;
        const tdArchivo = document.createElement("td");
        const icono = document.createElement("i");
        icono.className = "fa-solid fa-file-excel";
        icono.style.color = "green";
        icono.style.fontSize = "20px";
        icono.style.marginRight = "5px";
        const span = document.createElement("span");
        span.textContent = archivo;
        span.style.fontSize = "16px";
        span.style.color = "#333";
        tdArchivo.appendChild(icono);
        tdArchivo.appendChild(span);
        fila.appendChild(tdMunicipio);
        fila.appendChild(tdArchivo);
        tbody.appendChild(fila);
    });
});
btnSeleccionar.addEventListener("click", () => {
    inputArchivo.click();
});
inputArchivo.addEventListener("change", () => {
    archivosSeleccionados = Array.from(inputArchivo.files).map(f => f.name);
    localStorage.setItem("archivos", JSON.stringify(archivosSeleccionados)); 
    mostrarArchivos();
});
function mostrarArchivos() {
    areaArchivos.innerHTML = "";
    archivosSeleccionados.forEach((archivo) => {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.justifyContent = "flex-start";
        div.style.margin = "5px 0";
        const icono = document.createElement("i");
        icono.className = "fa-solid fa-file-excel";
        icono.style.color = "green";
        icono.style.marginLeft = "5px";
        icono.style.fontSize = "40px";
        const span = document.createElement("span");
        span.textContent = archivo;
        span.style.fontSize = "18px";
        span.style.marginLeft = "8px";
        span.style.color = "#333";
        div.appendChild(icono);
        div.appendChild(span);
        areaArchivos.appendChild(div);
    });
}
btnEnviar.addEventListener("click", () => {
    if (archivosSeleccionados.length === 0) {
        alert("Primero selecciona un archivo.");
        return;
    }
    const tbody = document.getElementById("municipioTableBody");
    const ultimaFila = tbody.lastElementChild;
    if (!ultimaFila) {
        alert("Primero añade un municipio antes de asignar un archivo.");
        return;
    }
    const tdArchivo = ultimaFila.querySelector("td:nth-child(2)");
    tdArchivo.innerHTML = "";
    const icono = document.createElement("i");
    icono.className = "fa-solid fa-file-excel";
    icono.style.color = "green";
    icono.style.fontSize = "20px";
    icono.style.marginRight = "5px";
    const span = document.createElement("span");
    span.textContent = archivosSeleccionados[0]; 
    span.style.fontSize = "16px";
    span.style.color = "#333";
    tdArchivo.appendChild(icono);
    tdArchivo.appendChild(span);
    const municipio = ultimaFila.querySelector("td:first-child").textContent;
    let municipios = JSON.parse(localStorage.getItem("municipiosConArchivo")) || [];
    municipios.push({
        municipio,
        archivo: archivosSeleccionados[0]
    });
    localStorage.setItem("municipiosConArchivo", JSON.stringify(municipios));
    console.log("Archivo asignado:", archivosSeleccionados[0], "al municipio:", municipio);
    archivosSeleccionados = [];
    localStorage.setItem("archivos", JSON.stringify([]));
    areaArchivos.innerHTML = "";
});
//-----------------------------------------//
//--|funcionalidad_municipios_pendientes|--//
//-----------------------------------------//
document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector(".municipios-table tbody");
    const btnQuitarTodo = document.querySelector(".btn-quitar-todo");
    //----------------------------------------
    // Obtener municipios desde localStorage
    //----------------------------------------
    function obtenerMunicipios() {
        return JSON.parse(localStorage.getItem("municipiosPendientes")) || [];
    }
    function guardarMunicipios(municipios) {
        localStorage.setItem("municipiosPendientes", JSON.stringify(municipios));
    }
    //----------------------------------------
    // Renderizar tabla
    //----------------------------------------
    function renderTabla() {
        tbody.innerHTML = "";
        const municipios = obtenerMunicipios();
        municipios.forEach((m, index) => {
            const tr = document.createElement("tr");
            // Nombre
            const tdNombre = document.createElement("td");
            tdNombre.textContent = m.nombre;
            // Archivo
            const tdArchivo = document.createElement("td");
            tdArchivo.textContent = m.archivo ? m.archivo : "Sin archivo";
            // Acciones
            const tdAcciones = document.createElement("td");
            // Icono eliminar
            const iconEliminar = document.createElement("i");
            iconEliminar.className = "fa-solid fa-trash";
            iconEliminar.style.cursor = "pointer";
            iconEliminar.style.marginRight = "10px";
            iconEliminar.style.color = "red";
            iconEliminar.title = "Eliminar";
            iconEliminar.addEventListener("click", () => {
                eliminarMunicipio(index);
            });
            // Icono quitar de pendientes
            const iconQuitarPendiente = document.createElement("i");
            iconQuitarPendiente.className = "fa-solid fa-check-circle";
            iconQuitarPendiente.style.cursor = "pointer";
            iconQuitarPendiente.style.color = "green";
            iconQuitarPendiente.title = "Quitar de pendientes";
            iconQuitarPendiente.addEventListener("click", () => {
                quitarDePendientes(index);
            });
            tdAcciones.appendChild(iconEliminar);
            tdAcciones.appendChild(iconQuitarPendiente);
            tr.appendChild(tdNombre);
            tr.appendChild(tdArchivo);
            tr.appendChild(tdAcciones);
            tbody.appendChild(tr);
        });
    }
    //----------------------------------------
    // Eliminar municipio individual
    //----------------------------------------
    function eliminarMunicipio(index) {
        let municipios = obtenerMunicipios();
        municipios.splice(index, 1);
        guardarMunicipios(municipios);
        renderTabla();
    }
    //----------------------------------------
    // Quitar de pendientes (solo lo quita de la lista de pendientes)
    //----------------------------------------
    function quitarDePendientes(index) {
        let municipios = obtenerMunicipios();
        const municipioQuitado = municipios.splice(index, 1)[0];
        guardarMunicipios(municipios);
        renderTabla();
        alert(`El municipio "${municipioQuitado.nombre}" fue quitado de pendientes.`);
    }
    //----------------------------------------
    // Eliminar todos
    //----------------------------------------
    btnQuitarTodo.addEventListener("click", () => {
        localStorage.removeItem("municipiosPendientes");
        renderTabla();
    });
    //----------------------------------------
    // Inicializar tabla
    //----------------------------------------
    renderTabla();
});
//----------------------------------------//
//--|funcionalidad_tablero_de_municipio|--//
//----------------------------------------//
document.addEventListener("DOMContentLoaded", () => {
    const inputMunicipio = document.querySelector(".municipio-card input[type='text']");
    const inputArchivo = document.querySelector(".municipio-card input[type='file']");
    const btnAddMunicipio = document.querySelector(".municipio-card .btn-add");
    const tbody = document.querySelector(".tablero table tbody");
    const btnGuardarTodo = document.querySelector(".tablero .btns button:nth-child(1)");
    const btnEliminarTodo = document.querySelector(".tablero .btns button:nth-child(2)");
    //----------------------------------------
    // Guardar en pendientes
    //----------------------------------------
    function guardarPendiente(municipioObj) {
        let pendientes = JSON.parse(localStorage.getItem("municipiosPendientes")) || [];
        // Evitar duplicados
        if (!pendientes.some(m => m.nombre === municipioObj.nombre)) {
            pendientes.push(municipioObj);
            localStorage.setItem("municipiosPendientes", JSON.stringify(pendientes));
        }
    }
    //----------------------------------------
    // Agregar fila
    //----------------------------------------
    function agregarFila(municipioObj) {
        const tr = document.createElement("tr");
        const tdMunicipio = document.createElement("td");
        tdMunicipio.textContent = municipioObj.nombre;
        const tdArchivo = document.createElement("td");
        tdArchivo.textContent = municipioObj.archivo ? municipioObj.archivo : "Sin archivo";
        const tdAcciones = document.createElement("td");
        // Icono pendiente
        const iconPendiente = document.createElement("i");
        iconPendiente.className = "fa-solid fa-clock";
        iconPendiente.style.cursor = "pointer";
        iconPendiente.style.marginRight = "10px";
        iconPendiente.style.color = "#f0ad4e";
        iconPendiente.title = "Marcar pendiente";
        iconPendiente.addEventListener("click", () => {
            guardarPendiente(municipioObj);   // ✅ Guardar en pendientes
            eliminarMunicipio(municipioObj.nombre); // ✅ Eliminar del tablero principal
            renderTabla(); // ✅ Volver a pintar
        });
        // Icono eliminar
        const iconEliminar = document.createElement("i");
        iconEliminar.className = "fa-solid fa-trash";
        iconEliminar.style.cursor = "pointer";
        iconEliminar.style.marginRight = "10px";
        iconEliminar.style.color = "red";
        iconEliminar.title = "Eliminar";
        iconEliminar.addEventListener("click", () => {
            eliminarMunicipio(municipioObj.nombre);
            renderTabla();
        });
        // Icono enviar
        const iconEnviar = document.createElement("i");
        iconEnviar.className = "fa-solid fa-paper-plane";
        iconEnviar.style.cursor = "pointer";
        iconEnviar.style.color = "blue";
        iconEnviar.title = "Enviar dato";
        iconEnviar.addEventListener("click", () => {
            alert(`Datos del municipio "${municipioObj.nombre}" enviados.`);
        });
        tdAcciones.appendChild(iconPendiente);
        tdAcciones.appendChild(iconEliminar);
        tdAcciones.appendChild(iconEnviar);
        tr.appendChild(tdMunicipio);
        tr.appendChild(tdArchivo);
        tr.appendChild(tdAcciones);
        tbody.appendChild(tr);
    }
    //----------------------------------------
    // LocalStorage de tablero principal
    //----------------------------------------
    function obtenerMunicipios() {
        return JSON.parse(localStorage.getItem("municipios")) || [];
    }
    function guardarMunicipio(nombre, archivo = null) {
        let municipios = obtenerMunicipios();
        if (municipios.some(m => m.nombre === nombre)) {
            alert(`El municipio "${nombre}" ya está en la lista.`);
            return false;
        }
        municipios.push({
            nombre: nombre,
            archivo: archivo ? archivo : "Sin archivo"
        });
        localStorage.setItem("municipios", JSON.stringify(municipios));
        return true;
    }
    function eliminarMunicipio(nombre) {
        let municipios = obtenerMunicipios();
        municipios = municipios.filter(m => m.nombre !== nombre);
        localStorage.setItem("municipios", JSON.stringify(municipios));
    }
    function eliminarTodosMunicipios() {
        localStorage.removeItem("municipios");
    }
    function renderTabla() {
        tbody.innerHTML = "";
        const municipiosGuardados = obtenerMunicipios();
        municipiosGuardados.forEach(m => agregarFila(m));
    }
    //----------------------------------------
    // Eventos botones
    //----------------------------------------
    btnAddMunicipio.addEventListener("click", () => {
        const municipio = inputMunicipio.value.trim();
        const archivo = inputArchivo && inputArchivo.files.length > 0
            ? inputArchivo.files[0].name
            : null;
        if (municipio !== "") {
            if (guardarMunicipio(municipio, archivo)) {
                renderTabla();
                inputMunicipio.value = "";
                if (inputArchivo) inputArchivo.value = "";
            }
        } else {
            alert("Escribe un municipio antes de añadir.");
        }
    });
    btnGuardarTodo.addEventListener("click", () => {
        const municipios = obtenerMunicipios();
        alert("Municipios guardados: " + municipios.map(m => m.nombre).join(", "));
    });
    btnEliminarTodo.addEventListener("click", () => {
        eliminarTodosMunicipios();
        renderTabla();
    });
    //----------------------------------------
    // Inicializar
    //----------------------------------------
    renderTabla();
});