//------------------------------------//
//--|funcionalidad_menu_hamburguesa|--//
//------------------------------------//
const toggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
toggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});
//------------------------------------//
//--|funcionalidad_contenedor_mensaje|//
//------------------------------------//
function mostrarMensaje(texto, tipo = "info") {
    const contenedor = document.getElementById("mensajeContenedor");
    if (!contenedor) return;
    const mensaje = document.createElement("div");
    mensaje.classList.add("mensaje", tipo);
    mensaje.textContent = texto;
    contenedor.appendChild(mensaje);
    setTimeout(() => {
        mensaje.style.animation = "fadeOut 0.5s ease forwards";
        mensaje.addEventListener("animationend", () => {
            mensaje.remove();
        });
    }, 5000);
}
//----------------------------------------//
//--|funcionalidad_agregar_el_municipio|--//
//----------------------------------------//
const btnAdd = document.querySelector(".btn-add");
const inputMunicipio = document.getElementById("municipioInput");
btnAdd.addEventListener("click", () => {
    const nombreMunicipio = inputMunicipio.value.trim();
    if (nombreMunicipio === "") {
        mostrarMensaje("⚠️ Por favor, escribe el nombre del municipio.", "error");
        return;
    }
    agregarFila(nombreMunicipio);
    guardarMunicipio(nombreMunicipio);
    mostrarMensaje(`✅ Municipio "${nombreMunicipio}" agregado correctamente.`, "success");
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
    mostrarMensaje("✅ Archivo seleccionado correctamente.", "success"); // 👈 agregado
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
        mostrarMensaje("⚠️ Primero selecciona un archivo.", "error"); // 👈 reemplazo del alert
        return;
    }
    const tbody = document.getElementById("municipioTableBody");
    const ultimaFila = tbody.lastElementChild;
    if (!ultimaFila) {
        mostrarMensaje("⚠️ Primero añade un municipio antes de asignar un archivo.", "error"); // 👈 reemplazo del alert
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
    mostrarMensaje(`✅ Archivo "${archivosSeleccionados[0]}" asignado al municipio "${municipio}".`, "success"); // 👈 agregado
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
    function obtenerPendientes() {
        return JSON.parse(localStorage.getItem("municipiosPendientes")) || [];
    }
    function guardarPendientes(municipios) {
        localStorage.setItem("municipiosPendientes", JSON.stringify(municipios));
    }
    function renderTablaPendientes() {
        tbody.innerHTML = "";
        const municipios = obtenerPendientes();
        municipios.forEach((m, index) => {
            const tr = document.createElement("tr");
            const tdNombre = document.createElement("td");
            tdNombre.textContent = m.nombre;
            const tdArchivo = document.createElement("td");
            tdArchivo.textContent = m.archivo ? m.archivo : "Sin archivo";
            const tdAcciones = document.createElement("td");
            const iconEliminar = document.createElement("i");
            iconEliminar.className = "fa-solid fa-trash";
            iconEliminar.style.cursor = "pointer";
            iconEliminar.style.marginRight = "10px";
            iconEliminar.style.color = "red";
            iconEliminar.title = "Eliminar";
            iconEliminar.addEventListener("click", () => {
                if (confirm(`¿Seguro que deseas eliminar el municipio "${m.nombre}"?`)) {
                    eliminarPendiente(index);
                    mostrarMensaje(`🗑️ Municipio "${m.nombre}" eliminado de pendientes.`, "error");
                }
            });
            const iconQuitarPendiente = document.createElement("i");
            iconQuitarPendiente.className = "fa-solid fa-check-circle";
            iconQuitarPendiente.style.cursor = "pointer";
            iconQuitarPendiente.style.color = "green";
            iconQuitarPendiente.title = "Quitar de pendientes";
            iconQuitarPendiente.addEventListener("click", () => {
                moverATablero(index, m.nombre);
            });
            tdAcciones.appendChild(iconEliminar);
            tdAcciones.appendChild(iconQuitarPendiente);
            tr.appendChild(tdNombre);
            tr.appendChild(tdArchivo);
            tr.appendChild(tdAcciones);
            tbody.appendChild(tr);
        });
    }
    function eliminarPendiente(index) {
        let municipios = obtenerPendientes();
        municipios.splice(index, 1);
        guardarPendientes(municipios);
        renderTablaPendientes();
    }
    function moverATablero(index, nombreMunicipio) {
        let pendientes = obtenerPendientes();
        const municipioQuitado = pendientes.splice(index, 1)[0];
        guardarPendientes(pendientes);
        let principales = JSON.parse(localStorage.getItem("municipios")) || [];
        principales.push(municipioQuitado);
        localStorage.setItem("municipios", JSON.stringify(principales));
        renderTablaPendientes();
        renderTablaTablero();
        mostrarMensaje(`✅ Municipio "${nombreMunicipio}" regresado al tablero principal.`, "success");
    }
    btnQuitarTodo.addEventListener("click", () => {
        let pendientes = obtenerPendientes();
        if (pendientes.length === 0) {
            mostrarMensaje("⚠️ No hay municipios pendientes para regresar.", "error");
            return;
        }
        let tablero = JSON.parse(localStorage.getItem("municipios")) || [];
        tablero = tablero.concat(pendientes);
        localStorage.setItem("municipios", JSON.stringify(tablero));
        localStorage.removeItem("municipiosPendientes");
        renderTablaPendientes();
        renderTablaTablero();
        mostrarMensaje("✅ Todos los municipios pendientes regresaron al tablero principal.", "success");
    });
    renderTablaPendientes();
});
//----------------------------------------//
//--|funcionalidad_tablero_de_municipio|--//
//----------------------------------------//
document.addEventListener("DOMContentLoaded", () => {
    const inputMunicipio = document.querySelector(".municipio-card input[type='text']");
    const inputArchivo = document.querySelector(".municipio-card input[type='file']");
    const btnAddMunicipio = document.querySelector(".municipio-card .btn-add");
    const tbody = document.querySelector(".tablero table tbody");
    const btnPendienteTodo = document.querySelector(".tablero .btns button:nth-child(1)");
    const btnEliminarTodo = document.querySelector(".tablero .btns button:nth-child(2)");
    const btnGuardarTodo = document.querySelector(".tablero .btns button:nth-child(3)");
    function guardarPendiente(municipioObj) {
        let pendientes = JSON.parse(localStorage.getItem("municipiosPendientes")) || [];
        if (pendientes.length >= 10) {
            mostrarMensaje("⚠️ Solo se permiten máximo 10 municipios en la lista de pendientes.", "error");
            return false;
        }
        if (!pendientes.some(m => m.nombre === municipioObj.nombre)) {
            pendientes.push(municipioObj);
            localStorage.setItem("municipiosPendientes", JSON.stringify(pendientes));
            return true;
        }
        return false;
    }
    function agregarFila(municipioObj) {
        const tr = document.createElement("tr");
        const tdMunicipio = document.createElement("td");
        tdMunicipio.textContent = municipioObj.nombre;
        const tdArchivo = document.createElement("td");
        tdArchivo.textContent = municipioObj.archivo ? municipioObj.archivo : "Sin archivo";
        const tdAcciones = document.createElement("td");
        const iconPendiente = document.createElement("i");
        iconPendiente.className = "fa-solid fa-clock";
        iconPendiente.style.cursor = "pointer";
        iconPendiente.style.marginRight = "10px";
        iconPendiente.style.color = "#f0ad4e";
        iconPendiente.title = "Marcar pendiente";
        iconPendiente.addEventListener("click", () => {
            const pendientes = JSON.parse(localStorage.getItem("municipiosPendientes")) || [];
            if (pendientes.length >= 10) {
                mostrarMensaje("⚠️ No se pudo marcar como pendiente: límite de 10 alcanzado.", "error");
                return;
            }
            if (pendientes.some(m => m.nombre === municipioObj.nombre)) {
                mostrarMensaje(`⚠️ El municipio "${municipioObj.nombre}" ya está en pendientes.`, "error");
                return;
            }
            if (guardarPendiente(municipioObj)) {
                eliminarMunicipio(municipioObj.nombre);
                renderTablaTablero();
                if (typeof renderTablaPendientes === "function") {
                    renderTablaPendientes();
                }
                mostrarMensaje(`⏳ Municipio "${municipioObj.nombre}" marcado como pendiente.`, "info");
            }
        });
        const iconEliminar = document.createElement("i");
        iconEliminar.className = "fa-solid fa-trash";
        iconEliminar.style.cursor = "pointer";
        iconEliminar.style.marginRight = "10px";
        iconEliminar.style.color = "red";
        iconEliminar.title = "Eliminar";
        iconEliminar.addEventListener("click", () => {
            if (confirm(`¿Seguro que deseas eliminar el municipio "${municipioObj.nombre}"?`)) {
                eliminarMunicipio(municipioObj.nombre);
                renderTablaTablero();
                mostrarMensaje(`🗑️ El municipio "${municipioObj.nombre}" ha sido eliminado exitosamente.`, "error");
            }
        });
        const iconEnviar = document.createElement("i");
        iconEnviar.className = "fa-solid fa-paper-plane";
        iconEnviar.style.cursor = "pointer";
        iconEnviar.style.color = "blue";
        iconEnviar.title = "Enviar dato";
        iconEnviar.addEventListener("click", () => {
            mostrarMensaje(`📤 El municipio "${municipioObj.nombre}" ha sido enviado correctamente.`, "success");
        });
        tdAcciones.appendChild(iconPendiente);
        tdAcciones.appendChild(iconEliminar);
        tdAcciones.appendChild(iconEnviar);
        tr.appendChild(tdMunicipio);
        tr.appendChild(tdArchivo);
        tr.appendChild(tdAcciones);
        tbody.appendChild(tr);
    }
    function obtenerMunicipios() {
        return JSON.parse(localStorage.getItem("municipios")) || [];
    }
    function guardarMunicipio(nombre, archivo = null) {
        let municipios = obtenerMunicipios();
        if (municipios.some(m => m.nombre === nombre)) {
            mostrarMensaje(`⚠️ El municipio "${nombre}" ya está en la lista.`, "error");
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
    window.renderTablaTablero = function () {
        tbody.innerHTML = "";
        const municipiosGuardados = obtenerMunicipios();
        municipiosGuardados.forEach(m => agregarFila(m));
    };
    btnPendienteTodo.addEventListener("click", () => {
        let tablero = obtenerMunicipios();
        if (tablero.length === 0) {
            mostrarMensaje("⚠️ No hay municipios en el tablero para marcar como pendientes.", "error");
            return;
        }
        let pendientes = JSON.parse(localStorage.getItem("municipiosPendientes")) || [];
        if (pendientes.length + tablero.length > 10) {
            mostrarMensaje("⚠️ No puedes mover todos. Superarías el límite de 10 pendientes.", "error");
            return;
        }
        pendientes = pendientes.concat(tablero);
        localStorage.setItem("municipiosPendientes", JSON.stringify(pendientes));
        eliminarTodosMunicipios();
        renderTablaTablero();
        if (typeof renderTablaPendientes === "function") renderTablaPendientes();
        mostrarMensaje("⏳ Todos los municipios del tablero fueron añadidos a pendientes.", "info");
    });
    btnAddMunicipio.addEventListener("click", () => {
        const municipio = inputMunicipio.value.trim();
        const archivo = inputArchivo && inputArchivo.files.length > 0
            ? inputArchivo.files[0].name
            : null;
        let municipios = obtenerMunicipios();
        if (municipios.length >= 17) {
            mostrarMensaje("⚠️ Solo se permiten máximo 17 municipios en el tablero.", "error");
            return;
        }
        if (municipio !== "") {
            if (guardarMunicipio(municipio, archivo)) {
                renderTablaTablero();
                inputMunicipio.value = "";
                if (inputArchivo) inputArchivo.value = "";
                mostrarMensaje(`✅ Municipio "${municipio}" añadido al tablero.`, "success");
            }
        } else {
            mostrarMensaje("⚠️ Escribe un municipio antes de añadir.", "error");
        }
    });
    btnGuardarTodo.addEventListener("click", () => {
        const municipios = obtenerMunicipios();
        if (municipios.length === 0) {
            mostrarMensaje("⚠️ No hay municipios para guardar.", "error");
            return;
        }
        mostrarMensaje("✅ Municipios guardados con éxito.", "success");
    });
    btnEliminarTodo.addEventListener("click", () => {
        if (confirm("¿Seguro que deseas eliminar todos los municipios del tablero?")) {
            eliminarTodosMunicipios();
            renderTablaTablero();
            mostrarMensaje("🗑️ Se eliminaron todos los municipios del tablero.", "error");
        }
    });
    renderTablaTablero();
});