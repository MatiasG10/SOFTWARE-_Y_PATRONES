

/*Respuesta:

Propuesta 1. 
Una fábrica para crear objetos Turno. «Así centralizamos la creación.» Un turno tiene 
paciente, profesional, fecha y hora, y una sola implementación.

    Veredicto: Se rechaza (No corresponde ningún patrón). 

    Justificación: Existe una sola clase concreta de Turno y solo requiere 4 datos básicos. 
    Crear una fábrica no aporta ninguna flexibilidad, solo agrega una clase innecesaria
    y complica la lectura del código.   

    podriamos aplicar 

const turno = new Turno(paciente, profesional, fecha, hora);


Propuesta 2.
 Una fábrica abstracta para los recordatorios: cada canal —correo, mensajería, llamada
 automática— trae un redactor de mensaje y un emisor, y el redactor de un canal no sirve para el 
 emisor de otro.

Veredicto: Se acepta (Corresponde Abstract Factory).

Justificación: Cada canal (correo, mensajería, llamada) maneja un par de objetos (redactor y emisor)
 que deben pertenecer a la misma variante. Mezclarlos rompe el sistema. El patrón Abstract Factory 
 agrupa la creación de ambas piezas por canal, volviendo imposible combinar componentes incompatibles
desde la estructura de clases.


Propuesta 3. 
Un Singleton para el calendario de feriados, «porque es uno solo y lo necesita medio 
sistema».

Veredicto: Se rechaza la propuesta Singleton (Corresponde una única instancia inyectada).   

Justificación: Que exista una sola instancia de feriados es una decisión correcta, pero implementarla
 con el Singleton clásico agrega un acceso global estático (CalendarioFeriados.obtener()). 
 Ese acceso global oculta las dependencias y vuelve muy difícil realizar pruebas unitarias con
  escenarios de fechas controladas.  

Propuesta 4. 

Un Builder para crear objetos Paciente, que tiene nombre, documento, fecha de nacimiento
y obra social, los cuatro obligatorios.

Veredicto: Se rechaza (No corresponde ningún patrón).   

Justificación: El objeto Paciente requiere solo 4 campos y los 4 son obligatorios. 
El patrón Builder requiere como condición de uso la presencia de múltiples parámetros opcionales y
 validaciones complejas que crucen varios campos al finalizar la construcción.
 
 
Una de las cuatro propuestas es un caso de manual del antipatrón del martillo de oro. ¿Cuál, y por qué justamente ésa? 

La propuesta que representa un caso de manual del antipatrón del "Martillo de Oro" es la Propuesta 1 
(Fábrica para Turno). 

Ocurre porque intenta aplicar un patrón (Factory) por el solo hecho de haberlo aprendido, 
en un contexto donde no existe ninguna variabilidad ni complejidad en la creación: hay una sola clase
concreta de Turno y sus parámetros son fijos y obligatorios. Aplicar un patrón cuando un new directo
resuelve el problema de forma limpia es la definición exacta de este antipatrón.


*/