abstract class Herramienta {
    constructor(
        protected readonly documento: Documento,
        protected readonly pilaDeshacer: PilaDeshacer,
        protected readonly lienzo: Lienzo
    ) { }

    // El método de fábrica interno (abstracto y protegido)
    protected abstract crearFigura(inicio: Punto, fin: Punto): Figura;

    // El procedimiento estable de 5 pasos (escrito una sola vez)
    alSoltar(inicio: Punto, fin: Punto): void {
        const figura = this.crearFigura(inicio, fin);

        this.documento.agregar(figura);
        this.documento.seleccionar(figura);
        this.pilaDeshacer.registrar(new AccionAgregar(figura));
        this.lienzo.repintar();
    }
}

// --- SUBCLASES CONCRETAS ---
class HerramientaRectangulo extends Herramienta {
    protected crearFigura(inicio: Punto, fin: Punto): Figura {
        return new Rectangulo(inicio, fin);
    }
}

class HerramientaElipse extends Herramienta {
    protected crearFigura(inicio: Punto, fin: Punto): Figura {
        return new Elipse(inicio, fin);
    }
}

class HerramientaLinea extends Herramienta {
    protected crearFigura(inicio: Punto, fin: Punto): Figura {
        return new Linea(inicio, fin);
    }
}

class HerramientaTexto extends Herramienta {
    protected crearFigura(inicio: Punto, fin: Punto): Figura {
        return new CuadroDeTexto(inicio, fin);
    }
}

class HerramientaFlechaAcotada extends Herramienta {
    // Recibe su propia dependencia (estiloPunta)
    constructor(
        documento: Documento,
        pilaDeshacer: PilaDeshacer,
        lienzo: Lienzo,
        private readonly estiloPunta: EstiloDePunta
    ) {
        super(documento, pilaDeshacer, lienzo);
    }

    protected crearFigura(inicio: Punto, fin: Punto): Figura {
        return new FlechaAcotada(inicio, fin, this.estiloPunta);
    }
}

/*

Si las cinco herramientas se construyeran exactamente igual y ninguna necesitara datos propios, 
¿seguiría justificándose la jerarquía de creadores? 
Escribí la alternativa que usarías en ese caso y compará la cantidad de clases.

No, no se justificaría la jerarquía de creadores.

Si todas las herramientas se crearan de la misma forma y sin parámetros propios, crear una subclase 
para cada figura genera clases vacías que solo hacen un new simple. Es sobreingeniería.

La alternativa a usar:
Usaría una Fábrica Simple. Se le pasa una clave (como "rect", "elipse") o la clase de la figura a una
sola herramienta genérica que delega la instanciación.

comparacion: 

Con Factory Method (Jerarquía actual): 6 clases en total (1 clase base abstracta + 5 subclases concretas).

Con Fábrica Simple (Alternativa): 1 sola clase genérica para todas las herramientas.
*/