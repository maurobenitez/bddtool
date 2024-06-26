import { Group, Rect, Text } from "react-konva";

const Entidad = ({ x, y, nombre, onDragMove, onDragEnd, onDblClick, draggable }) => {
    let width = (nombre.length * 6.15) + 20;
    return (
        <Group x={x} y={y} draggable={draggable == null ? true : false} onDragMove={onDragMove} onDragEnd={onDragEnd} onDblClick={onDblClick}>
            <Rect
                width={width}
                height={30}
                fill="yellow"
                offsetX={width / 2}
                offsetY={30 / 2}
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

const calcularOffsetEntidad = (componente) => {
    let width = (componente.nombre.length * 6.15) + 20;
    return [
        { x: -(width / 2), y: 0 },
        { x: 0, y: -(30 / 2) },
        { x: (width / 2), y: 0 },
        { x: 0, y: (30 / 2) },
    ];
}

export default Entidad;
export { calcularOffsetEntidad };