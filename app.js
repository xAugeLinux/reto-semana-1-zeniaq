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
  { nombre: "Ana López", materia: "Matemáticas", disponibilidad: DIAS },
  { nombre: "Laura Gómez", materia: "Español", disponibilidad: DIAS },
  { nombre: "Iván Torres", materia: "Ciencias", disponibilidad: ["Lunes","Miércoles","Viernes"] },

  { nombre: "Carlos Ruiz", materia: "Historia", disponibilidad: ["Lunes","Jueves"] },
  { nombre: "Marta Silva", materia: "Geografía", disponibilidad: ["Martes","Viernes"] },
  { nombre: "Rosa Méndez", materia: "Formación Cívica", disponibilidad: ["Miércoles"] },

  { nombre: "María Pérez", materia: "Física", disponibilidad: ["Martes","Miércoles"] },
  { nombre: "Pedro León", materia: "Química", disponibilidad: ["Lunes","Jueves"] },
  { nombre: "Hugo Ramírez", materia: "Álgebra", disponibilidad: ["Martes","Viernes"] },

  { nombre: "Jorge Sánchez", materia: "Programación", disponibilidad: ["Lunes","Miércoles","Viernes"] },
  { nombre: "Rosa Díaz", materia: "Bases de Datos", disponibilidad: ["Martes","Jueves"] },
  { nombre: "Luis Navarro", materia: "Redes", disponibilidad: ["Miércoles","Viernes"] }
];

const materias = [
  // 1A
  { nombre: "Matemáticas", grupo: "1A", horas: 3 },
  { nombre: "Español", grupo: "1A", horas: 3 },
  { nombre: "Ciencias", grupo: "1A", horas: 2 },

  // 1B
  { nombre: "Historia", grupo: "1B", horas: 2 },
  { nombre: "Geografía", grupo: "1B", horas: 2 },
  { nombre: "Formación Cívica", grupo: "1B", horas: 1 },

  // 2A
  { nombre: "Física", grupo: "2A", horas: 2 },
  { nombre: "Química", grupo: "2A", horas: 2 },
  { nombre: "Álgebra", grupo: "2A", horas: 2 },

  // 2B
  { nombre: "Programación", grupo: "2B", horas: 3 },
  { nombre: "Bases de Datos", grupo: "2B", horas: 2 },
  { nombre: "Redes", grupo: "2B", horas: 2 }
];

let horario = [];
let errores = [];

function mezclar(array) {
  return [...array]
    .map(v => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(x => x.v);
}

function obtenerMateriasPorGrupo(grupo) {
  return materias
    .filter(m => m.grupo === grupo)
    .map(m => ({ ...m, restantes: m.horas }));
}

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

  const grupos = [...new Set(materias.map(m => m.grupo))];

  grupos.forEach(grupo => {
    let materiasGrupo = mezclar(obtenerMateriasPorGrupo(grupo));

    DIAS.forEach(dia => {
      BLOQUES.forEach(bloque => {

        // materias aún disponibles y con docente libre ese día
        const candidatas = materiasGrupo.filter(m => {
          if (m.restantes <= 0) return false;

          const docente = docentes.find(d => d.materia === m.nombre);
          if (!docente) return false;

          if (!docente.disponibilidad.includes(dia)) return false;

          return !hayConflicto(
            dia,
            bloque.inicio,
            docente.nombre,
            grupo,
            m.nombre
          );
        });

        if (candidatas.length === 0) return;

        // Elegimos una materia aleatoria válida
        const materia = candidatas[Math.floor(Math.random() * candidatas.length)];
        const docente = docentes.find(d => d.materia === materia.nombre);

        horario.push({
          dia,
          hora: bloque.inicio,
          grupo,
          materia: materia.nombre,
          docente: docente.nombre
        });

        materia.restantes--;
      });
    });

    // Validación final
    materiasGrupo.forEach(m => {
      if (m.restantes > 0) {
        errores.push(
          `No se pudieron asignar todas las horas de ${m.nombre} (${grupo})`
        );
      }
    });
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
