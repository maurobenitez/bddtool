import Entidad, { calcularOffsetEntidad } from "./Entidad";
import Relacion, { calcularOffsetRelacion } from "./Relacion";

const componentes = {
    Entidad: {
        componente: Entidad,
        funcionOffset: calcularOffsetEntidad,
    },
    Relacion: {
        componente: Relacion,
        funcionOffset: calcularOffsetRelacion,
    }
};

export default componentes;