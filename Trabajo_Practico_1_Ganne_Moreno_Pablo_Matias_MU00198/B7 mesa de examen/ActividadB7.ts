
// LOS TIPOS ESTRICTOS
type NotaValida = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type ResultadoExamen =
    | { estado: 'presente'; nota: NotaValida }
    | { estado: 'ausente' };

type Alumno = { legajo: string; resultado: ResultadoExamen };

// LA CLASE ACTA (El producto final)
class Acta {
    // Constructor privado: está prohibido hacer "new Acta()" directamente.
    private constructor(
        public readonly materia: string,
        public readonly fecha: Date,
        public readonly tribunal: string[],
        public readonly alumnos: Alumno[],
        public readonly modalidad: 'presencial' | 'remota',
        public readonly enlaceGrabacion?: string,
        public readonly actaOriginal?: Acta
    ) { }

    static builder(): BuilderActa {
        return new BuilderActa();
    }
}

// EL BUILDER (El obrero que junta las piezas)
class BuilderActa {
    // se van guardando los datos de a poco
    private materia!: string; 
    private fecha!: Date;
    private tribunal: string[] = [];
    private alumnos: Alumno[] = [];

    // Por defecto arranca presencial
    private modalidad: 'presencial' | 'remota' = 'presencial';

    // Opcionales arrancan vacíos
    private enlaceGrabacion?: string;
    private actaOriginal?: Acta;

    // MÉTODOS DE CONSTRUCCIÓN (Reciben un dato y devuelven "this" para encadenar)
    conMateriaYFecha(materia: string, fecha: Date) {
        this.materia = materia;
        this.fecha = fecha;
        return this; 
    }

    conTribunal(profesor1: string, profesor2: string, profesor3: string) {
        if (profesor1 === profesor2 || profesor1 === profesor3 || profesor2 === profesor3) {
            throw new Error("El tribunal no puede tener profesores repetidos.");
        }
        this.tribunal = [profesor1, profesor2, profesor3];
        return this;
    }

    agregarAlumno(legajo: string, resultado: ResultadoExamen) {
        this.alumnos.push({ legajo, resultado });
        return this;
    }

    conModalidad(modalidad: 'presencial' | 'remota', enlace?: string) {
        this.modalidad = modalidad;
        this.enlaceGrabacion = enlace;
        return this;
    }

    esRectificativaDe(actaPrevia: Acta) {
        this.actaOriginal = actaPrevia;
        return this;
    }

    // EL PASO FINAL: VALIDAR TODO JUNTO Y CREAR EL OBJETO REAL
    build(): Acta {
        // Validamos que estén los datos mínimos
        if (!this.materia || !this.fecha || this.tribunal.length === 0) {
            throw new Error("Faltan datos obligatorios (materia, fecha o tribunal).");
        }

        // validación final: ¿Cargó al menos un alumno?
        if (this.alumnos.length === 0) {
            throw new Error("El acta debe tener al menos un alumno.");
        }

        // Validación final: ¿Cruzó bien la modalidad con el enlace?
        if (this.modalidad === 'remota' && !this.enlaceGrabacion) {
            throw new Error("Si es remota, tenés que pasar el enlace.");
        }
        if (this.modalidad === 'presencial' && this.enlaceGrabacion) {
            throw new Error("Si es presencial, no puede tener enlace.");
        }

        // Validación final: ¿La fecha tiene sentido si es rectificativa?
        if (this.actaOriginal && this.fecha <= this.actaOriginal.fecha) {
            throw new Error("La fecha del acta nueva debe ser posterior a la original.");
        }

        // final si esta todo bien, Obligamos al constructor privado a dejarnos pasar
        // usando "(Acta as any)" y armamos el objeto definitivo.
        return new (Acta as any)(
            this.materia,
            this.fecha,
            this.tribunal,
            this.alumnos,
            this.modalidad,
            this.enlaceGrabacion,
            this.actaOriginal
        );
    }
}

/*

Notas y Ausentes (Tipos): Se valida al recibir el dato (TS frena el error antes de ejecutar).

Tribunal sin repetir: Se valida al recibir el dato (los tres nombres llegan juntos al método).

Al menos un alumno: Se valida al final (el acta arranca vacía, hay que esperar a que el usuario termine de cargar).

Modalidad vs Enlace: Se valida al final (depende de dos variables que pueden cargarse en cualquier orden).

Acta rectificativa vs Fecha: Se valida al final (cruza la fecha del acta actual con la del acta anterior).

*/