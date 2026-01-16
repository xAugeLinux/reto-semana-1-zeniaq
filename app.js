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
  { nombre: "Ana Morales", materia: "Matemáticas", disponibilidad: ["Lunes", "Viernes"] },
  { nombre: "Laura Cacahuaticla", materia: "Español", disponibilidad: ["Martes", "Miércoles"] },
  { nombre: "Iván Villa", materia: "Ciencias", disponibilidad: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] },

  { nombre: "César Ruiz", materia: "Historia", disponibilidad: ["Jueves", "Viernes"] },
  { nombre: "Sara Elvira", materia: "Geografía", disponibilidad: ["Lunes", "Martes", "Viernes"] },
  { nombre: "Elena Sosa", materia: "Formación Cívica", disponibilidad: ["Lunes", "Martes", "Miércoles"] },

  { nombre: "Karina Pérez", materia: "Física", disponibilidad: ["Lunes", "Martes", "Jueves"] },
  { nombre: "Pedro Cardenas", materia: "Química", disponibilidad: ["Lunes", "Martes", "Miércoles"] },
  { nombre: "Candida Ramírez", materia: "Álgebra", disponibilidad: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] },

  { nombre: "Lorenzo Sánchez", materia: "Programación", disponibilidad: ["Miércoles", "Jueves", "Viernes"] },
  { nombre: "Rosa Díaz", materia: "Bases de Datos", disponibilidad: ["Lunes", "Martes", "Viernes"] },
  { nombre: "Luis Contla", materia: "Redes", disponibilidad: ["Martes", "Miércoles", "Viernes"] }
];

const materias = [
  // 1A
  { nombre: "Matemáticas", grupo: "1A", horas: 5 },
  { nombre: "Español", grupo: "1A", horas: 4 },
  { nombre: "Ciencias", grupo: "1A", horas: 3 },
  { nombre: "Historia", grupo: "1A", horas: 2 },
  { nombre: "Geografía", grupo: "1A", horas: 2 },
  { nombre: "Formación Cívica", grupo: "1A", horas: 2 },

  // 1B
  { nombre: "Matemáticas", grupo: "1B", horas: 5 },
  { nombre: "Historia", grupo: "1B", horas: 3 },
  { nombre: "Español", grupo: "1B", horas: 4 },
  { nombre: "Ciencias", grupo: "1B", horas: 3 },
  { nombre: "Física", grupo: "1B", horas: 2 },
  { nombre: "Álgebra", grupo: "1B", horas: 2 },

  // 2A
  { nombre: "Química", grupo: "2A", horas: 4 },
  { nombre: "Matemáticas", grupo: "2A", horas: 4 },
  { nombre: "Ciencias", grupo: "2A", horas: 3 },
  { nombre: "Bases de Datos", grupo: "2A", horas: 2 },
  { nombre: "Programación", grupo: "2A", horas: 2 },
  { nombre: "Redes", grupo: "2A", horas: 2 },

  // 2B
  { nombre: "Programación", grupo: "2B", horas: 5 },
  { nombre: "Matemáticas", grupo: "2B", horas: 4 },
  { nombre: "Historia", grupo: "2B", horas: 3 },
  { nombre: "Ciencias", grupo: "2B", horas: 3 },
  { nombre: "Bases de Datos", grupo: "2B", horas: 2 },
  { nombre: "Redes", grupo: "2B", horas: 2 }
];


let horario = [];
let errores = [];

function mezclar(array) {
  return array.sort(() => Math.random() - 0.5);
}

function obtenerMateriasPorGrupo(grupo) {
  return materias
    .filter(m => m.grupo === grupo)
    .map(m => ({ ...m, restantes: m.horas }));
}

function totalHorasGrupo(grupo) {
  return materias
    .filter(m => m.grupo === grupo)
    .reduce((sum, m) => sum + m.horas, 0);
}

function horasPorDia(totalHoras) {
  const base = Math.floor(totalHoras / DIAS.length);
  let extra = totalHoras % DIAS.length;

  return DIAS.map(() => base + (extra-- > 0 ? 1 : 0));
}

function hayConflicto(dia, hora, docente, grupo) {
  return horario.some(h =>
    h.dia === dia &&
    h.hora === hora &&
    (h.docente === docente || h.grupo === grupo)
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
    let materiasGrupo = mezclar(
      materias
        .filter(m => m.grupo === grupo)
        .map(m => ({ ...m, restantes: m.horas }))
    );

    const horasDia = horasPorDia(totalHorasGrupo(grupo));

    DIAS.forEach((dia, indexDia) => {
      let horasHoy = horasDia[indexDia];
      let bloques = mezclar([...BLOQUES]);

      while (horasHoy > 0 && bloques.length > 0) {
        const bloque = bloques.pop();

        const candidatas = materiasGrupo.filter(m => {
          if (m.restantes <= 0) return false;

          const docente = docentes.find(d => d.materia === m.nombre);
          return docente &&
            docente.disponibilidad.includes(dia) &&
            !hayConflicto(dia, bloque.inicio, docente.nombre, grupo);
        });

        if (candidatas.length === 0) break;

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
        horasHoy--;
      }
    });

    materiasGrupo.forEach(m => {
      if (m.restantes > 0) {
        errores.push(`No se asignaron todas las horas de ${m.nombre} (${grupo})`);
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

    const tdHorario = document.createElement("td");
    tdHorario.textContent = `${bloque.inicio} - ${bloque.fin}`;
    tr.appendChild(tdHorario);

    DIAS.forEach(dia => {
      const td = document.createElement("td");

      const clase = horario.find(h =>
        h.grupo === grupoSeleccionado &&
        h.dia === dia &&
        h.hora === bloque.inicio
      );

      if (clase) {
        td.classList.add("clase-asignada");
        td.innerHTML = `
          <div class="materia">${clase.materia}</div>
          <div class="docente">${clase.docente}</div>
        `;
      } else {
        td.classList.add("hueco");
        td.textContent = "— Libre —";
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

function renderizarInfo(grupoSeleccionado) {
  // Grupo
  document.getElementById("grupo").textContent = grupoSeleccionado;

  // Materias del grupo
  const ulMaterias = document.getElementById("materias");
  ulMaterias.innerHTML = "";

  materias
    .filter(m => m.grupo === grupoSeleccionado)
    .forEach(m => {
      const li = document.createElement("li");
      li.textContent = `${m.nombre} (${m.horas} h/semana)`;
      ulMaterias.appendChild(li);
    });

  // Docentes involucrados
  const ulDocentes = document.getElementById("docentes");
  ulDocentes.innerHTML = "";

  const materiasGrupo = materias
    .filter(m => m.grupo === grupoSeleccionado)
    .map(m => m.nombre);

  docentes
    .filter(d => materiasGrupo.includes(d.materia))
    .forEach(d => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${d.nombre}</strong><br>
        <span class="materia-docente">${d.materia}</span><br>
        <span class="disponibilidad">
          Disponible: ${d.disponibilidad.join(", ")}
        </span>
      `;
      ulDocentes.appendChild(li);
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
