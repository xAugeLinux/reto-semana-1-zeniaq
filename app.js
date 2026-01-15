const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const HORAS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];

const BLOQUES = [
  { inicio: "08:00", fin: "09:00" },
  { inicio: "09:00", fin: "10:00" },
  { inicio: "10:00", fin: "11:00" },
  { inicio: "11:00", fin: "12:00" },
  { inicio: "12:00", fin: "13:00" },
  { inicio: "13:00", fin: "14:00" }
];

const docentes = [
  { nombre: "Ana López", materia: "Matemáticas", disponibilidad: ["Lunes", "Martes", "Miércoles"] },
  { nombre: "Carlos Ruiz", materia: "Historia", disponibilidad: ["Lunes", "Jueves"] },
  { nombre: "María Pérez", materia: "Física", disponibilidad: ["Martes", "Miércoles", "Viernes"] },
  { nombre: "Jorge Sánchez", materia: "Programación", disponibilidad: ["Lunes", "Miércoles", "Viernes"] }
];

const materias = [
  { nombre: "Matemáticas", grupo: "1A", horas: 3 },
  { nombre: "Historia", grupo: "1B", horas: 2 },
  { nombre: "Física", grupo: "2A", horas: 2 },
  { nombre: "Programación", grupo: "2B", horas: 3 }
];

let horario = [];
let errores = [];

function hayConflicto(dia, hora, docente, grupo, materia) {
  return horario.some(h =>
    h.dia === dia &&
    h.hora === hora && (
      h.docente === docente ||     // docente ocupado
      h.grupo === grupo ||         // grupo ocupado
      h.materia === materia        // materia ya usada globalmente
    )
  );
}

function obtenerGrupos() {
  return [...new Set(materias.map(m => m.grupo))];
}

function cargarSelectorGrupos() {
  const select = document.getElementById("selector-grupo");
  select.innerHTML = "";

  obtenerGrupos().forEach(grupo => {
    const option = document.createElement("option");
    option.value = grupo;
    option.textContent = grupo;
    select.appendChild(option);
  });
}

function generarHorario() {
  horario = [];
  errores = [];

  materias.forEach(materia => {
    const docente = docentes.find(d => d.materia === materia.nombre);
    let horasAsignadas = 0;

    if (!docente) {
      errores.push(`No hay docente para ${materia.nombre}`);
      return;
    }

    for (const dia of DIAS) {
      if (!docente.disponibilidad.includes(dia)) continue;

      const yaTieneClaseEseDia = horario.some(h =>
        h.grupo === materia.grupo &&
        h.materia === materia.nombre &&
        h.dia === dia
      );

      if (yaTieneClaseEseDia) continue;

      for (const hora of HORAS) {
        if (horasAsignadas >= materia.horas) break;

        if (!hayConflicto(dia, hora, docente.nombre, materia.grupo, materia.nombre)) {
          horario.push({
            dia,
            hora,
            grupo: materia.grupo,
            materia: materia.nombre,
            docente: docente.nombre
          });
          horasAsignadas++;
          break;
        }
      }
    }

    if (horasAsignadas < materia.horas) {
      errores.push(
        `No se pudo completar ${materia.nombre} para el grupo ${materia.grupo}`
      );
    }
  });
}

function renderizarErrores() {
  const ul = document.getElementById("errores");
  ul.innerHTML = "";

  errores.forEach(e => {
    const li = document.createElement("li");
    li.textContent = e;
    ul.appendChild(li);
  });
}

function renderizarGrid(grupoSeleccionado) {
  const tbody = document.querySelector("#grid-horario tbody");
  const titulo = document.getElementById("titulo-grupo");

  tbody.innerHTML = "";
  titulo.textContent = `Horario del grupo ${grupoSeleccionado}`;

  BLOQUES.forEach(bloque => {
    const tr = document.createElement("tr");

    // Columna de horario
    const tdHorario = document.createElement("td");
    tdHorario.textContent = `${bloque.inicio} - ${bloque.fin}`;
    tr.appendChild(tdHorario);

    // Columnas de días
    DIAS.forEach(dia => {
      const td = document.createElement("td");

      const clase = horario.find(h =>
        h.grupo === grupoSeleccionado &&
        h.dia === dia &&
        h.hora >= bloque.inicio &&
        h.hora < bloque.fin
      );

      if (clase) {
        td.innerHTML = `
          <div class="clase">${clase.materia}</div>
          <div class="docente">${clase.docente}</div>
        `;
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

document.getElementById("selector-grupo").addEventListener("change", e => {
  renderizarGrid(e.target.value);
});

document.getElementById("generar").addEventListener("click", () => {
  generarHorario();
  cargarSelectorGrupos();
  renderizarGrid(obtenerGrupos()[0]);
  renderizarErrores();
});
