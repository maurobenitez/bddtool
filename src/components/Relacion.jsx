import { Group, Rect, Text } from "react-konva";

const Relacion = ({ x, y, text, onDragMove, onDragEnd, onDblClick }) => {
    let width = (text.length * 6.15);
    let cantLineas = (width - (width % 50)) / 50;
    cantLineas = width % 50 > 0 ? ++cantLineas : cantLineas;
    width = width < 50 ? width : 50;
    return (
        <Group x={x} y={y} draggable onDragMove={onDragMove} onDragEnd={onDragEnd} onDblClick={onDblClick}>
            <Rect
                width={width}
                height={width}
                fill="yellow"
                rotation={45}
                offsetX={width / 2}
                offsetY={width / 2}
                stroke="#000000"
                strokeWidth={2}
            />
            <Text
                width={width}
                text={text}
                fontSize={12}
                fill="black"
                offsetX={width / 2}
                offsetY={6 * cantLineas}
                align="center"
                fontFamily="Ubuntu mono"
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
    let size = 50;
    return [
        { x: (calculateHypotenuse(size)) / 2, y: 0 },
        { x: 0, y: (calculateHypotenuse(size)) / 2 },
        { x: -(calculateHypotenuse(size)) / 2, y: 0 },
        { x: 0, y: -(calculateHypotenuse(size)) / 2 }
    ]
}

export { calcularOffsetRelacion };

export default Relacion;

