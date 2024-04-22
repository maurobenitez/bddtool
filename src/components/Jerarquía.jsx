import { useSelector } from 'react-redux';
import { Line, Arrow, Text } from "react-konva";

const Jerarquía = ({ id }) => {
    const entidades = useSelector((state) => state.diagram.entidades);
    const entidadPadre = entidades.find((entidad) => entidad.id == id);

    const getEntidad = (idEntidad) => {
        const entidad = entidades.find((entidad) => entidad.id == idEntidad);
        return entidad;
    }

    const getEntidadesHijo = (idEntidadPadre) => {
        const entidadPadre = getEntidad(idEntidadPadre);
        const listaIdEntidadesHijo = entidadPadre.hijos;
        const listaEntidadesHijo = listaIdEntidadesHijo.map(id => getEntidad(id));
        return listaEntidadesHijo;
    }

    const getAnchoEntidad = (idEntidad) => {
        const entidad = getEntidad(idEntidad);
        const anchoEntidad = (entidad.nombre.length * 6.15) + 20;
        return anchoEntidad;
    }
    const sumarAnchoEntidades = (entidades) => {
        var sumarAnchoEntidades = (entidades.length - 1) * 10;
        entidades.forEach(entidad => {
            let anchoEntidad = getAnchoEntidad(entidad.id);
            sumarAnchoEntidades += anchoEntidad;
        })
        return sumarAnchoEntidades;
    }
    const getPuntoInicio = (entidadPadre) => {
        const { x, y } = entidadPadre;
        const entidadesHijo = getEntidadesHijo(entidadPadre.id);
        const sumarAnchoEntidadesHijo = sumarAnchoEntidades(entidadesHijo);
        const newY = y + 75;
        const newX = x - (sumarAnchoEntidadesHijo / 2);
        return { x: newX, y: newY };
    }

    const getCentroEntidad = (entidadHijo, puntoInicio) => {
        const anchoEntidad = getAnchoEntidad(entidadHijo.id);
        const centroEntidad = (anchoEntidad / 2) + puntoInicio.x;
        return { x: centroEntidad, y: puntoInicio.y };
    }

    const calcularCoordenadasLineasEntidadesHijo = (entidadPadre) => {
        const entidadesHijo = getEntidadesHijo(entidadPadre.id);
        var puntoInicio = getPuntoInicio(entidadPadre);
        var coordenadasLineasEntidadesHijo = [];
        entidadesHijo.forEach((entidadHijo) => {
            let centroEntidadHijo = getCentroEntidad(entidadHijo, puntoInicio);
            let coordenadaslineaEntidadHijo = [
                centroEntidadHijo.x, centroEntidadHijo.y - 15, centroEntidadHijo.x, centroEntidadHijo.y - 38
            ];
            coordenadasLineasEntidadesHijo.push({ coordenadas: coordenadaslineaEntidadHijo, id: entidadHijo.id + "-" + entidadPadre.id });
            puntoInicio.x += getAnchoEntidad(entidadHijo.id) + 10;
        });
        return coordenadasLineasEntidadesHijo;
    };

    const calcularCoordenadasFlecha = () => {
        const entidadPadre = getEntidad(id);
        const coordenadasFlecha = [entidadPadre.x, entidadPadre.y + 15, entidadPadre.x, entidadPadre.y + 37];
        return coordenadasFlecha;

    }

    const calcularCoordenadasLineaBase = () => {
        const entidadesHijo = getEntidadesHijo(entidadPadre.id);
        var puntoInicio = getPuntoInicio(entidadPadre);
        var coordenadasLineaBase = [];
        entidadesHijo.forEach((entidadHijo) => {
            let centroEntidadHijo = getCentroEntidad(entidadHijo, puntoInicio);
            coordenadasLineaBase.push(centroEntidadHijo);
            puntoInicio.x += getAnchoEntidad(entidadHijo.id) + 10;
        });
        const puntoInicial = [coordenadasLineaBase[0].x, coordenadasLineaBase[0].y - 38];
        const puntoFinal = [coordenadasLineaBase[coordenadasLineaBase.length - 1].x, coordenadasLineaBase[coordenadasLineaBase.length - 1].y - 38];
        return [...puntoInicial, ...puntoFinal];
    }

    const calcularCoordenadasCobertura = () => {
        const coordenadasCobertura = [entidadPadre.x + 14, entidadPadre.y + 20];
        return coordenadasCobertura;
    }

    const coordenadasLineasEntidadesHijo = calcularCoordenadasLineasEntidadesHijo(entidadPadre);
    const flecha = calcularCoordenadasFlecha();
    const coordenadasLineaBase = calcularCoordenadasLineaBase();
    const coordenadasCobertura = calcularCoordenadasCobertura();
    return (
        <>
            <Arrow
                points={flecha}
                stroke="black"
                strokeWidth={1}
                pointerLength={10}
                pointerWidth={7}
                fill="black"
                pointerAtBeginning={true}
                pointerAtEnding={false}
            />
            {
                coordenadasLineasEntidadesHijo.map((linea) =>
                    <Line
                        key={linea.id}
                        points={linea.coordenadas}
                        stroke="black"
                        strokeWidth={1}
                    />
                )
            }
            <Line
                points={coordenadasLineaBase}
                stroke="black"
                strokeWidth={1}
            />
            <Text
                text={entidadPadre.cobertura}
                align="center"
                verticalAlign="center"
                fontSize={12}
                x={coordenadasCobertura[0]}
                y={coordenadasCobertura[1]}
                fill="black"
                width={22}
                offsetX={11}
            />
        </>
    );
};

const calcularOffsetJerarquía = (componente) => {
    let width = (componente.nombre.length * 6.15) + 15;
    let height = 24;
    return [
        { x: -(width / 2), y: 0 },
        { x: 0, y: -(height / 2) },
        { x: (width / 2), y: 0 },
        { x: 0, y: (height / 2) },
    ];
}


export default Jerarquía;
export { calcularOffsetJerarquía };