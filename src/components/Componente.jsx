import Entidad from "./Entidad";
import Relacion from "./Relacion";
import Atributo from "./Atributo";

const Componente = ({ type, x, y, text, clavePrimaria, onDragMove, onDragEnd, onDblClick }) => {

    return (
        <>
            {type === 'Entidad' &&
                <Entidad x={x} y={y} text={text}
                    onDragMove={onDragMove}
                    onDragEnd={onDragEnd}
                    onDblClick={onDblClick}
                />
            }
            {type === 'Relacion' &&
                <Relacion x={x} y={y} text={text}
                    onDragMove={onDragMove}
                    onDragEnd={onDragEnd}
                    onDblClick={onDblClick}
                />
            }
            {type === 'Atributo' &&
                <Atributo x={x} y={y} text={text} clavePrimaria={clavePrimaria}
                    onDragMove={onDragMove}
                    onDragEnd={onDragEnd}
                    onDblClick={onDblClick}
                />
            }
        </>
    );
};

export default Componente;