// Clases auxiliares mínimas para que el código compile
class Habilidad { constructor(public nombre: string) { } }
class Objeto { constructor(public nombre: string) { } }
class Aspecto { constructor(public sprite: string) { } }

class Unidad {
    constructor(
        public nombre: string,
        public vida: number,
        public habilidades: Habilidad[],
        public inventario: Objeto[],
        private readonly aspecto: Aspecto
    ) { }

    recibirDanio(n: number): void {
        this.vida -= n;
    }

    equipar(o: Objeto): void {
        this.inventario.push(o);
    }

    // patron prototype
    clonar(): Unidad {
        // Usamos .slice() para crear nuevos arreglos sin usar propagación (...)
        const habilidadesClonadas = this.habilidades.slice();
        const inventarioClonado = this.inventario.slice();

        return new Unidad(
            this.nombre,
            this.vida,
            habilidadesClonadas,
            inventarioClonado,
            this.aspecto // Se pasa la misma referencia (Compartido por ser inmutable)
        );
    }
}

// PRuebas demostrativas

// El diseñador crea la plantilla en el editor
const aspectoArquero = new Aspecto("arquero_sprite.png");
const plantillaArquero = new Unidad(
    "Arquero de Élite",
    100,
    [new Habilidad("Tiro Preciso")],
    [],
    aspectoArquero
);

// El motor del juego instancia las unidades copiando la plantilla
const arquero1 = plantillaArquero.clonar();
const arquero2 = plantillaArquero.clonar();

//  prueba 1: Daño independiente 
console.log("--- Prueba de Daño ---");
arquero1.recibirDanio(30);
console.log(`Vida Arquero 1 (Herido): ${arquero1.vida}`); // 70
console.log(`Vida Arquero 2 (Intacto): ${arquero2.vida}`); // 100
console.log(`Vida Plantilla (Intacta): ${plantillaArquero.vida}`); // 100

// prubea 2: Inventario independiente 
console.log("\n--- Prueba de Inventario ---");
arquero2.equipar(new Objeto("Poción Curativa"));
console.log(`Objetos Arquero 2: ${arquero2.inventario.length}`); // 1
console.log(`Objetos Arquero 1: ${arquero1.inventario.length}`); // 0
console.log(`Objetos Plantilla: ${plantillaArquero.inventario.length}`); // 0


/*

Clasificación de los campos
nombre (string): Se copia por valor automáticamente por ser un tipo primitivo.

vida (number): Se copia por valor. Es vital para que cada clon tenga su propia salud y el daño que reciba 
uno no afecte a los demás.

habilidades (Habilidad[]): Se hace una copia superficial (un nuevo arreglo). Cada unidad necesita su propia
lista por si aprende o pierde habilidades durante el juego, sin alterar a la plantilla.

inventario (Objeto[]): Se hace una copia superficial (un nuevo arreglo). Así, al equipar un objeto con .push(),
solo se agrega al inventario de esa unidad específica.

aspecto (Aspecto): Se comparte la referencia deliberadamente. Como la consigna aclara que es inmutable (solo 
lectura), no hay riesgo de que un clon lo modifique y arruine al resto. Compartirlo ahorra muchísima memoria, 
ya que todas las unidades apuntan a la misma imagen.


¿Por qué el enunciado insiste en que las plantillas las arma el diseñador desde un editor? Si las unidades
estuvieran definidas en el código, ¿qué solución más simple alcanzaría, y qué se perdería al usarla? respondamos 
esto de forma simple 

Si las unidades estuvieran fijas en el código, la solución más simple sería crear una clase para cada tipo de 
personaje (por ejemplo, class Arquero extends Unidad) o usar una Fábrica tradicional. Para agregar uno al juego, 
solo harías new Arquero() y no te haría falta clonar nada.

Lo que se perdería al usar esa solución es la libertad para crear sin saber programar. Si usás clases rígidas en 
el código, cada vez que el diseñador del juego quiera inventar un enemigo nuevo o cambiarle la vida a un personaje,
un programador tendría que modificar el archivo y recompilar todo el juego. Al armar las plantillas en un editor y
usar el patrón Prototype, el diseñador puede inventar infinitas unidades al vuelo y el sistema simplemente las 
guarda como moldes y las clona cuando hacen falta, sin tocar una sola línea de código.


*/