import { Line, Text, Circle } from "react-konva";
import React from 'react';
import componentes from ".";
import { useSelector, useDispatch } from 'react-redux';

const IdentificadorCompuesto = ({ entidad }) => {

    const relaciones = useSelector((state) => state.diagram.relaciones);

    const entidades = useSelector((state) => state.diagram.entidades);

    function listsAreEqual(list1, list2) {
        if (list1.length !== list2.length) {
            return false;
        }

        list1.sort((a, b) => a - b);
        list2.sort((a, b) => a - b);

        for (let i = 0; i < list1.length; i++) {
            if (list1[i] !== list2[i]) {
                return false;
            }
        }
        return true;
    }

    function buscarRelacion(entidad1, entidad2) {
        const e1 = [entidad1, entidad2];
        var salida = null;
        relaciones.forEach(relacion => {
            var e2 = [];
            for (let i = 0; i < relacion.entidades.length; i++) {
                e2.push(relacion.entidades[i].id);
            }
            if (listsAreEqual(e1, e2))
                salida = relacion;

        });
        return salida;
    }

    function buscarEntidad(idEntidad) {
        return entidades.find(entidad => entidad.id === idEntidad);
    }

    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    const calcularLinea = (figuraA, figuraB) => {
        const offsetFiguraA = componentes[figuraA.type].funcionOffset(figuraA);
        const offsetFiguraB = componentes[figuraB.type].funcionOffset(figuraB);
        var min_distance = Number.MAX_SAFE_INTEGER;
        var min_points = [];
        var lado = 0;
        for (var i = 0; i <= offsetFiguraA.length - 1; i++) {
            for (var j = 0; j <= offsetFiguraB.length - 1; j++) {
                let pointA = [figuraA.x + offsetFiguraA[i].x, figuraA.y + offsetFiguraA[i].y];
                let pointB = [figuraB.x + offsetFiguraB[j].x, figuraB.y + offsetFiguraB[j].y];
                var points = [...pointA, ...pointB];
                var distance = calculateDistance(...points);
                if (distance < min_distance) {
                    min_distance = distance;
                    min_points = points;
                    lado = i;
                }
            }
        }
        return min_points;
    }
    const calcularLineas = (puntos) => {
        let lineas = [];
        for (let i = 0; i < puntos.length - 1; i++) {
            lineas.push([puntos[i].x, puntos[i].y, puntos[i + 1].x, puntos[i + 1].y])
        }
        return lineas;
    }
    const calcularPuntoMedio = (coord) => {
        let [x1, y1, x2, y2] = coord;
        let x = (x1 + x2) / 2;
        let y = (y1 + y2) / 2;
        return { x, y };
    }

    /*  const calcularPuntos = () => {
         const { identificadorCompuesto } = entidad;
         let puntos = [];
         identificadorCompuesto.forEach(atributo => {
             if (atributo.type != "externo") {
                 let punto = calcularLinea(entidad, atributo);
                 puntos.push(calcularPuntoMedio(punto));
             } else {
                 let relacion = buscarRelacion(entidad.id, atributo.entidad);
                 let entidad2 = buscarEntidad(atributo.entidad);
                 let punto = calcularLinea(relacion, entidad2);
                 puntos.push(calcularPuntoMedio(punto));
             }
         })
         return puntos;
     } */

    const calcularPuntos = () => {
        const { atributos } = entidad;
        let puntos = [];
        atributos.forEach(atributo => {
            if (atributo.clavePrimaria === true) {
                let punto = calcularLinea(entidad, atributo);
                puntos.push(calcularPuntoMedio(punto));
            } else if (atributo.type === "externo") {
                let relacion = buscarRelacion(entidad.id, atributo.entidad);
                let entidad2 = buscarEntidad(atributo.entidad);
                let punto = calcularLinea(relacion, entidad2);
                puntos.push(calcularPuntoMedio(punto));
            }
        })
        return puntos;
    }
    const puntos = calcularPuntos();
    const lineas = calcularLineas(puntos);
    return (
        <>
            {puntos.map((punto, index) => (
                <Circle
                    x={punto.x}
                    y={punto.y}
                    radius={5}
                    stroke="black"
                    fill="black"
                    strokeWidth={1}
                    key={"c" + "-" + index + "-" + entidad.id}
                />
            ))}
            {lineas.map((linea, index) => (
                <Line
                    points={linea}
                    stroke="black"
                    strokeWidth={1}
                    key={"l" + "-" + index + "-" + entidad.id}
                />
            ))}
        </>
    );
};

const calcularOffsetIdentificador = (componente) => {
    let width = (componente.nombre.length * 6.15) + 20;
    return [
        { x: -(width / 2), y: 0 },
        { x: 0, y: -(30 / 2) },
        { x: (width / 2), y: 0 },
        { x: 0, y: (30 / 2) },
    ];
}

export default IdentificadorCompuesto;
export { calcularOffsetIdentificador };