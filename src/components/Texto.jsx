import { useState } from "react";
import { Group, Rect, Text } from "react-konva";

const Texto = ({ x, y }) => {

    const [text, setText] = useState('Double click to edit');
    const [isEditing, setIsEditing] = useState(false);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setText(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };
    return (
        <>
            <Text
                width={100}
                x={100}
                y={400}
                text={text}
                fontSize={16}
                fill="black"
                offsetX={100 / 2}
                offsetY={8}
                align="center"
                onDblClick={handleDoubleClick}
            />
            {isEditing && (
                <Rect
                    x={100}
                    y={400}
                    width={text.length * 15}
                    height={30}
                    fill="white"
                    shadowBlur={5}
                />
            )}
            {isEditing && (
                <textarea
                    x={100}
                    y={400}
                    autoFocus
                    defaultValue={text}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                        position: 'absolute',
                        left: 25,
                        top: 25,
                        fontSize: '30px',
                        fontFamily: 'Arial',
                        border: 'none',
                        padding: 0,
                        margin: 0,
                        width: text.length * 15,
                        height: 30,
                    }}
                />
            )}
        </>

    );
};

export default Texto;