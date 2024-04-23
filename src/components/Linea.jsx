import { Line, Text, Circle } from "react-konva";
import React from 'react';
import componentes from ".";

const Linea = ({ figuraA, figuraB, text }) => {

    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    function calculateAngle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    const calcularLinea = () => {
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
        return [min_points, lado];
    }

    function calculateShort(baseLength, angleDegrees) {
        var hypotenuseLength = baseLength / Math.cos(angleDegrees);
        return hypotenuseLength;
    }

    function shortenLine(x1, y1, x2, y2, shortenAmount, lado) {
        let angle = calculateAngle(x1, y1, x2, y2);
        const short = calculateShort(shortenAmount, angle)
        let newX1 = x1 + short * Math.cos(angle);
        let newY1 = y1 + short * Math.sin(angle);
        let newX2 = x2;
        let newY2 = y2;
        return [newX1, newY1, newX2, newY2];
    }

    function findParallelLine(x1, y1, x2, y2, distance) {
        function calculateNewCoordinates(x, y, distance, angle) {
            const newX = x + distance * Math.cos(angle);
            const newY = y + distance * Math.sin(angle);
            return [newX, newY];
        }
        const lineAngle = calculateAngle(x1, y1, x2, y2);
        const [newX1, newY1] = calculateNewCoordinates(x1, y1, distance, lineAngle + Math.PI / 2);
        const [newX2, newY2] = calculateNewCoordinates(x2, y2, distance, lineAngle + Math.PI / 2);
        return [newX1, newY1, newX2, newY2];
    }

    const calcularNuevaLinea = (x1, y1, x2, y2, lado) => {
        let distancia = 12;
        let short = 22;
        if (lado === 0) {
            distancia = -distancia;
            short = -short;
        }
        let points = findParallelLine(x1, y1, x2, y2, distancia);
        points = shortenLine(...points, short, lado);
        return points;
    }

    const calcularPunto = (linea1, linea2, lado) => {
        let posición = 11;
        if (lado === 0) {
            posición = -posición;
        }

        let y = linea2[1];
        if (linea1[1] > linea1[3]) {
            y = linea1[1];
        }
        if (lado === 1) {
            y = y - 12;
        }
        if (lado === 3) {
            y = linea1[1];
        }
        let punto = [linea1[0] + posición, y];
        return punto;
    }

    const obtenerTexto = () => {
        if ((figuraA.type === "atributo") && (text === "1..1"))
            return "";
        return text;
    }

    const [line, lado] = calcularLinea()
    const nuevaLinea = calcularNuevaLinea(...line, lado);
    const punto = calcularPunto(line, nuevaLinea, lado);

    return (
        <>
            <Line
                points={line}
                stroke="black"
                strokeWidth={1}
            />
            {
                ((figuraA.type === "entidad") || (figuraA.type === "atributo")) &&
                (
                    <Text
                        //text={text != "1..1" ? text : ""}
                        text={obtenerTexto()}
                        align="center"
                        verticalAlign="center"
                        fontSize={12}
                        x={punto[0]}
                        y={punto[1]}
                        fill="black"
                        width={22}
                        offsetX={11}
                    />
                )
            }
            {
                figuraA.type === "atributo" &&
                (
                    <Circle
                        x={line[0]}
                        y={line[1]}
                        radius={5}
                        stroke="black"
                        strokeWidth={1}
                        fill={figuraA.clavePrimaria === true ? "black" : "white"}
                    />
                )
            }
        </>
    );
};

export default Linea;