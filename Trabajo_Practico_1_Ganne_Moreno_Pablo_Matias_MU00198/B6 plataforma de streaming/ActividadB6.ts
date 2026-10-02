interface Decodificador {
    decodificar(flujo: any): void;
}

class DecodificadorBaja implements Decodificador {
    decodificar(flujo: any) { }
}

class DecodificadorMedia implements Decodificador {
    decodificar(flujo: any) { }
}

class DecodificadorAlta implements Decodificador {
    decodificar(flujo: any) { }
}


// solucion : propuesta de bruno (Fábrica Simple con Registro)
class FabricaDecodificadores {
    // Registro centralizado: si se agrega una calidad, solo se toca este diccionario.
    private readonly registro: Record<string, () => Decodificador> = {
        'baja': () => new DecodificadorBaja(),
        'media': () => new DecodificadorMedia(),
        'alta': () => new DecodificadorAlta(),
    };

    crear(calidad: string): Decodificador {
        const creador = this.registro[calidad];
        if (!creador) throw new Error(`Calidad ${calidad} no soportada.`);
        return creador();
    }
}

// EL REPRODUCTOR (Cliente)
class Reproductor {
    private decodificador: Decodificador;

    constructor(fabrica: FabricaDecodificadores, calidadInicial: string) {
        this.decodificador = fabrica.crear(calidadInicial);
    }

    cambiarCalidad(fabrica: FabricaDecodificadores, nuevaCalidad: string) {
        this.decodificador = fabrica.crear(nuevaCalidad);
    }

    reproducir(flujo: any) {
        this.decodificador.decodificar(flujo);
    }
}


// MAIN

// 1 Nace la fábrica de Bruno. Esta fábrica ya tiene adentro el registro 
// con las 3 calidades posibles.
const fabricaDeVideo = new FabricaDecodificadores();

// 2 Nace el reproductor. Le pasamos la fábrica para que sepa a quién 
const reproductor = new Reproductor(fabricaDeVideo, 'media');

// 3 Llega el video y el reproductor lo reproduce (usa el decodificador medio)
reproductor.reproducir("flujo_de_datos...");

// 4 El usuario hace clic en la ruedita de YouTube y elige 1080p (alta).
reproductor.cambiarCalidad(fabricaDeVideo, 'alta');

// 5 Sigue reproduciendo, pero ahora con el decodificador de alta calidad.
reproductor.reproducir("flujo_de_datos...");


/*
1. Veredicto y señal
Gana la propuesta de Bruno (Fábrica Simple). La señal clave es que hoy solo cambia una sola pieza (el decodificador). 
El patrón de Ana pide que haya todo un grupo de piezas relacionadas (una "familia"), cosa que hoy no tenemos.

2. Respuesta al argumento de Ana
Ana tiene buena intuición a futuro, pero se está adelantando demasiado. Armar toda esa estructura gigante hoy solo 
sirve para hacer el código más difícil de leer por un problema que, en la realidad, todavía no existe.

3. Principo aplicado
Se está aplicando el principio YAGNI ("No lo vas a necesitar"). Este principio dice básicamente que no hay que 
escribir código extra ni estructuras complejas "por si las dudas" lo llegamos a usar más adelante.

4. Señal para cambiar de opinión
Cambiaríamos a la idea de Ana el día exacto en que el cliente nos pida agregar una segunda pieza que también 
dependa de la calidad (por ejemplo, el famoso buffer). Ahí ya tendríamos dos piezas, y la idea de Ana tendría sentido.

5. Costo de migración (Pregunta extra)
Si en seis meses aparece el buffer, pasar del código de Bruno al de Ana es una pavada: cuesta tocar como mucho 2 o 3
archivos (modificar la fábrica actual y ajustar el main). Como es tan barato y fácil cambiarlo en el futuro, es la 
prueba de que no vale la pena complicarse la vida hoy.

*/