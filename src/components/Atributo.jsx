import { Group, Text } from "react-konva";

const Atributo = ({ x, y, nombre, onDragMove, onDragEnd, onDblClick }) => {
    let width = (nombre.length * 6.15) + 15;
    return (
        <Group x={x} y={y} draggable onDragMove={onDragMove} onDragEnd={onDragEnd} onDblClick={onDblClick}>
            <Text
                width={width}
                text={nombre}
                fontSize={12}
                fill="black"
                offsetX={width / 2}
                offsetY={6}
                align="center"
                verticalAlign="center"
                fontFamily="Ubuntu mono"

            />
        </Group>
    );
};

const calcularOffsetAtributo = (componente) => {
    let width = (componente.nombre.length * 6.15) + 15;
    let height = 24;
    return [
        { x: -(width / 2), y: 0 },
        { x: 0, y: -(height / 2) },
        { x: (width / 2), y: 0 },
        { x: 0, y: (height / 2) },
    ];
}


export default Atributo;
export { calcularOffsetAtributo };