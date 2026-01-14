# reto-semana-1-zeniaq
Reto propuesto para completar esta semana.

# Intrucciones 

 ## Aplicación web (frontend-only) – Asignación básica de horarios
 
 **Tecnologías:** HTML, CSS, JavaScript Vanilla, Git  
 
 ---
 
 ## Objetivo
 
 Desarrollar una **aplicación web del lado del cliente** que asigne horarios académicos
 respetando reglas básicas de disponibilidad y sin generar conflictos.
 
 ---
 
 ## Alcance
 
 ### Incluye
 - Modelado de docentes, materias, grupos y horarios
 - Asignación automática básica
 - Detección de conflictos
 - Visualización simple del horario
 
 ### No incluye
 - Backend
 - Base de datos
 - Frameworks o librerías
 - Optimización avanzada
 
 ---
 
 ## Reglas obligatorias
 
 1. Un docente no puede tener dos clases al mismo tiempo  
 2. Un grupo no puede tener dos materias en la misma franja  
 3. Un docente solo puede impartir materias que domina  
 4. Las clases solo pueden asignarse dentro de la disponibilidad del docente  
 
 Si no es posible asignar una clase, debe indicarse claramente.
 
 ---
 
 ## Modelo de datos mínimo
 
 Definir estructuras para:
 - Docentes  
 - Materias  
 - Grupos  
 - Horarios  
 
 La forma de modelar es parte de la evaluación.
 
 ---
 
 ## Interfaz mínima
 
 - Botón: **Generar horario**
 - Tabla o grid que muestre:
   - Días
   - Horas
   - Materia
   - Docente
 
 El diseño visual no es prioritario.
 
 ---
 
 ## Restricciones técnicas
 
 - Solo HTML, CSS y JavaScript Vanilla
 - No Frameworks
 - No Librerías externas
 - No `eval`
 - Código claro y organizado
 
 ---
 
 ## Uso de Git
 
 - Repositorio con historial de commits
 - Commits pequeños y descriptivos
 
 Formato sugerido:
 ```text
 feat: descripción breve
