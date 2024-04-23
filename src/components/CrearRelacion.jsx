import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../redux/modalSlice';
import { createElement, manageElements } from '../redux/diagramSlice';

const CrearRelacion = ({ isOpen, x, y, element }) => {

    const entidades = useSelector((state) => state.diagram.entidades);

    const relaciones = useSelector((state) => state.diagram.relaciones);

    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        nombre: "",
        idEntidad1: "",
        idEntidad2: "",
        cardinalidad1: "",
        cardinalidad2: "",
    });

    const [formErrors, setFormErrors] = useState({
        nombre: false,
        idEntidad1: false,
        idEntidad2: false,
        cardinalidad1: false,
        cardinalidad2: false,
    });

    const [relacion, setRelacion] = useState("");

    const obtenerCardinalidad = (minima, maxima) => {
        if (minima === undefined || maxima === undefined)
            return "1..1";
        return minima + ".." + maxima;
    }

    const asignarElemento = () => {
        if (element !== "") {
            const relacion = relaciones.find(relacion => relacion.id === element.id);
            setRelacion(relacion);
            const data = {
                nombre: relacion.nombre,
                idEntidad1: relacion.entidades[0].id,
                idEntidad2: relacion.entidades[1].id,
                cardinalidad1: obtenerCardinalidad(relacion.entidades[0].cardinalidadMinima, relacion.entidades[0].cardinalidadMaxima),
                cardinalidad2: obtenerCardinalidad(relacion.entidades[1].cardinalidadMinima, relacion.entidades[1].cardinalidadMaxima),
            }
            setFormData(data);
        }
    }

    useEffect(asignarElemento, [isOpen]);

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

    const crearRelacion = () => {
        const { nombre, idEntidad1, idEntidad2, cardinalidad1, cardinalidad2 } = formData;
        const contentEntidad1 = opcionesCardinalidad.find(elemento => elemento.text === cardinalidad1).content;
        const contentEntidad2 = opcionesCardinalidad.find(elemento => elemento.text === cardinalidad2).content;
        const entidad1 = { ...contentEntidad1, id: idEntidad1 };
        const entidad2 = { ...contentEntidad2, id: idEntidad2 };
        const entidades = [entidad1, entidad2];
        const elementData = { x, y, nombre, entidades };
        dispatch(createElement({ elementData, type: "relacion" }));
    }

    const editarRelacion = () => {
        const { nombre, idEntidad1, idEntidad2, cardinalidad1, cardinalidad2 } = formData;
        const contentEntidad1 = opcionesCardinalidad.find(elemento => elemento.text === cardinalidad1).content;
        const contentEntidad2 = opcionesCardinalidad.find(elemento => elemento.text === cardinalidad2).content;
        const entidad1 = { ...contentEntidad1, id: idEntidad1 };
        const entidad2 = { ...contentEntidad2, id: idEntidad2 };
        const entidades = [entidad1, entidad2];
        const values = { nombre, entidades };
        dispatch(manageElements({ values, type: "relacion", id: relacion.id }));
    }

    const resetForm = () => {
        setFormData({
            nombre: "",
            idEntidad1: "",
            idEntidad2: "",
            cardinalidad1: "",
            cardinalidad2: "",
        });
        setFormErrors({
            nombre: false,
            idEntidad1: false,
            idEntidad2: false,
            cardinalidad1: false,
            cardinalidad2: false,
        });
        document.getElementById("crearRelacionForm").reset();
        dispatch(closeDialog());
    }

    const handleDropdownChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: false });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: false });
    };

    function handleSubmit(e) {
        e.preventDefault();
        const { nombre, idEntidad1, idEntidad2, cardinalidad1, cardinalidad2 } = formData;
        const err = {
            ...formErrors,
            nombre: nombre.trim() === '',
            idEntidad1: idEntidad1 === '',
            idEntidad2: idEntidad2 === '',
            cardinalidad1: cardinalidad1 === '',
            cardinalidad2: cardinalidad2 === '',
        };

        if (!formHasErrors(err)) {
            if (element === "") {
                crearRelacion();
            } else {
                editarRelacion();
            }
            resetForm();
        } else {
            setFormErrors(err);
        }
    }

    return (
        <>
            <dialog id="crearRelacion" className="modal" onClose={resetForm}>
                <h1>
                    {element === "" ? "Crear relación" : "Editar relación"}
                </h1>
                <form method="post" onSubmit={handleSubmit} id="crearRelacionForm">
                    <label>
                        Nombre:
                    </label>
                    <input name="nombre" onChange={handleInputChange} value={formData.nombre} />
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

                    <select name="idEntidad1" value={formData.idEntidad1} onChange={handleDropdownChange}>
                        <option value="">Seleccione entidad...</option>
                        {entidades.map((entidad, index) =>
                            <option value={entidad.id} key={"cre1-" + index}>{entidad.nombre}</option>
                        )}
                    </select>
                    <br />
                    {formErrors.idEntidad1 &&
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
                            <option value={opcionCardinalidad.text} key={"crc1-" + index}>{opcionCardinalidad.text}</option>
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
                    <select name="idEntidad2" value={formData.idEntidad2} onChange={handleDropdownChange}>
                        <option value="">Seleccione entidad...</option>
                        {entidades.map((entidad, index) =>
                            <option value={entidad.id} key={"cre2-" + index}>{entidad.nombre}</option>
                        )}
                    </select>
                    <br />
                    {formErrors.idEntidad2 &&
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
                            <option value={opcionCardinalidad.text} key={"crc2-" + index}>{opcionCardinalidad.text}</option>
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
                        {element === "" ? "Crear relación" : "Editar relación"}
                    </button>
                </form>
            </dialog>
        </>
    );
}

export default CrearRelacion;