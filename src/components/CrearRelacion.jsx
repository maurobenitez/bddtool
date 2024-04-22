import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../redux/modalSlice';
import { createElement } from '../redux/diagramSlice';

const CrearRelacion = ({ isOpen, x, y }) => {

    const entidades = useSelector((state) => state.diagram.entidades);

    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        nombre: "",
        entidad1: "",
        entidad2: "",
        cardinalidad1: "",
        cardinalidad2: "",
    });

    const [formErrors, setFormErrors] = useState({
        nombre: false,
        entidad1: false,
        entidad2: false,
        cardinalidad1: false,
        cardinalidad2: false,
    });

    const opcionesCardinalidad = [
        {
            text: "0..1",
            content: {
                cardinalidadMinima: 0,
                cardinalidadMaxima: 1,
            }
        },
        {
            text: "0..n",
            content: {
                cardinalidadMinima: 0,
                cardinalidadMaxima: "n",
            }
        },
        {
            text: "1..1",
            content: {
                cardinalidadMinima: 1,
                cardinalidadMaxima: 1,
            }
        },
        {
            text: "1..n",
            content: {
                cardinalidadMinima: 1,
                cardinalidadMaxima: "n",
            }
        },
        {
            text: "n..n",
            content: {
                cardinalidadMinima: "n",
                cardinalidadMaxima: "n",
            }
        },
    ]

    const toggleDialog = () => {
        var dialog = document.getElementById("crearRelacion");
        if (isOpen === true) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }

    useEffect(toggleDialog, [isOpen]);

    const formHasErrors = (err) => {
        var hasErrors = false;
        Object.keys(err).forEach(key => {
            if (err[key] === true) hasErrors = true;
        });
        return hasErrors;
    }

    const resetForm = () => {
        setFormData({
            nombre: "",
            entidad1: "",
            entidad2: "",
            cardinalidad1: "",
            cardinalidad2: "",
        });
        setFormErrors({
            nombre: false,
            entidad1: false,
            entidad2: false,
            cardinalidad1: false,
            cardinalidad2: false,
        });
        document.getElementById("crearRelacionForm").reset();
        dispatch(closeDialog());
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: false });
    };

    const handleDropdownChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: false });

    };

    function handleSubmit(e) {
        e.preventDefault();
        const { nombre, entidad1, entidad2, cardinalidad1, cardinalidad2 } = formData;
        const err = {
            ...formErrors,
            nombre: nombre.trim() === '',
            entidad1: entidad1 === '',
            entidad2: entidad2 === '',
            cardinalidad1: cardinalidad1 === '',
            cardinalidad2: cardinalidad2 === '',
        };
        setFormErrors(err);
        if (!formHasErrors(err)) {

            const contentEntidad1 = opcionesCardinalidad[formData.cardinalidad1].content;
            const contentEntidad2 = opcionesCardinalidad[formData.cardinalidad2].content;
            const entidad1 = { ...contentEntidad1, id: formData.entidad1 };
            const entidad2 = { ...contentEntidad2, id: formData.entidad2 };
            const entidades = [entidad1, entidad2];
            const { nombre } = formData;
            const elementData = { x, y, nombre, entidades };
            dispatch(createElement({ elementData, type: "relacion" }));
            resetForm();

        }
    }

    return (
        <>
            <dialog id="crearRelacion" className="modal" onClose={resetForm}>
                <h1>Añadir relación</h1>
                <form method="post" onSubmit={handleSubmit} id="crearRelacionForm">
                    <label>
                        Nombre:
                    </label>
                    <input name="nombre" onChange={handleInputChange} />
                    <br />
                    {formErrors.nombre &&
                        <>
                            <span className="error-message">El nombre de la relación es requerido.</span>
                            <br />
                        </>
                    }
                    <label>
                        entidad 1:
                    </label>

                    <select name="entidad1" value={formData.entidad1} onChange={handleDropdownChange}>
                        <option value="">Seleccione entidad...</option>
                        {entidades.map((entidad, index) =>
                            <option value={entidad.id} key={"cre1-" + index}>{entidad.nombre}</option>
                        )}
                    </select>
                    <br />
                    {formErrors.entidad1 &&
                        <>
                            <span className="error-message">Seleccione la entidad.</span>
                            <br />
                        </>
                    }
                    <label>
                        cardinalidad entidad 1:
                    </label>
                    <select name="cardinalidad1" value={formData.cardinalidad1} onChange={handleDropdownChange}>
                        <option value="">Seleccione cardinalidad...</option>
                        {opcionesCardinalidad.map((opcionCardinalidad, index) =>
                            <option value={index} key={"crc1-" + index}>{opcionCardinalidad.text}</option>
                        )}
                    </select>
                    <br />
                    {formErrors.cardinalidad1 &&
                        <>
                            <span className="error-message">Seleccione la cardinalidad.</span>
                            <br />
                        </>
                    }
                    <label>
                        Entidad 2:
                    </label>
                    <select name="entidad2" value={formData.entidad2} onChange={handleDropdownChange}>
                        <option value="">Seleccione entidad...</option>
                        {entidades.map((entidad, index) =>
                            <option value={entidad.id} key={"cre2-" + index}>{entidad.nombre}</option>
                        )}
                    </select>
                    <br />
                    {formErrors.entidad2 &&
                        <>
                            <span className="error-message">Seleccione la entidad.</span>
                            <br />
                        </>
                    }
                    <label>
                        Cardinalidad entidad 2:
                    </label>
                    <select name="cardinalidad2" value={formData.cardinalidad2} onChange={handleDropdownChange}>
                        <option value="">Seleccione cardinalidad...</option>
                        {opcionesCardinalidad.map((opcionCardinalidad, index) =>
                            <option value={index} key={"crc2-" + index}>{opcionCardinalidad.text}</option>
                        )}
                    </select>

                    <br />
                    {formErrors.cardinalidad2 &&
                        <>
                            <span className="error-message">Seleccione la cardinalidad.</span>
                            <br />
                        </>
                    }
                    <button type="submit" id="closeModal" className="modal-close-btn">
                        Crear relacion
                    </button>
                </form>
            </dialog>
        </>
    );
}

export default CrearRelacion;