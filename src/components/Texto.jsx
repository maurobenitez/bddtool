import { Group, Rect, Text } from "react-konva";

const Texto = ({ x, y, text }) => {
    return (

        <Text
            x={x}
            y={y}
            width={100}
            text={text}
            fontSize={16} // Customize font size as needed
            fill="black" // Customize text color as you like
            offsetX={100 / 2}
            offsetY={8}
            align="center"
        />

    );
};

export default Texto;