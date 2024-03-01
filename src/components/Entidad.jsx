import { Group, Rect, Text } from "react-konva";

const Entidad = ({ x, y, text, onDragMove, onDragEnd, onDblClick }) => {
    let width = (text.length * 6.15) + 20;
    return (
        <Group x={x} y={y} draggable onDragMove={onDragMove} onDragEnd={onDragEnd} onDblClick={onDblClick}>
            <Rect
                width={width}
                height={30}
                fill="yellow"
                offsetX={width / 2}
                offsetY={30 / 2}
                stroke="#000000"
                strokeWidth={2}
            />
            <Text
                width={width}
                text={text}
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

const calcularOffsetEntidad = (componente) => {
    let width = (componente.text.length * 6.15) + 20;
    return [
        { x: -(width / 2), y: 0 },
        { x: 0, y: -(30 / 2) },
        { x: (width / 2), y: 0 },
        { x: 0, y: (30 / 2) },
    ];
}

export default Entidad;
export { calcularOffsetEntidad };