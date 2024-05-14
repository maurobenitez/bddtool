import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../redux/modalSlice';
import { createElement, manageElements } from '../redux/diagramSlice';


const CrearEntidad = ({ isOpen, x, y, element }) => {

    const [nombreEntidad, setNombreEntidad] = useState("");

    const [entidad, setEntidad] = useState(null);

    const [error, setError] = useState(false);

    const dispatch = useDispatch();

    const entidades = useSelector((state) => state.diagram.entidades);

    const toggleDialog = () => {
        var dialog = document.getElementById("crearEntidad");
        if (isOpen === true) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }

    useEffect(toggleDialog, [isOpen]);

    const asignarEntidad = () => {
        if (element !== "") {
            const entidad = entidades.find(entidad => entidad.id === element.id);
            setEntidad(entidad);
            setNombreEntidad(entidad.nombre);
        }
    }

    useEffect(asignarEntidad, [isOpen]);


    const resetForm = () => {
        setNombreEntidad("");
        setError(false);
        document.getElementById("crearEntidadForm").reset();
        dispatch(closeDialog());
    }
    const crearEntidad = () => {
        const elementData = { x, y, nombre: nombreEntidad, atributos: [] };
        dispatch(createElement({ elementData, type: "entidad" }));
    }

    const editarEntidad = () => {
        const values = { nombre: nombreEntidad };
        const idEntidad = entidad.id;
        console.log(idEntidad);
        dispatch(manageElements({ values, id: idEntidad, type: "entidad" }));
    }

    const handleChange = (e) => {
        const { value } = e.target;
        setNombreEntidad(value);
        setError(false);
    };

    function handleSubmit(e) {
        e.preventDefault();
        if (nombreEntidad !== "") {
            if (element === "") {
                crearEntidad();
            } else {
                editarEntidad();
            }
            resetForm();
        } else {
            setError(true);
        }
    }

    return (
        <>
            <dialog id="crearEntidad" className="modal" onClose={resetForm}>
                <h1>
                    {element === "" ? "Crear entidad" : "Editar entidad"}
                </h1>
                <form method="post" onSubmit={handleSubmit} id="crearEntidadForm">
                    <label>
                        Nombre:
                    </label>
                    <input name="nombreEntidad" onChange={handleChange} value={nombreEntidad} />
                    <br />
                    {error &&
                        <>
                            <span className="error-message">El nombre de la entidad es requerido</span>
                            <br />
                        </>
                    }
                    <button type="submit" id="closeModal" className="modal-close-btn">
                        {element === "" ? "Crear entidad" : "Editar entidad"}
                    </button>
                </form>
            </dialog>
        </>
    );
}

export default CrearEntidad;