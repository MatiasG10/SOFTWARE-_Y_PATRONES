






/*


¿Qué pasa el día que se agregue un cuarto dispositivo (ej. escáner de cheques)?

Al agregar un escáner de cheques, se declara el nuevo método crearEscaner(): Escaner en la interfaz de la fábrica abstracta. A partir de ese momento, 
el compilador de TypeScript marcará un error en todas las clases de fabricantes existentes hasta que implementen la creación de su propio escáner, 
asegurando que ningún fabricante quede incompleto.


¿Si hubiera un solo fabricante y solo variara el dispensador, seguiría correspondiendo Abstract Factory?

No, no correspondería. Usar Abstract Factory para un solo objeto variante sería sobreingeniería. En su lugar, usaríamos Factory Method o una Fábrica Simple
únicamente para el dispensador, ahorrándonos crear las interfaces e implementaciones de las fábricas abstractas para el lector y la impresora.


*/

interface Dispensador { entregar(monto: number): Promise<void>; }
interface LectorDeTarjetas { leer(): Promise<void>; }
interface Impresora { imprimir(comprobante: string): Promise<void>; }

// 1. La Fábrica Abstracta
interface FabricaDispositivos {
  crearDispensador(): Dispensador;
  crearLector(): LectorDeTarjetas;
  crearImpresora(): Impresora;
}

// 2. Dispositivos concretos (Ejemplo: Fabricante A)
class DispensadorA implements Dispensador {
  constructor(private puerto: string, private tiempoEspera: number) {}
  async entregar(monto: number): Promise<void> {}
}
class LectorA implements LectorDeTarjetas {
  constructor(private puerto: string, private tiempoEspera: number) {}
  async leer(): Promise<void> {}
}
class ImpresoraA implements Impresora {
  constructor(private puerto: string, private tiempoEspera: number) {}
  async imprimir(comprobante: string): Promise<void> {}
}

// 3. Fábrica Concreta del Fabricante A (centraliza configuración)
class FabricaFabricanteA implements FabricaDispositivos {
  // La configuración se pasa en un solo lugar
  constructor(
    private readonly puerto: string,
    private readonly tiempoEspera: number
  ) {}

  crearDispensador(): Dispensador { return new DispensadorA(this.puerto, this.tiempoEspera); }
  crearLector(): LectorDeTarjetas { return new LectorA(this.puerto, this.tiempoEspera); }
  crearImpresora(): Impresora { return new ImpresoraA(this.puerto, this.tiempoEspera); }
}

// 4. El Servicio
class ServicioDeExtraccion {
  private dispensador: Dispensador;
  private lector: LectorDeTarjetas;
  private impresora: Impresora;

  // Al pedir la fábrica completa, es imposible mezclar piezas de distintos fabricantes
  constructor(fabrica: FabricaDispositivos) {
    this.dispensador = fabrica.crearDispensador();
    this.lector = fabrica.crearLector();
    this.impresora = fabrica.crearImpresora();
  }
}

///5. main

// Se crea la fábrica pasándole la configuración UNA sola vez.
const fabricaA = new FabricaFabricanteA("COM1", 5000);
// Se Crea el servicio pasándole la fábrica completa.
const servicio = new ServicioDeExtraccion(fabricaA);
