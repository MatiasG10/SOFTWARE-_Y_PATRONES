type DatosRecibo = {
  legajo: string;
  periodo: string;
  basico: number;
  antiguedad: number;
  presentismo: number;
  descuentosLey?: number; 
  adelantos?: number;     
  observaciones?: string; 
};

class Recibo {
  public readonly total: number;

  constructor(datos: DatosRecibo) {
    if (
      datos.basico < 0 || 
      datos.antiguedad < 0 || 
      datos.presentismo < 0 || 
      (datos.descuentosLey && datos.descuentosLey < 0) || 
      (datos.adelantos && datos.adelantos < 0)
    ) {
      throw new Error("Los montos no pueden ser negativos.");
    }

    this.total = datos.basico + datos.antiguedad + datos.presentismo 
                 - (datos.descuentosLey || 0) - (datos.adelantos || 0);
  }
}

const recibo = new Recibo({
  legajo: "L-4471",
  periodo: "2026-10",
  basico: 850000,
  antiguedad: 127500,
  presentismo: 0,
  descuentosLey: 156400
});

/* REspuesta teorica

No corresponde usar el patrón Builder, sino un Objeto de Parámetros.

Justificando con las tres condiciones del apunte:
Primero, la construcción no requiere múltiples pasos porque el enunciado aclara que los datos llegan todos juntos 
en un solo momento. Segundo, tampoco hay reglas que crucen campos; cada monto se valida por separado para evitar 
negativos. La única condición que sí se cumple es que hay muchos parámetros y opcionales, lo que hace ilegible el 
código, pero eso se arregla pasando un único objeto de configuración, sin necesidad de armar toda la estructura de 
un patrón.

Para que sí se justifique usar un Builder, el enunciado tendría que decir que los datos llegan en distintos 
momentos del tiempo, o agregar una regla cruzada (por ejemplo, que el adelanto no pueda ser mayor al 30% del 
sueldo básico).

Respondiendo a la pregunta trampa: se agregó exactamente 1 solo tipo nuevo (DatosRecibo), logrando que la llamada 
sea legible sin crear clases de más.

*/