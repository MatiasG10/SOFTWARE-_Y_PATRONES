class Notificacion {
  constructor(public mensaje: string, public usuario: string) {}
}

// 1. EL REGISTRO REFACCIONADO (Sin static, sin private constructor, sin limpiar)
class RegistroDeNotificaciones {
  private readonly pendientes: Notificacion[] = [];

  // Constructor público normal
  constructor() {}

  agregar(n: Notificacion): void { 
    this.pendientes.push(n); 
  }
  
  pendientesDe(usuario: string): Notificacion[] { 
    return this.pendientes.filter(n => n.usuario === usuario);
  }
}

// UNA DE LAS NUEVE CLASES (Declara la dependencia, no la busca por su cuenta)
class GestorDeTareas {
  // Se inyecta por el constructor
  constructor(private registro: RegistroDeNotificaciones) {}

  completarTarea(tarea: string, usuario: string): void {
    this.registro.agregar(new Notificacion(`Tarea ${tarea} lista`, usuario));
  }
}


// PRUEBAS DEMOSTRATIVAS (Sin pasos de limpieza intermedios)
console.log("--- Corriendo Pruebas ---");

// Prueba 1
const registroTest1 = new RegistroDeNotificaciones(); // Instancia nueva
const gestorTest1 = new GestorDeTareas(registroTest1);
gestorTest1.completarTarea("Diseño BD", "Ana");

const ok1 = registroTest1.pendientesDe("Ana").length === 1;
console.log(`Prueba 1: ${ok1 ? "PASA (1 notificación)" : "FALLA"}`);

// Prueba 2 
const registroTest2 = new RegistroDeNotificaciones(); // Instancia totalmente nueva
const gestorTest2 = new GestorDeTareas(registroTest2);
gestorTest2.completarTarea("API Rest", "Ana");

const ok2 = registroTest2.pendientesDe("Ana").length === 1;
console.log(`Prueba 2: ${ok2 ? "PASA (1 notificación, no se pisó con el Test 1)" : "FALLA"}`);

/*

¿Por qué dejó de hacer falta limpiar()?
Porque al eliminar el Singleton, eliminamos el "estado global". Ahora cada prueba instancia su propio 
new RegistroDeNotificaciones() desde cero. Como cada test trabaja con un objeto nuevo en memoria, es 
imposible que queden notificaciones "fantasma" de una prueba anterior. El estado muere y se limpia solo 
cuando la prueba termina (recolector de basura).

¿Qué habría que hacer para manejar dos espacios de trabajo separados?
No hay que tocar ni una sola línea dentro de las nueve clases que usan el registro, ni tampoco modificar la 
clase RegistroDeNotificaciones. El cambio se hace únicamente en la raíz de composición (el main), donde se 
instancian los objetos. Solo hay que agregar las líneas para crear dos registros separados (const registroA = 
new Registro(); const registroB = new Registro();) e inyectar el A a las clases de un espacio, y el B a las 
clases del otro.


El método limpiar() es un síntoma, no una solución. ¿De qué es síntoma exactamente? Formulá la 
respuesta como una regla general aplicable a cualquier código, no sólo a éste

El método limpiar() es un síntoma del acoplamiento al estado global.
La regla general es: "Si el código de producción necesita métodos o variables artificiales que existen pura 
y exclusivamente para que las pruebas puedan correr, el diseño está mal estructurado y el ciclo de vida del 
objeto está fuera de control".
*/