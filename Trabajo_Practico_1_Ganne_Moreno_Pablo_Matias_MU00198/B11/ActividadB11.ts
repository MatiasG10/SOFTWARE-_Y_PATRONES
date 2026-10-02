// (Contratos que reemplazan a las clases concretas)
interface ServicioEnvio { cotizar(carrito: any, destino: any): number; }
interface ServicioPago { cobrar(tarjeta: any, total: number): Promise<{aprobado: boolean, motivo?: string}>; }
interface ServicioStock { descontar(carrito: any): void; }
interface ServicioFacturacion { emitir(factura: any): void; }
interface ServicioNotificacion { enviar(factura: any): void; }

// LA CLASE DE DOMINIO LIMPIA 
class Checkout {
  // Todas las dependencias entran por el constructor (Inyección)
  constructor(
    private calculadoraEnvio: ServicioEnvio,
    private pasarelaPago: ServicioPago,
    private gestorStock: ServicioStock,
    private emisorFactura: ServicioFacturacion,
    private notificador: ServicioNotificacion
  ) {}

  async comprar(carrito: any, tarjeta: any): Promise<any> {
    if (carrito.vacio()) throw new Error("CarritoVacio");

    const envio = this.calculadoraEnvio.cotizar(carrito, carrito.destino());
    const total = carrito.subtotal() + envio;

    const cobro = await this.pasarelaPago.cobrar(tarjeta, total);
    if (!cobro.aprobado) throw new Error(`PagoRechazado: ${cobro.motivo}`);

    this.gestorStock.descontar(carrito);

    // Los únicos new que sobrevivieron
    const factura = new Factura(carrito, envio, cobro, new Date());
    
    this.emisorFactura.emitir(factura);
    this.notificador.enviar(factura);

    return factura;
  }
}


//raiz_produccion.ts

// Se conectan los servicios reales con sus claves de producción
const calculadora = new CalculadoraDeEnvio(new TarifarioCorreo());
const pasarela = new PasarelaDePagos("clave-produccion-xyz");
const stock = new StockSQL("Server=prod;Database=tienda");
const emisor = new EmisorAFIP("cert.p12");
const notificador = new NotificadorEmail("smtp.tienda.com");

// Se ensambla el objeto real
const checkoutProduccion = new Checkout(calculadora, pasarela, stock, emisor, notificador);



//raiz_pruebas.ts


// 1. Armamos "Dobles de prueba" (Mocks)
class EnvioMock implements ServicioEnvio { cotizar() { return 1500; } }
class PagoMock implements ServicioPago { async cobrar() { return { aprobado: true }; } }
class NotificadorMock implements ServicioNotificacion { enviar() {} }

// 2. Mocks espías (Guardan el dato para que la prueba pueda verificarlo)
class StockMockEspia implements ServicioStock {
  public carritoDescontado: any = null;
  descontar(carrito: any): void { this.carritoDescontado = carrito; }
}
class EmisorMockEspia implements ServicioFacturacion {
  public facturaEmitida: any = null;
  emitir(factura: any): void { this.facturaEmitida = factura; }
}

// 3. Ejecución de la prueba de integración
async function correrPrueba() {
  const stockEspia = new StockMockEspia();
  const emisorEspia = new EmisorMockEspia();
  
  // Inyectamos los dobles de prueba en el Checkout real
  const checkoutTest = new Checkout(
    new EnvioMock(), 
    new PagoMock(), 
    stockEspia, 
    emisorEspia, 
    new NotificadorMock()
  );

  const carritoSimulado = { vacio: () => false, subtotal: () => 10000, destino: () => "CABA" };
  const tarjetaSimulada = { numero: "1234" };

  // Ejecutamos el método completo
  const facturaResultante = await checkoutTest.comprar(carritoSimulado, tarjetaSimulada);

  // Verificamos que se descontó el stock y se emitió la factura correctamente
  console.log("Stock descontado correctamente:", stockEspia.carritoDescontado === carritoSimulado);
  console.log("Factura emitida correctamente:", emisorEspia.facturaEmitida === facturaResultante);
}
correrPrueba();


/* REspuestas
Los new que quedaron —si quedó alguno— tienen una justificación escrita.

Sobrevivieron new Factura y new Date() porque son simples objetos de datos, no herramientas de infraestructura. 
Lo que se prohíbe es usar new para conectarse a bases de datos o mandar correos, pero crear objetos de información 
en memoria está perfecto.


¿Cuántas dependencias quedaron en el constructor? Si son seis o más, es una señal: no del diseño de la 
inyección, sino de la clase. ¿Qué te está diciendo ese número sobre las responsabilidades de Checkout, y qué 
harías con esa información?

Quedaron 5 dependencias. Un número tan alto indica que la clase Checkout está haciendo demasiadas tareas juntas 
y viola el Principio de Responsabilidad Única (intenta controlar todo el sistema).
Para arreglarlo, usaría eventos: el Checkout solo debería encargarse de cobrar y luego emitir un aviso de "Compra 
Finalizada". El sistema de correos y el de facturación simplemente escucharían ese evento para hacer su parte solos,
lo que permitiría borrarlos del constructor.

*/