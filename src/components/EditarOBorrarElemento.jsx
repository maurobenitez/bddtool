import React, { useEffect } from 'react';
import { manageElements, deleteHierarchy } from '../redux/diagramSlice';
import { useDispatch, useSelector } from 'react-redux';
import { openDialog, closeEditOrDelete } from '../redux/modalSlice';

const EditarOBorrarElemento = ({ isOpen, element }) => {

    const dispatch = useDispatch();

    const relaciones = useSelector(state => state.diagram.relaciones);
    const entidades = useSelector(state => state.diagram.entidades);

    const toggleDialog = () => {
        var dialog = document.getElementById("editarOBorrarElemento");
        if (isOpen === true) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }

    useEffect(toggleDialog, [isOpen]);

    const esSubEntidad = (idEntidad) => {
        var e = "";
        entidades.forEach(entidad => {
            if (idEntidad === entidad.id) e = entidad;
        })
        if (e === "") return false;
        return e.subType === "hijo";
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

    const esHijo = (idEntidadHijo, entidadPadre) => {
        var h = false;
        entidadPadre.hijos.forEach(hijo => {
            if (hijo === idEntidadHijo) h = true;
        })
        return h;
    }

    const buscarEntidadPadre = (idSubEntidad) => {
        var entidadPadre = "";
        entidades.forEach(entidad => {
            if (entidad.subType === "padre") {
                if (esHijo(idSubEntidad, entidad)) {
                    entidadPadre = entidad;
                }
            }
        })
        return entidadPadre;
    }

    const eliminarDeJerarquía = (idSubEntidad) => {
        const entidadPadre = buscarEntidadPadre(idSubEntidad);
        const hijos = entidadPadre.hijos.filter(hijo => hijo !== idSubEntidad);
        const values = { hijos };
        dispatch(manageElements({ values, id: entidadPadre.id, type: "entidad" }));
    }

    const editarElemento = () => {
        dispatch(openDialog({ dialogType: element.dialogType, element }));
    }

    const borrarElemento = () => {
        if (element.dialogType !== "jerarquía") {
            if (element.type === "entidad") {
                const relacionesEncontradas = buscarRelaciones(element.id);
                relacionesEncontradas.forEach(relacion => {
                    let relacionABorrar = { id: relacion, type: "relacion", operation: "borrar" };
                    dispatch(manageElements(relacionABorrar));
                })
                if (esSubEntidad(element.id)) {
                    eliminarDeJerarquía(element.id);
                }
            }
            const elementoABorrar = { ...element, operation: "borrar" };
            dispatch(manageElements(elementoABorrar));
        } else {
            dispatch(deleteHierarchy({ ...element }));
        }
    }

    const handleOnClose = () => {
        dispatch(closeEditOrDelete());
    }

    const handleClickBorrar = (e) => {
        borrarElemento();
        dispatch(closeEditOrDelete());
    };

    const handleClickEditar = (e) => {
        editarElemento();
        dispatch(closeEditOrDelete());
    }

    return (
        <>
            <dialog id="editarOBorrarElemento" className="modal" onClose={handleOnClose}>
                <h1>{element.type}: {element.nombre}</h1>
                <button id="editar" onClick={handleClickEditar}>Editar</button>
                <button id="borrar" onClick={handleClickBorrar}>Borrar</button>
            </dialog>
        </>
    );
}

export default EditarOBorrarElemento;