// ---------- Tipos del dominio ---------
type Canal = "minorista" | "mayorista" | "export";
 
interface Cliente { nombre(): string; esMayorista(): boolean; }
interface Producto { codigo(): string; precio(): number; peso(): number; }
interface Direccion { esDelExterior(): boolean; codigoPostal(): string; }
interface Comprobante { emitir(): void; }
interface Archivo { nombre(): string; bytes(): Uint8Array; }
interface Clonable<T> { clonar(): T; }
 
// Inmutable: dos pedidos pueden compartir la misma instancia
interface CondicionesComerciales { descuento(): number; }
 
class ItemDePedido implements Clonable<ItemDePedido> {
  constructor(readonly producto: Producto, readonly cantidad: number) {}
  clonar(): ItemDePedido {
    return new ItemDePedido(this.producto, this.cantidad);
  }
}
 
interface Pedido {
  cliente(): Cliente;
  items(): ItemDePedido[];
  canal(): Canal;
  total(): number;
}
 
// ---------- Contratos de infraestructura ---------
interface Notificador { notificar(c: Cliente, t: string): Promise<void>; }
interface RepositorioDePedidos { insertar(p: Pedido): Promise<void>; }
interface Reloj { ahora(): Date; }
 
// ---------- Errores ---------
class CanalDesconocido extends Error {}
class PedidoIncompleto extends Error {}
class PedidoInvalido extends Error {}
class EnvioInvalido extends Error {}