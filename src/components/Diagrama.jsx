import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import Linea from './Linea';
import Entidad from './Entidad';
import Relacion from './Relacion';
import Atributo from './Atributo';
import AtributoCompuesto from './AtributoCompuesto';
import { useSelector, useDispatch } from 'react-redux';
import { manageElements } from '../redux/diagramSlice';
import { setPosition, openDialog, openEditOrDelete } from '../redux/modalSlice';

import IdentificadorCompuesto from './IdentificadorCompuesto';
import Jerarquía from './Jerarquía';

const Diagrama = ({ cb, modo }) => {
    const stageRef = useRef(null);
    const entidades = useSelector((state) => state.diagram.entidades);
    const relaciones = useSelector((state) => state.diagram.relaciones);

    const dispatch = useDispatch();

    const [enlaces, setEnlaces] = useState([]);

    const crearEnlace = (primero, segundo) => {
        return {
            primero,
            segundo,
            text:
                primero.cardinalidadMinima ?
                    primero.cardinalidadMinima
                    + ".."
                    + primero.cardinalidadMaxima
                    :
                    ""
        }
    }
    const getEntidadesPadre = () => {
        const listaEntidadesPadre = entidades.filter((entidad) => entidad.subType === "padre");
        return listaEntidadesPadre;
    }
    const getEntidad = (idEntidad) => {
        const entidad = entidades.find((entidad) => entidad.id === idEntidad);
        return entidad;
    }

    const getEntidadesHijo = (idEntidadPadre) => {
        const entidadPadre = getEntidad(idEntidadPadre);
        const listaIdEntidadesHijo = entidadPadre.hijos;
        const listaEntidadesHijo = listaIdEntidadesHijo.map(id => getEntidad(id));
        return listaEntidadesHijo;
    }

    const getAnchoEntidad = (idEntidad) => {
        const entidad = getEntidad(idEntidad);
        const anchoEntidad = (entidad.nombre.length * 6.15) + 20;
        return anchoEntidad;
    }

    const sumarAnchoEntidades = (entidades) => {
        var sumarAnchoEntidades = (entidades.length - 1) * 10;
        entidades.forEach(entidad => {
            let anchoEntidad = getAnchoEntidad(entidad.id);
            sumarAnchoEntidades += anchoEntidad;
        })
        return sumarAnchoEntidades;
    }

    const getPuntoInicio = (entidadPadre) => {
        const { x, y } = entidadPadre;
        const entidadesHijo = getEntidadesHijo(entidadPadre.id);
        const sumarAnchoEntidadesHijo = sumarAnchoEntidades(entidadesHijo);
        const newY = y + 75;
        const newX = x - (sumarAnchoEntidadesHijo / 2);
        return { x: newX, y: newY };
    }

    const getCentroEntidad = (entidadHijo, puntoInicio) => {
        const anchoEntidad = getAnchoEntidad(entidadHijo.id);
        const centroEntidad = (anchoEntidad / 2) + puntoInicio.x;
        return { x: centroEntidad, y: puntoInicio.y };
    }

    const ajustarEntidadesHijo = (entidadPadre) => {
        const entidadesHijo = getEntidadesHijo(entidadPadre.id);
        var puntoInicio = getPuntoInicio(entidadPadre);
        entidadesHijo.forEach((entidadHijo) => {
            let centroEntidadHijo = getCentroEntidad(entidadHijo, puntoInicio);
            dispatch(manageElements({ values: centroEntidadHijo, id: entidadHijo.id, type: "entidad" }));
            puntoInicio.x += getAnchoEntidad(entidadHijo.id) + 10;
        });
    };

    const ajustarTodasEntidadesHijo = () => {
        const entidadesPadre = getEntidadesPadre();
        entidadesPadre.forEach(entidadPadre => {
            ajustarEntidadesHijo(entidadPadre);
        })
    };

    const crearEnlaces = () => {
        const e = [];
        //crea enlaces entre atributos y entidades
        entidades.forEach(entidad => {
            entidad.atributos && entidad.atributos.forEach(atributo => {
                e.push(crearEnlace(atributo, entidad));
            });
        });
        //crea enlaces entre identificadores compuestos y entidades
        entidades.forEach(entidad => {
            if (entidad.identificadorCompuesto) {
                entidad.identificadorCompuesto.forEach(atributo => {
                    if (atributo.type !== "externo")
                        e.push(crearEnlace(atributo, entidad));
                });
            }
        });
        //crea enlaces entre relaciones y entidades
        relaciones.forEach(relacion => {
            relacion.entidades.forEach((ent) => {
                let en = {
                    ...entidades.find(entidad => entidad.id === ent.id),
                    ...ent
                };
                e.push(crearEnlace(en, relacion));
            })
        });
        //crea enlaces entre los atributos compuestos y las entidades, 
        //y entre los atributos y los atributos compuestos
        entidades.forEach(entidad => {
            entidad.atributosCompuestos && entidad.atributosCompuestos.forEach(atributoCompuesto => {
                e.push(crearEnlace(atributoCompuesto, entidad));
                atributoCompuesto.atributos && atributoCompuesto.atributos.forEach(atributo => {
                    e.push(crearEnlace(atributo, atributoCompuesto));
                })
            });
        });
        setEnlaces(e);
    }
    useEffect(crearEnlaces, [entidades, relaciones]);
    useEffect(ajustarTodasEntidadesHijo, [entidades, relaciones]);

    const handleDragMove = (e, id, type, idAttribute = -1, idc = -1) => {
        dispatch(
            manageElements({
                id,
                type,
                values: {
                    x: e.target.x(),
                    y: e.target.y(),
                },
                idAttribute,
                idc
            })
        )
        crearEnlaces();
        ajustarTodasEntidadesHijo();
    };

    const handleClick = (e) => {
        if (modo !== "normal") {
            const stage = stageRef.current;
            const pos = stage.getPointerPosition();

            if (pos) {
                const { x, y } = pos;
                dispatch(setPosition({ x, y }));
                dispatch(openDialog({ dialogType: modo }));
            }
        }
        cb("normal");
    }

    const handleDblClick = (e, idEntidad, tipo, nombre, idAttribute = -1, idc = -1) => {
        const element = { id: idEntidad, type: tipo, nombre, idAttribute, idc };
        dispatch(openEditOrDelete({ element }));
    }

    return (
        <Stage width={window.innerWidth} height={window.innerHeight} onClick={handleClick} ref={stageRef}>
            <Layer>
                {/* renderizar lineas */}
                {enlaces.map((enlace, index) => (
                    <Linea
                        key={index}
                        figuraA={enlace.primero}
                        figuraB={enlace.segundo}
                        text={enlace.text}
                    />
                ))}
                {/* renderizar entidades */}
                {entidades.map((entidad) =>
                    ((entidad.subType !== "hijo") && (entidad.subType !== "padre")) &&
                    <Entidad
                        key={"e" + entidad.id}
                        x={entidad.x}
                        y={entidad.y}
                        nombre={entidad.nombre}
                        onDragMove={(e) => handleDragMove(e, entidad.id, "entidad")}
                        onDragEnd={(e) => handleDragMove(e, entidad.id, "entidad")}
                        onDblClick={(e) => handleDblClick(e, entidad.id, "entidad", entidad.nombre)}
                    />
                )}
                {/* renderizar entidades padre */}
                {entidades.map((entidad) =>
                    (entidad.subType === "padre") &&
                    <Entidad
                        key={"e" + entidad.id}
                        x={entidad.x}
                        y={entidad.y}
                        nombre={entidad.nombre}
                        onDragMove={(e) => handleDragMove(e, entidad.id, "entidad")}
                        onDragEnd={(e) => handleDragMove(e, entidad.id, "entidad")}
                        onDblClick={(e) => handleDblClick(e, entidad.id, "jerarquía", entidad.nombre)}
                    />
                )}
                {/* renderizar entidades hijo de jerarquías */}
                {entidades.map((entidad) =>
                    (entidad.subType === "hijo") &&
                    <Entidad
                        key={"e" + entidad.id}
                        x={entidad.x}
                        y={entidad.y}
                        nombre={entidad.nombre}
                        draggable={false}
                    />

                )}
                {/* renderizar jerarquías */}
                {entidades.map((entidad) =>
                    (entidad.subType === "padre") &&
                    <Jerarquía
                        key={"j" + entidad.id}
                        id={entidad.id}
                    />

                )}
                {/* renderizar atributos */}
                {
                    entidades.map((entidad) =>
                        entidad.atributos && entidad.atributos.map((atributo) => (
                            <Atributo
                                key={entidad.id + "-" + atributo.id}
                                x={atributo.x}
                                y={atributo.y}
                                nombre={atributo.nombre}
                                onDragMove={(e) => handleDragMove(e, entidad.id, "atributo", atributo.id)}
                                onDragEnd={(e) => handleDragMove(e, entidad.id, "atributo", atributo.id)}
                                onDblClick={(e) => handleDblClick(e, entidad.id, "atributo", entidad.nombre, atributo.id)}
                            />
                        ))
                    )
                }
                {/* renderizar atributos de identificador compuesto */}
                {
                    entidades.map((entidad) =>
                        entidad.identificadorCompuesto && entidad.identificadorCompuesto.map((atributo) => (
                            atributo.type !== "externo" &&
                            <>
                                <Atributo
                                    key={"c" + entidad.id + "-" + atributo.id}
                                    x={atributo.x}
                                    y={atributo.y}
                                    nombre={atributo.nombre}
                                    onDragMove={(e) => handleDragMove(e, entidad.id, "identificador compuesto", atributo.id)}
                                    onDragEnd={(e) => handleDragMove(e, entidad.id, "identificador compuesto", atributo.id)}
                                />
                                <IdentificadorCompuesto entidad={entidad} />
                            </>
                        ))
                    )
                }

                {/* renderizar atributos compuestos */}
                {
                    entidades.map((entidad) =>
                        entidad.atributosCompuestos && entidad.atributosCompuestos.map((atributoCompuesto) => (
                            <AtributoCompuesto
                                key={"ac" + entidad.id + "-" + atributoCompuesto.id}
                                x={atributoCompuesto.x}
                                y={atributoCompuesto.y}
                                nombre={atributoCompuesto.nombre}
                                onDragMove={(e) => handleDragMove(e, entidad.id, "atributo compuesto", atributoCompuesto.id)}
                                onDragEnd={(e) => handleDragMove(e, entidad.id, "atributo compuesto", atributoCompuesto.id)}
                            />
                        ))
                    )
                }
                {/* renderizar atributos de atributos compuestos */}
                {
                    entidades.map((entidad) =>
                        entidad.atributosCompuestos && entidad.atributosCompuestos.map((atributoCompuesto) => (
                            atributoCompuesto.atributos && atributoCompuesto.atributos.map((atributo) => (
                                <Atributo
                                    key={entidad.id + "-" + atributo.id}
                                    x={atributo.x}
                                    y={atributo.y}
                                    nombre={atributo.nombre}
                                    onDragMove={(e) => handleDragMove(e, entidad.id, "atributo", atributo.id, atributoCompuesto.id)}
                                    onDragEnd={(e) => handleDragMove(e, entidad.id, "atributo", atributo.id, atributoCompuesto.id)}
                                />
                            ))
                        ))
                    )
                }
                {/* renderizar relaciones */}
                {
                    relaciones.map((relacion) => (
                        <Relacion
                            key={"r" + relacion.id}
                            x={relacion.x}
                            y={relacion.y}
                            nombre={relacion.nombre}
                            onDragMove={(e) => handleDragMove(e, relacion.id, "relacion")}
                            onDragEnd={(e) => handleDragMove(e, relacion.id, "relacion")}
                            onDblClick={(e) => handleDblClick(e, relacion.id, "relacion", relacion.nombre)}
                        />
                    ))
                }

            </Layer>
        </Stage>
    );
}

export default Diagrama;
