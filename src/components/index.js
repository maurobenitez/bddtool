import Entidad, { calcularOffsetEntidad } from "./Entidad";
import Relacion, { calcularOffsetRelacion } from "./Relacion";
import Atributo, { calcularOffsetAtributo } from "./Atributo";
import AtributoCompuesto, { calcularOffsetAtributoCompuesto } from "./AtributoCompuesto";
import { calcularOffsetIdentificador } from "./IdentificadorCompuesto";
import { calcularOffsetJerarquía } from "./Jerarquía";
const componentes = {
    "entidad": {
        componente: Entidad,
        funcionOffset: calcularOffsetEntidad,
    },
    "relacion": {
        componente: Relacion,
        funcionOffset: calcularOffsetRelacion,
    },
    "atributo": {
        componente: Atributo,
        funcionOffset: calcularOffsetAtributo,
    },
    "atributo compuesto": {
        componente: AtributoCompuesto,
        funcionOffset: calcularOffsetAtributoCompuesto
    },
    "externo": {
        funcionOffset: calcularOffsetIdentificador
    },
    "jerarquía": {
        funcionOffset: calcularOffsetJerarquía
    }
};

export default componentes;