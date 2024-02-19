import Entidad from "./Entidad";
import Relacion from "./Relacion";

const Componente = ({ type, x, y, width, height, size, text, onDragMove, onDragEnd, onDblClick }) => {
    return (
        <>
            {type === 'Entidad' &&
                <Entidad x={x} y={y} width={width} height={height} text={text}
                    onDragMove={onDragMove}
                    onDragEnd={onDragEnd}
                    onDblClick={onDblClick}
                />
            }
            {type === 'Relacion' &&
                <Relacion x={x} y={y} size={size} text={text}
                    onDragMove={onDragMove}
                    onDragEnd={onDragEnd}
                    onDblClick={onDblClick}
                />
            }
        </>


    );
};

export default Componente;