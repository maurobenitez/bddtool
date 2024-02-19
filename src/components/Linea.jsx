import { Line } from "react-konva";
import componentes from ".";

const Linea = ({ figuraA, figuraB }) => {
    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    const calcularLinea = () => {
        const offsetFiguraA = componentes[figuraA.type].funcionOffset(figuraA);
        const offsetFiguraB = componentes[figuraB.type].funcionOffset(figuraB);
        var min_distance = Number.MAX_SAFE_INTEGER;
        var min_points = [];
        for (var i = 0; i <= 3; i++) {
            var points = [
                figuraA.x + offsetFiguraA[i].x,
                figuraA.y + offsetFiguraA[i].y,
                figuraB.x + offsetFiguraB[i].x,
                figuraB.y + offsetFiguraB[i].y
            ];
            var distance = calculateDistance(...points);
            if (distance < min_distance) {
                min_distance = distance;
                min_points = points;
            }
        }

        return min_points;
    }

    const line = calcularLinea()
    return (
        <Line
            points={line}
            stroke="black"
            strokeWidth={2}
        />
    );
};

export default Linea;