import { Group, Text } from "react-konva";

const Atributo = ({ x, y, text, onDragMove, onDragEnd, onDblClick }) => {
    let width = (text.length * 6.15) + 15;
    return (
        <Group x={x} y={y} draggable onDragMove={onDragMove} onDragEnd={onDragEnd} onDblClick={onDblClick}>
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

const calcularOffsetAtributo = (componente) => {
    let width = (componente.text.length * 6.15) + 15;
    return [
        { x: -(width / 2), y: 0 },
        { x: 0, y: -(componente.height / 2) },
        { x: (width / 2), y: 0 },
        { x: 0, y: (componente.height / 2) },
    ];
}


export default Atributo;
export { calcularOffsetAtributo };