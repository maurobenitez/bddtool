import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../redux/modalSlice';
import { createElement, manageElements } from '../redux/diagramSlice';

const CrearAtributo = ({ isOpen, x, y, element }) => {

    const entidades = useSelector((state) => state.diagram.entidades);

    const relaciones = useSelector((state) => state.diagram.relaciones);

    const [atributo, setAtributo] = useState("");

    const [identificadoresExternos, setIdentificadoresExternos] = useState("");

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

    const obtenerCardinalidad = (minima, maxima) => {
        if (minima === undefined || maxima === undefined)
            return "1..1";
        return minima + ".." + maxima;
    }

    const asignarElemento = () => {
        if (element !== "") {
            var elemento = "";
            if (element.esRelacion !== undefined) {
                elemento = relaciones.find(relacion => relacion.id === element.id);
                var elementos = elemento["atributos"];
            } else {
                elemento = entidades.find(entidad => entidad.id === element.id);
                var tipoDeAtributo = element.type === "atributo" ? "atributos" : "atributosCompuestos";
                var elementos = elemento[tipoDeAtributo];
            }
            var atributo = elementos.find(atributo => atributo.id === element.idAttribute);
            setAtributo(atributo);
            const data = {
                nombre: atributo.nombre,
                dueño: { id: elemento.id, idc: element.idc },
                clavePrimaria: atributo.clavePrimaria === true,
                cardinalidad: obtenerCardinalidad(atributo.cardinalidadMinima, atributo.cardinalidadMaxima),
                tipo: atributo.type
            }
            if (element.esRelacion !== undefined) {
                data.esRelacion = true;
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
        tipo: "atributo",
        identificadorExterno: ""
    });

    const [formErrors, setFormErrors] = useState({
        nombre: false,
        dueño: false,
        clavePrimaria: false,
        cardinalidad: false,
        tipo: false,
        identificadorExterno: false
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

    const cardinalidadEs1A1 = (entidad) => {
        if ((entidad.cardinalidadMinima === 1) && (entidad.cardinalidadMaxima === 1)) return true;
        return false;
    }
    const getEntidadRelacionada = (entidadId, relacion) => {
        if (relacion.entidades[0].id === entidadId) {
            if (cardinalidadEs1A1(relacion.entidades[1]))
                return relacion.entidades[1].id;
        }
        if (relacion.entidades[1].id === entidadId) {
            if (cardinalidadEs1A1(relacion.entidades[0]))
                return relacion.entidades[0].id;
        }
        return false;
    }

    const getEntidad = (id) => {
        const entidad = entidades.find((entidad) => entidad.id === id);
        return entidad;
    }

    const getListaEntidades = (listaIds) => {
        const listaEntidades = [];
        listaIds.forEach(idEntidad => {
            listaEntidades.push(getEntidad(idEntidad));
        })
        if (listaEntidades.length === 0) return "";
        return listaEntidades;
    }
    const getIdentificadoresExternos = () => {
        const { id, idc, esRelacion } = formData.dueño;
        if ((idc === "-1") && (esRelacion === undefined)) {
            var identificadoresExternos = [];
            relaciones.forEach(relacion => {
                var entidadRelacionada = getEntidadRelacionada(id, relacion);
                if (entidadRelacionada !== false)
                    identificadoresExternos.push(entidadRelacionada);
            })
            const listaEntidades = getListaEntidades(identificadoresExternos);
            setIdentificadoresExternos(listaEntidades);
        }
        else
            setIdentificadoresExternos("");

    }

    useEffect(getIdentificadoresExternos, [formData]);

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
            tipo: "atributo",
            esRelacion: undefined,
            identificadorExterno: ""
        });
        setFormErrors({
            nombre: false,
            dueño: false,
            clavePrimaria: false,
            cardinalidad: false,
            esCompuesto: false,
            identificadorExterno: false
        });
        document.getElementById("crearAtributoForm").reset();
        dispatch(closeDialog());
    }

    const crearAtributo = () => {
        const { dueño, nombre, clavePrimaria, cardinalidad, tipo, identificadorExterno } = formData;
        const { id, idc, esRelacion } = dueño;
        const type = tipo;
        if (tipo !== "externo") {
            const { content } = opcionesCardinalidad.find(elemento => elemento.text === cardinalidad);
            const elementData = { x, y, nombre, clavePrimaria, ...content };
            dispatch(createElement({ elementData, type, id, idc, esRelacion }));
        } else {
            const elementData = { entidad: identificadorExterno };
            dispatch(createElement({ elementData, type, id }));
        }
    }

    const editarAtributo = () => {
        const { dueño, nombre, clavePrimaria, cardinalidad, tipo, esRelacion } = formData;
        const { id, idc } = dueño;
        const { content } = opcionesCardinalidad.find(elemento => elemento.text === cardinalidad);
        const values = { nombre, clavePrimaria, ...content };
        const type = tipo;
        dispatch(manageElements({ values, id, type, idc, idAttribute: atributo.id, esRelacion }));
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
        const tipo = value;
        setFormData({ ...formData, tipo })
        setFormErrors({ ...formErrors, tipo: false });

    };

    const handleCheckboxChange = (event) => {
        const { checked, name } = event.target;
        setFormData({ ...formData, [name]: checked });
    };

    function handleSubmit(e) {
        e.preventDefault();
        const { dueño, nombre, cardinalidad, identificadorExterno, tipo } = formData;
        const err = {
            ...formErrors,
            nombre: nombre.trim() === "",
            dueño: dueño === "",
            cardinalidad: cardinalidad === "" && tipo !== "externo",
            identificadorExterno: ((identificadorExterno === "") && (tipo === "externo"))
        };

        if (!formHasErrors(err)) {
            if (element === "") {
                crearAtributo();
            } else {
                editarAtributo();
            }
            resetForm();
        } else {
            setFormErrors(err);
        }
    }

    return (
        <>
            <dialog id="crearAtributo" className="modal" onClose={resetForm}>
                {

                }
                <h1>
                    {element === "" ? "Crear atributo" : "Editar atributo"}
                </h1>
                <form method="post" id="crearAtributoForm" onSubmit={handleSubmit}>
                    {/* nombre */}
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
                    {/* tipo */}
                    {
                        element === "" &&
                        <>
                            <label>
                                Dueño:
                            </label>
                            <select name="dueño" value={formData.entidad} onChange={handleDropdownChange}>
                                <option value="">Seleccione dueño...</option>
                                <optgroup label="Entidades">
                                    {entidades.map((entidad, index) =>
                                        <option value={JSON.stringify({ id: entidad.id, idc: "-1" })} key={"ce-" + index + "-" + entidad}>{entidad.nombre}</option>
                                    )}
                                </optgroup>
                                <optgroup label="Relaciones">
                                    {relaciones.map((relacion, index) =>
                                        <option value={JSON.stringify({ id: relacion.id, idc: "-1", esRelacion: true })} key={"ce-" + index + "-" + relacion}>{relacion.nombre}</option>
                                    )}
                                </optgroup>
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
                            <input type="radio" id="simple" name="tipo" value="atributo" onChange={handleOptionChange} checked={formData.tipo === "atributo"} />
                            <label htmlFor="simple">Simple</label>
                            <input type="radio" id="compuesto" name="tipo" value="atributo compuesto" onChange={handleOptionChange} checked={formData.tipo === "atributo compuesto"} />
                            <label htmlFor="compuesto">Compuesto</label><br />
                            {identificadoresExternos !== "" &&
                                <>
                                    <input type="radio" id="externo" name="externo" value="externo" onChange={handleOptionChange} checked={formData.tipo === "externo"} />
                                    <label htmlFor="externo">Identificador externo</label><br />
                                </>
                            }

                        </>
                    }
                    {formData.tipo !== "externo" ?
                        <>
                            <label>
                                cardinalidad:
                            </label>
                            <select name="cardinalidad" value={formData.cardinalidad} onChange={handleDropdownChange}>
                                <option value="">Seleccione cardinalidad...</option>
                                {opcionesCardinalidad.map((opcionCardinalidad, index) =>
                                    <option value={opcionCardinalidad.text} key={"caoc-" + index} selected={opcionCardinalidad.text === formData.cardinalidad}>
                                        {opcionCardinalidad.text}
                                    </option>
                                )}
                            </select>
                            <br />
                            {formErrors.cardinalidad &&
                                <>
                                    <span className="error-message">Seleccione cardinalidad.</span>
                                    <br />
                                </>
                            }
                            {formData.tipo === "atributo" &&
                                <>
                                    <input type="checkbox" id="clavePrimaria" name="clavePrimaria" onChange={handleCheckboxChange} checked={formData.clavePrimaria} />
                                    <label htmlFor="clavePrimaria"> Es clave primaria</label>
                                    <br />
                                </>
                            }
                        </>
                        :
                        <>
                            <label>Seleccione entidad: </label>

                            <select name="identificadorExterno" value={formData.identificadorExterno} onChange={handleDropdownChange}>
                                <option value="">Seleccione entidad...</option>
                                {identificadoresExternos.map((identificador, index) =>
                                    <option value={identificador.id} key={"caoc-" + index} selected={identificador.id === formData.identificadorExterno}>
                                        {identificador.nombre}
                                    </option>
                                )}
                            </select>
                            <br />
                            {formErrors.identificadorExterno &&
                                <>
                                    <span className="error-message">Seleccione identificador externo.</span>
                                    <br />
                                </>
                            }
                        </>

                    }

                    <button type="submit" id="closeModal" className="modal-close-btn">
                        {element === "" ? "Crear atributo" : "Editar atributo"}
                    </button>
                </form>
            </dialog>
        </>
    );
}

export default CrearAtributo;