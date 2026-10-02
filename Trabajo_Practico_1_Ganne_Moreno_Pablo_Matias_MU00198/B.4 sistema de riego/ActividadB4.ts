


//sensores.ts

// Tipo estricto con los nombres válidos
export type TipoSensor = "humedad" | "temperatura" | "pluviometro" | "caudalimetro";

// Contrato base
export interface Sensor {
    identificador(): string;
    leer(): Promise<number>;
}

// Clases concretas
export class SensorHumedad implements Sensor {
    constructor(private sector: string, private puerto: string) { }
    identificador(): string { return `Humedad (${this.sector})`; }
    async leer(): Promise<number> { return 45; }
}

export class SensorTemperatura implements Sensor {
    constructor(private sector: string, private puerto: string) { }
    identificador(): string { return `Temperatura (${this.sector})`; }
    async leer(): Promise<number> { return 22; }
}

export class SensorPluviometro implements Sensor {
    constructor(private sector: string, private puerto: string) { }
    identificador(): string { return `Pluviómetro (${this.sector})`; }
    async leer(): Promise<number> { return 0; }
}

export class SensorCaudalimetro implements Sensor {
    constructor(private sector: string, private puerto: string) { }
    identificador(): string { return `Caudalímetro (${this.sector})`; }
    async leer(): Promise<number> { return 120; }
}


//fabrica.ts

import {
    Sensor,
    TipoSensor,
    SensorHumedad,
    SensorTemperatura,
    SensorPluviometro,
    SensorCaudalimetro
} from "./sensores";

// Excepción con detalle de línea y tipo desconocido
export class ErrorLineaArchivo extends Error {
    constructor(numeroLinea: number, tipoInvalido: string) {
        super(`Error en línea ${numeroLinea}: El tipo de sensor '${tipoInvalido}' es desconocido.`);
        this.name = "ErrorLineaArchivo";
    }
}

export class FabricaDeSensores {
    // Mapa centralizado de creación (Unico lugar a modificar si hay un tipo nuevo)
    private static readonly creadores: Record<TipoSensor, (sector: string, puerto: string) => Sensor> = {
        humedad: (sector, puerto) => new SensorHumedad(sector, puerto),
        temperatura: (sector, puerto) => new SensorTemperatura(sector, puerto),
        pluviometro: (sector, puerto) => new SensorPluviometro(sector, puerto),
        caudalimetro: (sector, puerto) => new SensorCaudalimetro(sector, puerto)
    };

    static parsearArchivo(contenidoArchivo: string): Sensor[] {
        const lineas = contenidoArchivo.split("\n").filter(l => l.trim().length > 0);

        return lineas.map((linea, indice) => {
            const numeroLinea = indice + 1;
            const partes = linea.split(",").map(p => p.trim());

            if (partes.length < 3) {
                throw new Error(`Error en línea ${numeroLinea}: Formato incompleto.`);
            }

            const [tipoRaw, sector, puerto] = partes;

            // Validación del tipo escrito por el técnico
            if (!(tipoRaw in FabricaDeSensores.creadores)) {
                throw new ErrorLineaArchivo(numeroLinea, tipoRaw);
            }

            const tipo = tipoRaw as TipoSensor;
            return FabricaDeSensores.creadores[tipo](sector, puerto);
        });
    }
}


//fabrica.test.ts

import { FabricaDeSensores, ErrorLineaArchivo } from "./fabrica";
import { SensorHumedad, SensorTemperatura, SensorPluviometro } from "./sensores";

// Test de los 3 sensores válidos
function testParsearTresSensores() {
    const archivo =
        "humedad,sector-3,/dev/ttyS0\n" +
        "temperatura,invernadero,/dev/ttyS1\n" +
        "pluviometro,exterior,/dev/ttyS2";

    const sensores = FabricaDeSensores.parsearArchivo(archivo);

    console.assert(sensores.length === 3, "Debería crear 3 sensores");
    console.assert(sensores[0] instanceof SensorHumedad, "El primero debe ser SensorHumedad");
    console.assert(sensores[1] instanceof SensorTemperatura, "El segundo debe ser SensorTemperatura");
    console.assert(sensores[2] instanceof SensorPluviometro, "El tercero debe ser SensorPluviometro");

    console.log("Prueba de 3 sensores: OK");
}

// Test opcional para verificar el error de tipo desconocido
function testErrorTipoDesconocido() {
    const archivoConError = "humedad,sector-1,/dev/ttyS0\nanemometro,exterior,/dev/ttyS1";

    try {
        FabricaDeSensores.parsearArchivo(archivoConError);
    } catch (error) {
        console.assert(error instanceof ErrorLineaArchivo, "Debe ser un ErrorLineaArchivo");
        console.assert(
            (error as Error).message === "Error en línea 2: El tipo de sensor 'anemometro' es desconocido.",
            "El mensaje de error debe indicar la línea 2 y el tipo desconocido"
        );
        console.log("Prueba de error descriptivo: OK");
    }
}

testParsearTresSensores();
testErrorTipoDesconocido();



/* Respuesta

El enunciado dice que el técnico edita el archivo sin recompilar. 
¿Eso significa que se pueden agregar tipos de sensor nuevos sin recompilar? 
Distinguí las dos cosas: agregar un sensor de un tipo conocido y agregar un tipo nuevo.

No. Hay que distinguir dos casos:

Agregar un sensor de un tipo conocido (Sin recompilar):

El técnico agrega una línea en el archivo (ej: humedad,sector-4,/dev/ttyS3). No requiere recompilar 
porque el programa ya conoce esa clase e instancia el objeto leyendo el texto en tiempo de ejecución.

Agregar un tipo de sensor nuevo (Requiere recompilar):

Si el técnico escribe un tipo que no existe (ej: anemometro), sí requiere recompilar. Un programador 
tiene que escribir la clase SensorAnemometro en el código, registrarla en la fábrica y volver a 
compilar el programa.
*/