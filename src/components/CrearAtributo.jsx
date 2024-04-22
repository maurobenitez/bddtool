import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../redux/modalSlice';
import { createElement, manageElements } from '../redux/diagramSlice';

const CrearAtributo = ({ isOpen, x, y, element }) => {

    const entidades = useSelector((state) => state.diagram.entidades);

    const [atributo, setAtributo] = useState("");

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

    const asignarElemento = () => {
        if (element !== "") {
            const entidad = entidades.find(entidad => entidad.id === element.id);
            const atributo = entidad.atributos.find(atributo => atributo.id === element.idAttribute);
            setAtributo(atributo);
            const data = {
                nombre: atributo.nombre,
                dueño: entidad.id,
                clavePrimaria: atributo.clavePrimaria,
                cardinalidad: atributo.cardinalidad,
                esCompuesto: atributo.type === "atributo"
            }
            setFormData(data);
        }
    }

    useEffect(asignarElemento, [isOpen]);

    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        nombre: "",
        dueño: "",
        clavePrimaria: false,
        cardinalidad: "",
        esCompuesto: false,
    });

    const [formErrors, setFormErrors] = useState({
        nombre: false,
        dueño: false,
        clavePrimaria: false,
        cardinalidad: false,
        esCompuesto: false,
    });

    const getAtributosCompuestos = () => {
        const atributosCompuestos = [];
        entidades.forEach(entidad => {
            if (entidad.atributosCompuestos && entidad.atributosCompuestos !== []) {
                entidad.atributosCompuestos.forEach(atributoCompuesto => {
                    atributosCompuestos.push({ ...atributoCompuesto, entidad: entidad.id });
                })
            }
        })
        return atributosCompuestos;
    }

    const toggleDialog = () => {
        var dialog = document.getElementById("crearAtributo");
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
            dueño: "",
            clavePrimaria: false,
            cardinalidad: "",
            esCompuesto: false,
        });
        setFormErrors({
            nombre: false,
            dueño: false,
            clavePrimaria: false,
            cardinalidad: false,
            esCompuesto: false,
        });
        document.getElementById("crearAtributoForm").reset();
        dispatch(closeDialog());
    }

    const crearAtributo = () => {
        const { dueño, nombre, clavePrimaria, cardinalidad, esCompuesto } = formData;
        const { id, idc } = dueño;
        const { content } = opcionesCardinalidad.find(elemento => elemento.text === cardinalidad);
        const elementData = { x, y, nombre, clavePrimaria, ...content };
        const type = esCompuesto ? "atributo compuesto" : "atributo";
        dispatch(createElement({ elementData, type, id, idc }));
    }

    const editarAtributo = () => {
        const { dueño, nombre, clavePrimaria, cardinalidad, esCompuesto } = formData;
        const { id, idc } = dueño;
        const { content } = opcionesCardinalidad.find(elemento => elemento.text === cardinalidad);
        const values = { x, y, nombre, clavePrimaria, ...content };
        const type = esCompuesto ? "atributo compuesto" : "atributo";
        dispatch(manageElements({ values, id, type, idc }));
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: false });
    };

    const handleDropdownChange = (event) => {
        var { name, value } = event.target;
        if (name === "dueño" && value !== "") {
            value = JSON.parse(value);
        }
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: false });
    };

    const handleOptionChange = (event) => {
        const { value } = event.target;
        const esCompuesto = value === "simple" ? false : true;
        setFormData({ ...formData, esCompuesto })
        setFormErrors({ ...formErrors, esCompuesto: false });

    };

    const handleCheckboxChange = (event) => {
        const { checked, name } = event.target;
        setFormData({ ...formData, [name]: checked });
    };

    function handleSubmit(e) {
        e.preventDefault();
        const { dueño, nombre, clavePrimaria, cardinalidad, esCompuesto } = formData;
        const err = {
            ...formErrors,
            nombre: nombre.trim() === "",
            dueño: dueño === "",
            cardinalidad: cardinalidad === "",
        };
        if (!formHasErrors(err)) {
            if (element === "") {
                crearAtributo();
            } else {
                editarAtributo();
            }
            /* const { id, idc } = dueño;
            const { content } = opcionesCardinalidad.find(elemento => elemento.text === cardinalidad);
            const elementData = { x, y, nombre, clavePrimaria, ...content };
            const type = esCompuesto ? "atributo compuesto" : "atributo";
            dispatch(createElement({ elementData, type, id, idc })); */
            resetForm();
        } else {
            setFormErrors(err);
        }
    }

    return (
        <>
            <dialog id="crearAtributo" className="modal" onClose={resetForm}>
                <h1>Añadir atributo</h1>
                <form method="post" id="crearAtributoForm" onSubmit={handleSubmit}>
                    <label>
                        Nombre:
                    </label>
                    <input name="nombre" onChange={handleInputChange} value={formData.nombre} />
                    <br />
                    {formErrors.nombre &&
                        <>
                            <span className="error-message">El nombre del atributo es requerido.</span>
                            <br />
                        </>
                    }
                    <input type="radio" id="simple" name="tipo" value="simple" onChange={handleOptionChange} checked={formData.esCompuesto === false} />
                    <label htmlFor="simple">Simple</label>
                    <input type="radio" id="compuesto" name="tipo" value="compuesto" onChange={handleOptionChange} checked={formData.esCompuesto === true} />
                    <label htmlFor="compuesto">Compuesto</label><br />
                    <label>
                        Dueño:
                    </label>
                    <select name="dueño" value={formData.entidad} onChange={handleDropdownChange}>
                        <option value="">Seleccione dueño...</option>
                        <optgroup label="Entidades">
                            {entidades.map((entidad, index) =>
                                <option value={JSON.stringify({ id: entidad.id, idc: -1 })} key={"ce-" + index + "-" + entidad}>{entidad.nombre}</option>
                            )}
                        </optgroup>
                        {/*  <optgroup label="Relaciones">
                            {relaciones.map((relacion, index) =>
                                <option value={JSON.stringify({ id: entidad.id, idc: -1 })} key={"ce-" + index + "-" + entidad}>{entidad.nombre}</option>
                            )}
                        </optgroup> */}
                        <optgroup label="Atributos compuestos">
                            {getAtributosCompuestos().map((atributoCompuesto, index) =>
                                <option value={JSON.stringify({ id: atributoCompuesto.entidad, idc: atributoCompuesto.id })} key={"cac-" + index + "-" + atributoCompuesto}>{atributoCompuesto.nombre}</option>
                            )}
                        </optgroup>

                    </select>
                    <br />
                    {formErrors.dueño &&
                        <>
                            <span className="error-message">Seleccione dueño.</span>
                            <br />
                        </>
                    }
                    <label>
                        cardinalidad:
                    </label>
                    <select name="cardinalidad" value={formData.cardinalidad} onChange={handleDropdownChange}>
                        <option value="">Seleccione cardinalidad...</option>
                        {opcionesCardinalidad.map((opcionCardinalidad, index) =>
                            <option value={opcionCardinalidad.text} key={"caoc-" + index}>{opcionCardinalidad.text}</option>
                        )}
                    </select>
                    <br />
                    {formErrors.cardinalidad &&
                        <>
                            <span className="error-message">Seleccione cardinalidad.</span>
                            <br />
                        </>
                    }
                    {!formData.esCompuesto &&
                        <>
                            <input type="checkbox" id="clavePrimaria" name="clavePrimaria" onChange={handleCheckboxChange} />
                            <label htmlFor="clavePrimaria"> Es clave primaria</label>
                            <br />
                        </>
                    }
                    <button type="submit" id="closeModal" className="modal-close-btn">
                        Crear atributo
                    </button>
                </form>
            </dialog>
        </>
    );
}

export default CrearAtributo;