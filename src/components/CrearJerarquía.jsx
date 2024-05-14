import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../redux/modalSlice';
import { manageElements } from '../redux/diagramSlice';

const CrearJerarquía = ({ isOpen, x, y, element }) => {

    const entidades = useSelector((state) => state.diagram.entidades);

    const dispatch = useDispatch();

    const [entidadPadre, setEntidadPadre] = useState("");

    const [formData, setFormData] = useState({
        nombre: "",
        idEntidadPadre: "",
        cobertura: ""
    });

    const [formErrors, setFormErrors] = useState({
        nombre: false,
        idEntidadPadre: false,
        cobertura: false,
    });

    const [selectedOptions, setSelectedOptions] = useState([]);

    const [options, setOptions] = useState([]);

    const opcionesCobertura = ["T,E", "T,S", "P,E", "P,S"];

    const asignarElemento = () => {
        if (element !== "") {
            const entidad = entidades.find(entidad => entidad.id === element.id);
            setEntidadPadre(entidad);
            const data = {
                nombre: entidad.nombre,
                cobertura: entidad.cobertura,
                idEntidadPadre: entidad.id
            }
            const entidadesHijo = [];
            entidad.hijos.forEach(idHijo => {
                let entidadHijo = entidades.find(entidad => entidad.id === idHijo);
                let selectedOption = {
                    value: idHijo,
                    label: entidadHijo.nombre
                }
                entidadesHijo.push(selectedOption);
            });
            setSelectedOptions(entidadesHijo);
            setFormData(data);
        }
    }

    useEffect(asignarElemento, [isOpen]);

    const toggleDialog = () => {
        var dialog = document.getElementById("CrearJerarquía");
        if (isOpen === true) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }

    useEffect(toggleDialog, [isOpen]);


    const cargarEntidades = () => {
        const opciones = [];
        entidades.forEach(entidad => {
            let option = { value: entidad.id, label: entidad.nombre };
            opciones.push(option);
        })
        setOptions(opciones);
    }

    useEffect(cargarEntidades, [isOpen]);

    const crearJerarquía = () => {
        const { idEntidadPadre, cobertura } = formData;
        const values = {
            subType: "padre",
            cobertura,
            hijos: []
        }
        const id = parseInt(idEntidadPadre);
        selectedOptions.forEach(option => {
            values.hijos.push(option.value);
            let subValues = { subType: "hijo" };
            dispatch(manageElements({ values: subValues, type: "entidad", id: option.value }));
        })
        dispatch(manageElements({ id, values, type: "entidad" }));

    }

    const esHijo = (entidad, hijos) => {
        var esHijo = false;
        hijos.forEach(idHijo => {
            if (entidad.id === idHijo)
                esHijo = true;
        })
        return esHijo;
    }

    const editarJerarquía = () => {
        const { idEntidadPadre, cobertura, nombre } = formData;
        const values = {
            cobertura,
            nombre,
            hijos: []
        }

        selectedOptions.forEach(option => {
            values.hijos.push(option.value);
        });
        entidades.forEach(entidad => {
            let subValues = { subType: "" };
            if (esHijo(entidad, values.hijos)) {
                subValues = { subType: "hijo" };
            }
            if (entidad.subType === "padre") {
                subValues = { subType: "padre" };
            }
            dispatch(manageElements({ values: subValues, type: "entidad", id: entidad.id }));
        })
        dispatch(manageElements({ values, type: "entidad", id: entidadPadre.id }));
    }

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
            idEntidadPadre: "",
            cobertura: ""
        });
        setFormErrors({
            nombre: false,
            idEntidadPadre: false,
            cobertura: false,
        })
        document.getElementById("CrearJerarquíaForm").reset();
        setSelectedOptions([]);
        dispatch(closeDialog());
        setEntidadPadre("");
    }

    const handleDropdownChange = (event) => {
        var { name, value } = event.target;
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
        const { idEntidadPadre, cobertura, nombre } = formData;
        const err = {
            ...formErrors,
            idEntidadPadre: idEntidadPadre === '',
            cobertura: cobertura === "",
        };
        if (!formHasErrors(err)) {
            if (element === "") {
                crearJerarquía();
            } else {
                editarJerarquía();
            }
            resetForm();
        } else {
            setFormErrors(err);
        }
    }

    return (
        <>
            <dialog id="CrearJerarquía" className="modal" onClose={resetForm}>
                <h1>
                    {element === "" ? "Añadir jerarquía" : "Editar jerarquía"}
                </h1>
                <form method="post" id="CrearJerarquíaForm" onSubmit={handleSubmit}>
                    {
                        element === "" ?
                            <>
                                <label>
                                    Entidad padre:
                                </label>
                                <select name="idEntidadPadre" value={formData.idEntidadPadre} onChange={handleDropdownChange}>
                                    <option value="">Seleccione entidad...</option>
                                    {entidades.map((entidad, index) =>
                                        <option value={entidad.id} key={"cjep-" + index + "-" + entidad}>{entidad.nombre}</option>
                                    )}
                                </select>
                                <br />
                                {formErrors.idEntidadPadre &&
                                    <>
                                        <span className="error-message">Seleccione entidad padre.</span>
                                        <br />
                                    </>
                                }
                            </>
                            :
                            <>
                                <label>
                                    Nombre:
                                </label>
                                <input name="nombre" onChange={handleInputChange} value={formData.nombre} />
                                <br />
                                {formErrors.nombre &&
                                    <>
                                        <span className="error-message">El nombre de la entidad es requerido.</span>
                                        <br />
                                    </>
                                }
                            </>
                    }

                    <label>
                        cobertura:
                    </label>
                    <select name="cobertura" value={formData.cobertura} onChange={handleDropdownChange}>
                        <option value="">Seleccione cobertura...</option>
                        {opcionesCobertura.map((opcionCobertura, index) =>
                            <option value={opcionCobertura} key={"caoc-" + opcionCobertura}>{opcionCobertura} </option>
                        )}
                    </select>
                    <br />
                    {formErrors.cobertura &&
                        <>
                            <span className="error-message">Seleccione cobertura.</span>
                            <br />
                        </>
                    }
                    {/* #select */}
                    <Select
                        defaultValue={selectedOptions}
                        onChange={setSelectedOptions}
                        options={options}
                        isMulti
                        value={selectedOptions}
                        maxMenuHeight={185}
                    />
                    <br />
                    <button type="submit" id="closeModal" className="modal-close-btn">
                        {element === "" ? "Añadir jerarquía" : "Editar jerarquía"}
                    </button>
                </form>
            </dialog>
        </>
    );
}

export default CrearJerarquía;