import React, { useState, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Linea from './Linea';
import Componente from './Componente';

const Diagrama = ({ cb, modo }) => {
    const stageRef = useRef(null);
    const [componentes, setComponentes] = useState([
        { x: 100, y: 100, type: "Entidad", text: "entidad1" },
        { x: 300, y: 100, type: "Relacion", text: "relacion" },
        { x: 500, y: 100, type: "Entidad", text: "entidad2" },
        { x: 500, y: 200, type: "Atributo", text: "atributo 1" },
        { x: 500, y: 300, type: "Atributo", text: "atributo 2", clavePrimaria: true },

    ]);

    const [enlaces, setEnlaces] = useState([
        { idPrimero: 0, idSegundo: 1, text: "1..n" },
        { idPrimero: 2, idSegundo: 1, text: "1..n" },
        { idPrimero: 3, idSegundo: 2 },
        { idPrimero: 4, idSegundo: 2 }
    ])

    const handleDragMove = (e, key) => {
        const newComponents = [...componentes];
        newComponents[key] = {
            ...newComponents[key],
            x: e.target.x(),
            y: e.target.y()
        };
        setComponentes(newComponents);
    };

    /* const handleDoubleClick = (e, id) => {
        var componentesCopy = [...componentes];
        componentesCopy[id] = {
            ...componentesCopy[id],
            text: "otra cosa"
        }
        setComponentes(componentesCopy);
    } */

    const handleClick = (e) => {
        if (modo == "añadir entidad") {
            const stage = stageRef.current;
            const pos = stage.getPointerPosition();

            if (pos) {
                const { x, y } = pos;
                createEntity(x, y);

            }
            cb("normal");
        }
    }

    const createEntity = (x, y) => {
        const entidad = { x, y, type: "Entidad", text: "entidad" };
        setComponentes([...componentes, entidad]);
    }
    return (
        <Stage width={700} height={700} onClick={handleClick} ref={stageRef}>
            <Layer>

                {componentes.map((componente, index) => (
                    <Componente
                        key={index}
                        type={componente.type}
                        x={componente.x}
                        y={componente.y}
                        text={componente.text}
                        clavePrimaria={componente.clavePrimaria}
                        onDragMove={(e) => handleDragMove(e, index)}
                        onDragEnd={(e) => handleDragMove(e, index)}
/*                         onDblClick={(e) => handleDoubleClick(e, index)}
 */                    />
                ))}

                {enlaces.map((enlace, index) => (
                    <Linea
                        key={index}
                        figuraA={componentes[enlace.idPrimero]}
                        figuraB={componentes[enlace.idSegundo]}
                        text={enlace.text}
                    />
                ))}
            </Layer>
        </Stage>
    );
}

export default Diagrama;
