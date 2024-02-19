import { Group, Rect, Text } from "react-konva";

const Entidad = ({ x, y, width, height, text, onDragMove, onDragEnd, onDblClick }) => {
    return (
        <Group x={x} y={y} draggable onDragMove={onDragMove} onDragEnd={onDragEnd} onDblClick={onDblClick}>
            <Rect
                width={width}
                height={height}
                fill="yellow"
                offsetX={width / 2}
                offsetY={height / 2}
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
            />
        </Group>
    );
};

const calcularOffsetEntidad = (componente) => {
    return [
        { x: -(componente.width / 2), y: 0 },
        { x: 0, y: -(componente.height / 2) },
        { x: (componente.width / 2), y: 0 },
        { x: 0, y: (componente.height / 2) },
    ];
}


export default Entidad;
export { calcularOffsetEntidad };