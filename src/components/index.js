import Entidad, { calcularOffsetEntidad } from "./Entidad";
import Relacion, { calcularOffsetRelacion } from "./Relacion";
import Atributo, { calcularOffsetAtributo } from "./Atributo";

const componentes = {
    Entidad: {
        componente: Entidad,
        funcionOffset: calcularOffsetEntidad,
    },
    Relacion: {
        componente: Relacion,
        funcionOffset: calcularOffsetRelacion,
    },
    Atributo: {
        componente: Atributo,
        funcionOffset: calcularOffsetAtributo,
    }
};

export default componentes;