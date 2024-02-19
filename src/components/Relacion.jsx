import { Group, Rect, Text } from "react-konva";

const Relacion = ({ x, y, size, text, onDragMove, onDragEnd, onDblClick }) => {
    return (
        <Group x={x} y={y} draggable onDragMove={onDragMove} onDragEnd={onDragEnd} onDblClick={onDblClick}>
            <Rect
                width={size}
                height={size}
                fill="yellow"
                rotation={45}
                offsetX={size / 2}
                offsetY={size / 2}
                stroke="#000000"
                strokeWidth={2}
            />
            <Text
                width={size}
                text={text}
                fontSize={12}
                fill="black"
                offsetX={size / 2}
                offsetY={6}
                align="center"
            />
        </Group>
    );
};

function calculateHypotenuse(a) {
    var aSquared = a * a;
    var bSquared = a * a;
    var sumOfSquares = aSquared + bSquared;
    var hypotenuse = Math.sqrt(sumOfSquares);
    return hypotenuse;
}

const calcularOffsetRelacion = (componente) => {
    return [
        { x: (calculateHypotenuse(componente.size)) / 2, y: 0 },
        { x: 0, y: (calculateHypotenuse(componente.size)) / 2 },
        { x: -(calculateHypotenuse(componente.size)) / 2, y: 0 },
        { x: 0, y: -(calculateHypotenuse(componente.size)) / 2 }
    ]
}

export { calcularOffsetRelacion };

export default Relacion;

