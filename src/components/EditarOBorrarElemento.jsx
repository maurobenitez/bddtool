import React, { useState, useEffect } from 'react';
import { manageElements, deleteHierarchy } from '../redux/diagramSlice';
import { useDispatch } from 'react-redux';
import { openDialog, closeEditOrDelete } from '../redux/modalSlice';

const EditarOBorrarElemento = ({ isOpen, element }) => {

    const dispatch = useDispatch();

    const toggleDialog = () => {
        var dialog = document.getElementById("editarOBorrarElemento");
        if (isOpen === true) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }

    useEffect(toggleDialog, [isOpen]);

    const handleOnClose = () => {
        dispatch(closeEditOrDelete());
    }

    const borrarElemento = () => {
        if (element.type !== "jerarquía") {
            const elementoABorrar = { ...element, operation: "borrar" };
            dispatch(manageElements(elementoABorrar));
        } else {
            dispatch(deleteHierarchy({ id: element.id }));
        }
    }

    const handleClickBorrar = (e) => {
        borrarElemento();
        dispatch(closeEditOrDelete());
    };

    const handleClickEditar = (e) => {
        dispatch(openDialog({ dialogType: element.type, element }));
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