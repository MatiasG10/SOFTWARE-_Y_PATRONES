
/*Resolución Propuesta para el Ejercicio B.1

1. Análisis de los 8

No son un problema (Valores de dominio):   

1.new Prestamo(socio, ejemplar, vence): No es un problema. Es un objeto de valor del dominio sin 
dependencias que solo representa el préstamo creado.   

2.new ComprobanteDePrestamo(prestamo, vence): No es un problema. Es el valor/comprobante de retorno
 que entrega el método y no tiene servicios externos.   
 
Sí son un problema (Colaboradores y configuraciones rígidas):

3. new PoliticaDePlazos(14): Es un problema. Deja fijo el plazo de 14 días en la lógica. Si la regla
 cambia a 15 o 30 días, obliga a modificar esta clase.

4. new Date(): Es un problema. Acopla el método a la hora del sistema operativo, impidiendo manipular
 o congelar la fecha para realizar pruebas de vencimiento en distintos escenarios.

5. new RepositorioDePrestamos("prestamos.db"): Es el peor problema. Es el que hace imposible probar el
 método sin efectos reales, ya que escribe directamente en el archivo de base de datos de producción
  "prestamos.db" cada vez que se ejecuta.

6. new CalculadoraDeMultas(...): Es un problema. Obliga a este servicio a conocer la dependencia
 interna de la calculadora y cómo se construye.

7. new TarifaFija(50): Es un problema. Deja hardcodeado el valor de $50 de la multa dentro del flujo
 del préstamo.

8. new NotificadorSMS("+54911..."): Es un problema. Al ejecutar pruebas o guardar un préstamo, va a
 enviar mensajes SMS reales a teléfonos reales.

*/


//2. Código TypeScript Reescrito

//Agregue esto para que no moleste visualmente en el IDE los errores.
interface Socio { categoria(): string; }
interface Ejemplar { }
class ComprobanteDePrestamo { constructor(prestamo: any, vence: any) { } }
class Prestamo { constructor(socio: any, ejemplar: any, vence: any) { } }

interface PoliticaDePlazos { vencimiento(fecha: Date, cat: string): Date; }
interface RepositorioDePrestamos { guardar(prestamo: Prestamo): void; }
interface CalculadoraDeMultas { tieneDeuda(socio: Socio): boolean; }
interface Notificador { enviar(socio: Socio, msg: string): void; }
interface Reloj { ahora(): Date; }

class ServicioDePrestamos {
    // El constructor declara todo lo que la clase necesita del exterior
    constructor(
        private readonly politica: PoliticaDePlazos,
        private readonly repositorio: RepositorioDePrestamos,
        private readonly multas: CalculadoraDeMultas,
        private readonly notificador: Notificador,
        private readonly reloj: Reloj
    ) { }

    prestar(socio: Socio, ejemplar: Ejemplar): ComprobanteDePrestamo {
        // Usamos el reloj inyectado para poder simular cualquier fecha
        const vence = this.politica.vencimiento(this.reloj.ahora(), socio.categoria());

        // Se mantiene
        const prestamo = new Prestamo(socio, ejemplar, vence);

        // Guardamos usando el repositorio inyectado
        this.repositorio.guardar(prestamo);

        // Verificamos si tiene deudas y notificamos si hace falta
        if (this.multas.tieneDeuda(socio)) {
            this.notificador.enviar(socio, "Tenés una multa");
        }

        // Se mantiene
        return new ComprobanteDePrestamo(prestamo, vence);
    }
}
