import { Group, Rect, Text, Ellipse } from "react-konva";

const AtributoCompuesto = ({ x, y, nombre, onDragMove, onDragEnd, onDblClick }) => {
    let width = (nombre.length * 6.15) + 20;
    return (
        <Group x={x} y={y} draggable onDragMove={onDragMove} onDragEnd={onDragEnd} onDblClick={onDblClick}>
            <Ellipse
                width={width}
                height={30}
                fill="yellow"
                radiusX={width / 2}
                radiusY={width / 4}
                stroke="#000000"
                strokeWidth={1}
            />
            <Text
                width={width}
                text={nombre}
                fontSize={12}
                fill="black"
                offsetX={width / 2}
                offsetY={6}
                align="center"
                fontFamily="Ubuntu mono"
            />
        </Group>
    );
};

const calcularOffsetAtributoCompuesto = (componente) => {
    let width = (componente.nombre.length * 6.15) + 20;
    return [
        { x: -(width / 2), y: 0 },
        { x: 0, y: -(30 / 2) },
        { x: (width / 2), y: 0 },
        { x: 0, y: (30 / 2) },
    ];
}

export default AtributoCompuesto;
export { calcularOffsetAtributoCompuesto };