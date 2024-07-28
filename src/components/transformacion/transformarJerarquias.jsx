import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { manageElements, createElement, closeModal, deleteHierarchy, saveState } from '../../redux/logicModelSlice';

const TransformarJerarquias = ({ isOpen }) => {

    const entidades = useSelector(state => state.logicDiagram.estadoActual.entidades);
    const relaciones = useSelector(state => state.logicDiagram.estadoActual.relaciones);

    const [selectedOption, setSelectedOption] = useState({
        option: "option1"
    });

    const [jerarquia, setJerarquia] = useState({});
    const dispatch = useDispatch();

    const getJerarquía = () => {
        if (isOpen) {
            var jerarquía1 = entidades.find(entidad => entidad.subType && entidad.subType === "padre");
            if (jerarquía1 === undefined) {
                setJerarquia({});
            } else {
                var disabled = false;
                if ((jerarquía1.cobertura === "P,E") || (jerarquía1.cobertura === "P,S")) {
                    disabled = true;
                }
                setJerarquia({ id: jerarquía1.id, disabled });
            }
        }
    };
    useEffect(getJerarquía, [isOpen]);


    const toggleDialog = () => {
        var dialog = document.getElementById("transformarJerarquias");
        if (isOpen === true) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }

    useEffect(toggleDialog, [isOpen]);

    const close = () => {
        document.getElementById("transformarJerarquiasForm").reset();
        dispatch(closeModal());
    }

    const existeEntidadEnRelacion = (idEntidad, relacion) => {
        const entidades = relacion.entidades;
        var existeEntidad = false;
        entidades.forEach(entidad => {
            if (entidad.id === idEntidad) existeEntidad = true;
        })
        return existeEntidad;
    }
    const buscarRelaciones = (idEntidad) => {
        const relacionesEncontradas = [];
        relaciones.forEach(relacion => {
            if (existeEntidadEnRelacion(idEntidad, relacion)) {
                relacionesEncontradas.push(relacion.id);
            }
        });
        return relacionesEncontradas;
    }
    const transformacionJerarquia1 = ({ id }) => {
        dispatch(deleteHierarchy({ id }));
        const entidadesHija = entidades.find(entidad => entidad.id === id).hijos;
        console.log(entidadesHija);
        var atributosEntidad = [];
        entidadesHija.forEach(idEntidad => {
            atributosEntidad.push(...entidades.find(entidad => entidad.id === idEntidad).atributos);
            dispatch(manageElements({ id: idEntidad, type: "entidad", operation: "borrar" }));
        })
        const moverAtributos = { values: { atributos: atributosEntidad }, type: "entidad", id };
        dispatch(manageElements(moverAtributos));
    }

    const transformacionJerarquia2 = ({ id }) => {
        dispatch(deleteHierarchy({ id }));
        const entidadPadre = entidades.find(entidad => entidad.id === id);
        const entidadesHija = entidadPadre.hijos;
        entidadesHija.forEach(idEntidadHija => {
            var entidadHija = entidades.find(entidad => entidad.id === idEntidadHija);
            const entidadesRelacion = [
                {
                    id: id,
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: 1,
                },
                {
                    id: idEntidadHija,
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: 1,
                }
            ];

            const data = { x: (entidadPadre.x + entidadHija.x) / 2, y: (entidadPadre.y + entidadHija.y) / 2, nombre: `ES UN ${entidadHija.nombre}`, entidades: entidadesRelacion };

            dispatch(createElement({ elementData: data, type: "relacion" }));
        })

    }
    const transformacionJerarquia3 = ({ id }) => {
        dispatch(deleteHierarchy({ id }));
        const entidadPadre = entidades.find(entidad => entidad.id === id);
        const entidadesHija = entidadPadre.hijos;
        const atributos = entidadPadre.atributos;
        const borrarEntidad = { id, type: "entidad", operation: "borrar" };
        dispatch(manageElements(borrarEntidad));
        const relacionesEncontradas = buscarRelaciones(id);
        relacionesEncontradas.forEach(relacion => {
            let relacionABorrar = { id: relacion, type: "relacion", operation: "borrar" };
            dispatch(manageElements(relacionABorrar));
        });

        atributos.forEach(atributo => {
            var coordenadas = { x: atributo.x - entidadPadre.x, y: atributo.y - entidadPadre.y };
            entidadesHija.forEach(entidadId => {
                var entidadHija = entidades.find(entidad => entidad.id === entidadId);
                var elementData = {
                    x: entidadHija.x + coordenadas.x, y: entidadHija.y + coordenadas.y, nombre: atributo.nombre, clavePrimaria: atributo.clavePrimaria, cardinalidadMinima: 1,
                    cardinalidadMaxima: 1
                };
                if (atributo.cardinalidadMinima !== undefined) {
                    elementData.cardinalidadMinima = atributo.cardinalidadMinima;
                    elementData.cardinalidadMaxima = atributo.cardinalidadMaxima;
                }
                dispatch(createElement({ elementData, type: "atributo", idc: "-1", id: entidadId }))
            })
        })

    }
    const transformarJerarquia = ({ id }, tipo) => {
        dispatch(saveState());
        if (tipo === "option1") {
            transformacionJerarquia1({ id });
        } else if (tipo === "option2") {
            transformacionJerarquia2({ id });
        } else if (tipo === "option3") {
            transformacionJerarquia3({ id });
        }


    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(jerarquia);
        transformarJerarquia(jerarquia, selectedOption.option);
        close();
    }

    const handleOptionChange = (event) => {
        const { value } = event.target;
        setSelectedOption({ ...selectedOption, option: value });
    };
    return (
        <>
            <dialog id="transformarJerarquias" className="modal" onClose={close}>
                <h1>
                    Transformar jerarquía
                </h1>
                <form method="post" onSubmit={handleSubmit} id="transformarJerarquiasForm">
                    <label>
                        <input type="radio" name="option" value="option1" onChange={handleOptionChange} checked={selectedOption.option === "option1"} />
                        Eliminar las entidades hijas
                    </label><br />
                    <label>
                        <input type="radio" name="option" value="option2" onChange={handleOptionChange} checked={selectedOption.option === "option2"} />
                        Conservar todas las entidades
                    </label><br />
                    <label>
                        <input type="radio" name="option" value="option3" onChange={handleOptionChange} checked={selectedOption.option === "option3"} disabled={jerarquia.disabled == true} />
                        Eliminar la entidad padre
                        {
                            jerarquia.disabled &&
                            <>
                                (no aplicable para cobertura parcial)
                            </>
                        }
                    </label><br /><br />
                    <input type="submit" value="Aceptar" id="closeModal" className="modal-close-btn" />
                </form>
            </dialog>
        </>
    );
}

export default TransformarJerarquias;