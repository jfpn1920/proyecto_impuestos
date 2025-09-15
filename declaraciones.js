//------------------------------------//
//--|funcionalidad_menu_hamburguesa|--//
//------------------------------------//
const toggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
toggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});
//------------------------------//
//--|funcionalidad_asignacion|--//
//------------------------------//
document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.querySelector(".municipios-table tbody");
    const btnAgregar = document.querySelector(".btn-seleccionar");
    const btnEliminar = document.querySelector(".btn-eliminar");
    // 1️⃣ Agregar un ejemplo de fila
    btnAgregar.addEventListener("click", () => {
        const nombre = prompt("Ingrese el nombre:");
        const archivo = prompt("Ingrese el archivo:");
        if (nombre && archivo) {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${nombre}</td>
                <td>${archivo}</td>
            `;
            // Permitir seleccionar la fila con clic
            fila.addEventListener("click", () => {
                fila.classList.toggle("selected");
            });
            tabla.appendChild(fila);
        }
    });
    // 2️⃣ Eliminar filas seleccionadas
    btnEliminar.addEventListener("click", () => {
        const seleccionadas = tabla.querySelectorAll(".selected");
        seleccionadas.forEach(fila => fila.remove());
    });
});