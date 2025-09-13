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
                }
            });

            const iconQuitarPendiente = document.createElement("i");
            iconQuitarPendiente.className = "fa-solid fa-check-circle";
            iconQuitarPendiente.style.cursor = "pointer";
            iconQuitarPendiente.style.color = "green";
            iconQuitarPendiente.title = "Quitar de pendientes";
            iconQuitarPendiente.addEventListener("click", () => {
                moverATablero(index);
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

    function moverATablero(index) {
        let pendientes = obtenerPendientes();
        const municipioQuitado = pendientes.splice(index, 1)[0];
        guardarPendientes(pendientes);

        let principales = JSON.parse(localStorage.getItem("municipios")) || [];
        principales.push(municipioQuitado);
        localStorage.setItem("municipios", JSON.stringify(principales));

        renderTablaPendientes();
        renderTablaTablero();
    }

    btnQuitarTodo.addEventListener("click", () => {
        let pendientes = obtenerPendientes();
        if (pendientes.length === 0) {
            alert("No hay municipios pendientes para regresar.");
            return;
        }
        let tablero = JSON.parse(localStorage.getItem("municipios")) || [];
        tablero = tablero.concat(pendientes);
        localStorage.setItem("municipios", JSON.stringify(tablero));
        localStorage.removeItem("municipiosPendientes");
        renderTablaPendientes();
        renderTablaTablero();
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

    //----------------------------------------
    // Guardar en pendientes con límite (máx. 10)
    //----------------------------------------
    function guardarPendiente(municipioObj) {
        let pendientes = JSON.parse(localStorage.getItem("municipiosPendientes")) || [];

        // ✅ Condición: máximo 10 registros
        if (pendientes.length >= 10) {
            alert("⚠️ Solo se permiten máximo 10 municipios en la lista de pendientes.");
            return false;
        }

        if (!pendientes.some(m => m.nombre === municipioObj.nombre)) {
            pendientes.push(municipioObj);
            localStorage.setItem("municipiosPendientes", JSON.stringify(pendientes));
            return true;
        }
        return false;
    }

    //----------------------------------------
    // Agregar fila al tablero principal
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
            if (guardarPendiente(municipioObj)) {
                eliminarMunicipio(municipioObj.nombre);
                renderTablaTablero();
                renderTablaPendientes();
            }
        });

        // Icono eliminar con confirmación y mensaje
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
                alert(`🗑️ El municipio "${municipioObj.nombre}" ha sido eliminado.`);
            }
        });

        // Icono enviar con mensaje
        const iconEnviar = document.createElement("i");
        iconEnviar.className = "fa-solid fa-paper-plane";
        iconEnviar.style.cursor = "pointer";
        iconEnviar.style.color = "blue";
        iconEnviar.title = "Enviar dato";
        iconEnviar.addEventListener("click", () => {
            // ✅ Mensaje cuando se envía el dato
            alert(`📤 El municipio "${municipioObj.nombre}" ha sido enviado correctamente.`);
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

    //----------------------------------------
    // Render tablero
    //----------------------------------------
    window.renderTablaTablero = function () {
        tbody.innerHTML = "";
        const municipiosGuardados = obtenerMunicipios();
        municipiosGuardados.forEach(m => agregarFila(m));
    };

    //----------------------------------------
    // Botón pendiente todo → mover todos a pendientes
    //----------------------------------------
    btnPendienteTodo.addEventListener("click", () => {
        let tablero = obtenerMunicipios();
        if (tablero.length === 0) {
            alert("No hay municipios en el tablero para marcar como pendientes.");
            return;
        }

        let pendientes = JSON.parse(localStorage.getItem("municipiosPendientes")) || [];

        // ✅ Validar límite al mover todos
        if (pendientes.length + tablero.length > 10) {
            alert("⚠️ No puedes mover todos. Superarías el límite de 10 pendientes.");
            return;
        }

        pendientes = pendientes.concat(tablero);
        localStorage.setItem("municipiosPendientes", JSON.stringify(pendientes));

        eliminarTodosMunicipios();

        renderTablaTablero();
        renderTablaPendientes();
    });

    //----------------------------------------
    // Botón añadir municipio con límite (máx. 17)
    //----------------------------------------
    btnAddMunicipio.addEventListener("click", () => {
        const municipio = inputMunicipio.value.trim();
        const archivo = inputArchivo && inputArchivo.files.length > 0
            ? inputArchivo.files[0].name
            : null;

        let municipios = obtenerMunicipios();

        if (municipios.length >= 17) {
            alert("⚠️ Solo se permiten máximo 17 municipios en el tablero.");
            return;
        }

        if (municipio !== "") {
            if (guardarMunicipio(municipio, archivo)) {
                renderTablaTablero();
                inputMunicipio.value = "";
                if (inputArchivo) inputArchivo.value = "";
            }
        } else {
            alert("Escribe un municipio antes de añadir.");
        }
    });

    //----------------------------------------
    // Botón Guardar Todo
    //----------------------------------------
    btnGuardarTodo.addEventListener("click", () => {
        const municipios = obtenerMunicipios();
        if (municipios.length === 0) {
            alert("No hay municipios para guardar.");
            return;
        }
        alert("✅ Municipios guardados con éxito.");
    });

    //----------------------------------------
    // Botón Eliminar Todo
    //----------------------------------------
    btnEliminarTodo.addEventListener("click", () => {
        if (confirm("¿Seguro que deseas eliminar todos los municipios del tablero?")) {
            eliminarTodosMunicipios();
            renderTablaTablero();
        }
    });

    //----------------------------------------
    // Inicializar tablero principal
    //----------------------------------------
    renderTablaTablero();
});