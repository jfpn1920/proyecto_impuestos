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
    // 👇 Al cargar la página, pedimos también los municipios desde la BD
    fetchMunicipiosFromServer();
});
btnSeleccionar.addEventListener("click", () => {
    inputArchivo.click();
});
inputArchivo.addEventListener("change", () => {
    archivosSeleccionados = Array.from(inputArchivo.files).map(f => f.name);
    localStorage.setItem("archivos", JSON.stringify(archivosSeleccionados)); 
    mostrarArchivos();
    mostrarMensaje("✅ Archivo seleccionado correctamente.", "success"); 
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
        mostrarMensaje("⚠️ Primero selecciona un archivo.", "error"); 
        return;
    }
    const tbody = document.getElementById("municipioTableBody");
    const ultimaFila = tbody.lastElementChild;
    if (!ultimaFila) {
        mostrarMensaje("⚠️ Primero añade un municipio antes de asignar un archivo.", "error"); 
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
    mostrarMensaje(`✅ Archivo "${archivosSeleccionados[0]}" asignado al municipio "${municipio}".`, "success"); 
    // --- 👇 Envío al servidor ---
    const archivoReal = inputArchivo.files[0]; // el archivo como File
    const formData = new FormData();
    formData.append("nombre_municipio", municipio);
    formData.append("archivo_excel", archivoReal);
    fetch("datos_municipio.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(respuesta => {
        console.log("Respuesta del servidor:", respuesta);
        mostrarMensaje("✅ Municipio y archivo enviados al servidor.", "success");
        // 👇 Refrescar tabla con datos desde la BD
        fetchMunicipiosFromServer();
    })
    .catch(err => {
        console.error("Error:", err);
        mostrarMensaje("❌ Error al enviar los datos al servidor.", "error");
    });
    archivosSeleccionados = [];
    localStorage.setItem("archivos", JSON.stringify([]));
    areaArchivos.innerHTML = "";
});
//---------------------------------------------//
//--|NUEVO: traer y mostrar datos desde la BD|--//
//---------------------------------------------//
function renderMunicipiosFromServer(municipios) {
    const tbody = document.getElementById("municipioTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    municipios.forEach(m => {
        const tr = document.createElement("tr");
        // Municipio
        const tdMunicipio = document.createElement("td");
        tdMunicipio.textContent = m.nombre_municipio || "Sin nombre";
        tr.appendChild(tdMunicipio);
        // Archivo (mostrar y mantener)
        const tdArchivo = document.createElement("td");
        if (m.archivo_excel && m.archivo_excel.trim() !== "") {
            const a = document.createElement("a");
            a.href = 'uploads/' + m.archivo_excel;
            a.target = "_blank";
            a.textContent = m.archivo_excel;
            tdArchivo.appendChild(a);
        } else {
            tdArchivo.textContent = "Sin archivo";
        }
        tr.appendChild(tdArchivo);
        // Acciones con 3 iconos
        const tdAcciones = document.createElement("td");
        // Icono pendiente (amarillo)
        const iconoPendiente = document.createElement("i");
        iconoPendiente.className = "fa-solid fa-clock";
        iconoPendiente.style.color = "goldenrod";
        iconoPendiente.style.cursor = "pointer";
        iconoPendiente.style.marginRight = "10px";
        iconoPendiente.title = "Pendiente";
        iconoPendiente.addEventListener("click", () => {
            mostrarMensaje(`Pendiente para "${m.nombre_municipio}".`, "info");
        });
        // Icono eliminar (rojo)
        const iconoEliminar = document.createElement("i");
        iconoEliminar.className = "fa-solid fa-trash";
        iconoEliminar.style.color = "red";
        iconoEliminar.style.cursor = "pointer";
        iconoEliminar.style.marginRight = "10px";
        iconoEliminar.title = "Eliminar";
        iconoEliminar.addEventListener("click", () => {
            mostrarMensaje(`Eliminar "${m.nombre_municipio}".`, "info");
        });
        // Icono enviar (azul)
        const iconoEnviar = document.createElement("i");
        iconoEnviar.className = "fa-solid fa-paper-plane";
        iconoEnviar.style.color = "blue";
        iconoEnviar.style.cursor = "pointer";
        iconoEnviar.title = "Enviar";
        iconoEnviar.addEventListener("click", () => {
            mostrarMensaje(`Enviar "${m.nombre_municipio}".`, "info");
        });
        // Agregar los iconos a la celda
        tdAcciones.appendChild(iconoPendiente);
        tdAcciones.appendChild(iconoEliminar);
        tdAcciones.appendChild(iconoEnviar);
        tr.appendChild(tdAcciones);
        tbody.appendChild(tr);
    });
}
function fetchMunicipiosFromServer() {
    fetch('obtener_municipios.php')
    .then(res => {
        if (!res.ok) throw new Error('Error en la petición: ' + res.status);
        return res.json();
    })
    .then(data => {
        renderMunicipiosFromServer(data);
    })
    .catch(err => {
        console.error('Error cargando municipios desde servidor:', err);
    });
}
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

            // Icono eliminar
            const iconEliminar = document.createElement("i");
            iconEliminar.className = "fa-solid fa-trash";
            iconEliminar.style.cursor = "pointer";
            iconEliminar.style.marginRight = "10px";
            iconEliminar.style.color = "red";
            iconEliminar.title = "Eliminar";
            iconEliminar.addEventListener("click", () => {
                if (confirm(`¿Seguro que deseas eliminar el municipio "${m.nombre}"?`)) {
                    let pendientes = obtenerPendientes();
                    pendientes.splice(index, 1);
                    guardarPendientes(pendientes);
                    renderTablaPendientes();
                    mostrarMensaje(`🗑️ Municipio "${m.nombre}" eliminado de pendientes.`, "error");
                }
            });

            // Icono quitar de pendientes
            const iconQuitar = document.createElement("i");
            iconQuitar.className = "fa-solid fa-check-circle";
            iconQuitar.style.cursor = "pointer";
            iconQuitar.style.color = "green";
            iconQuitar.title = "Quitar de pendientes";
            iconQuitar.addEventListener("click", () => {
                let pendientes = obtenerPendientes();
                const municipio = pendientes.splice(index, 1)[0];
                guardarPendientes(pendientes);

                let principales = JSON.parse(localStorage.getItem("municipios")) || [];
                principales.push(municipio);
                localStorage.setItem("municipios", JSON.stringify(principales));

                renderTablaPendientes();
                renderTablaTablero();
                mostrarMensaje(`✅ Municipio "${m.nombre}" regresado al tablero principal.`, "success");
            });

            tdAcciones.appendChild(iconEliminar);
            tdAcciones.appendChild(iconQuitar);

            tr.appendChild(tdNombre);
            tr.appendChild(tdArchivo);
            tr.appendChild(tdAcciones);
            tbody.appendChild(tr);
        });
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

    function obtenerMunicipios() {
        return JSON.parse(localStorage.getItem("municipios")) || [];
    }

    function guardarMunicipio(nombre, archivo = null) {
        let municipios = obtenerMunicipios();
        if (municipios.some(m => m.nombre === nombre)) {
            mostrarMensaje(`⚠️ El municipio "${nombre}" ya está en la lista.`, "error");
            return false;
        }
        municipios.push({ nombre, archivo: archivo ? archivo : "Sin archivo" });
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
        tr.appendChild(tdMunicipio);

        const tdArchivo = document.createElement("td");
        tdArchivo.textContent = municipioObj.archivo ? municipioObj.archivo : "Sin archivo";
        tr.appendChild(tdArchivo);

        const tdAcciones = document.createElement("td");

        // Icono Pendiente
        const iconPendiente = document.createElement("i");
        iconPendiente.className = "fa-solid fa-clock";
        iconPendiente.style.color = "goldenrod";
        iconPendiente.style.cursor = "pointer";
        iconPendiente.style.marginRight = "10px";
        iconPendiente.title = "Pendiente";
        iconPendiente.addEventListener("click", () => {
            if (guardarPendiente(municipioObj)) {
                eliminarMunicipio(municipioObj.nombre);
                renderTablaTablero();
                renderTablaPendientes();
                mostrarMensaje(`⏳ Municipio "${municipioObj.nombre}" marcado como pendiente.`, "info");
            }
        });

        // Icono Eliminar
        const iconEliminar = document.createElement("i");
        iconEliminar.className = "fa-solid fa-trash";
        iconEliminar.style.color = "red";
        iconEliminar.style.cursor = "pointer";
        iconEliminar.style.marginRight = "10px";
        iconEliminar.title = "Eliminar";
        iconEliminar.addEventListener("click", () => {
            if (confirm(`¿Seguro que deseas eliminar el municipio "${municipioObj.nombre}"?`)) {
                eliminarMunicipio(municipioObj.nombre);
                renderTablaTablero();
                mostrarMensaje(`🗑️ Municipio "${municipioObj.nombre}" eliminado.`, "error");
            }
        });

        // Icono Enviar
        const iconEnviar = document.createElement("i");
        iconEnviar.className = "fa-solid fa-paper-plane";
        iconEnviar.style.color = "blue";
        iconEnviar.style.cursor = "pointer";
        iconEnviar.title = "Enviar";
        iconEnviar.addEventListener("click", () => {
            mostrarMensaje(`📤 Municipio "${municipioObj.nombre}" enviado correctamente.`, "success");
        });

        tdAcciones.appendChild(iconPendiente);
        tdAcciones.appendChild(iconEliminar);
        tdAcciones.appendChild(iconEnviar);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);
    }

    window.renderTablaTablero = function() {
        tbody.innerHTML = "";
        obtenerMunicipios().forEach(agregarFila);
    }

    // --- BOTONES ---
    btnAddMunicipio.addEventListener("click", () => {
        const nombre = inputMunicipio.value.trim();
        const archivo = inputArchivo && inputArchivo.files.length > 0 ? inputArchivo.files[0].name : null;
        if (nombre === "") {
            mostrarMensaje("⚠️ Escribe un municipio antes de añadir.", "error");
            return;
        }
        if (guardarMunicipio(nombre, archivo)) {
            renderTablaTablero();
            inputMunicipio.value = "";
            if (inputArchivo) inputArchivo.value = "";
            mostrarMensaje(`✅ Municipio "${nombre}" añadido al tablero.`, "success");
        }
    });

    btnPendienteTodo.addEventListener("click", () => {
        const tablero = obtenerMunicipios();
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
        renderTablaPendientes();
        mostrarMensaje("⏳ Todos los municipios del tablero fueron añadidos a pendientes.", "info");
    });

    btnGuardarTodo.addEventListener("click", () => {
        if (obtenerMunicipios().length === 0) {
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
