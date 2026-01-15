const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const HOURS = ["08:00", "10:00", "12:00", "14:00"];

const teachers = [
  {
    id: 1,
    name: "Ana López",
    subjects: ["Matemáticas", "Física"],
    availability: {
      Lunes: ["08:00", "10:00"],
      Miércoles: ["10:00", "12:00"],
      Viernes: ["08:00"]
    }
  },
  {
    id: 2,
    name: "Carlos Pérez",
    subjects: ["Historia"],
    availability: {
      Martes: ["08:00", "10:00"],
      Jueves: ["12:00", "14:00"]
    }
  }
];

const subjects = [
  { name: "Matemáticas" },
  { name: "Física" },
  { name: "Historia" }
];

const groups = [
  {
    id: 1,
    name: "Grupo A",
    subjects: ["Matemáticas", "Historia"]
  },
  {
    id: 2,
    name: "Grupo B",
    subjects: ["Física"]
  }
];


let schedule = [];

function hasConflict(day, hour, teacherName, groupName) {
  return schedule.some(entry =>
    entry.day === day &&
    entry.hour === hour &&
    (entry.teacher === teacherName || entry.group === groupName)
  );
}

function findAvailableTeacher(subject, day, hour) {
  return teachers.find(teacher =>
    teacher.subjects.includes(subject) &&
    teacher.availability[day]?.includes(hour)
  );
}

function generateSchedule() {
  // Reinicia el horario
  schedule = [];

  groups.forEach(group => {
    group.subjects.forEach(subject => {
      let assigned = false;

      // Intenta asignar la materia en cualquier franja válida
      for (const day of DAYS) {
        for (const hour of HOURS) {

          const teacher = findAvailableTeacher(subject, day, hour);

          if (
            teacher &&
            !hasConflict(day, hour, teacher.name, group.name)
          ) {
            schedule.push({
              day,
              hour,
              group: group.name,
              subject,
              teacher: teacher.name
            });

            assigned = true;
            break;
          }
        }
        if (assigned) break;
      }

      // Si no se pudo asignar, se registra como no disponible
      if (!assigned) {
        schedule.push({
          day: "-",
          hour: "-",
          group: group.name,
          subject,
          teacher: "No disponible"
        });
      }
    });
  });

  renderSchedule();
}

function renderSchedule() {
  const tbody = document.querySelector("#scheduleTable tbody");
  tbody.innerHTML = "";

  schedule.forEach(entry => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${entry.day}</td>
      <td>${entry.hour}</td>
      <td>${entry.group}</td>
      <td>${entry.subject}</td>
      <td>${entry.teacher}</td>
    `;

    tbody.appendChild(row);
  });
}

document
  .getElementById("generateBtn")
  .addEventListener("click", generateSchedule);
