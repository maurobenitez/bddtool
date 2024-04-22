import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../redux/modalSlice';
import { manageElements } from '../redux/diagramSlice';

const CrearJerarquía = ({ isOpen, x, y }) => {

    const entidades = useSelector((state) => state.diagram.entidades);

    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        entidadPadre: "",
        cobertura: ""
    });

    const [formErrors, setFormErrors] = useState({
        entidadPadre: false,
        cobertura: false,
    });
    const [selectedOptions, setSelectedOptions] = useState([]);

    const [options, setOptions] = useState([]);

    const opcionesCobertura = ["T,E", "T,S", "P,E", "P,S"];

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

    const formHasErrors = (err) => {
        var hasErrors = false;
        Object.keys(err).forEach(key => {
            if (err[key] === true) hasErrors = true;
        });
        return hasErrors;
    }

    const resetForm = () => {
        setFormData({
            entidadPadre: "",
            cobertura: ""
        });
        setFormErrors({
            entidadPadre: false,
            cobertura: false,
        })
        document.getElementById("CrearJerarquíaForm").reset();
        setSelectedOptions([]);
        dispatch(closeDialog());
    }

    const handleDropdownChange = (event) => {
        var { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: false });
    };

    function handleSubmit(e) {
        e.preventDefault();
        const { entidadPadre, cobertura } = formData;
        const err = {
            ...formErrors,
            entidadPadre: entidadPadre === '',
            cobertura: cobertura === "",
        };
        setFormErrors(err);
        if (!formHasErrors(err)) {
            const values = {
                subType: "padre",
                cobertura: cobertura,
                hijos: []
            }
            selectedOptions.forEach(option => {
                values.hijos.push(option.value);
                let subValues = { subType: "hijo" };
                dispatch(manageElements({ values: subValues, type: "entidad", id: option.value }));
            })
            dispatch(manageElements({ values, type: "entidad", id: entidadPadre }));
            resetForm();
        }
    }

    return (
        <>
            <dialog id="CrearJerarquía" className="modal" onClose={resetForm}>
                <h1>Añadir Jerarquía</h1>
                <form method="post" id="CrearJerarquíaForm" onSubmit={handleSubmit}>
                    <label>
                        Entidad padre:
                    </label>
                    <select name="entidadPadre" value={formData.entidadPadre} onChange={handleDropdownChange}>
                        <option value="">Seleccione entidad...</option>
                        {entidades.map((entidad, index) =>
                            <option value={entidad.id} key={"cjep-" + index + "-" + entidad}>{entidad.nombre}</option>
                        )}
                    </select>
                    <br />
                    {formErrors.entidadPadre &&
                        <>
                            <span className="error-message">Seleccione entidad padre.</span>
                            <br />
                        </>
                    }
                    <label>
                        cobertura:
                    </label>
                    <select name="cobertura" value={formData.cobertura} onChange={handleDropdownChange}>
                        <option value="">Seleccione cobertura...</option>
                        {opcionesCobertura.map((opcionCobertura, index) =>
                            <option value={opcionCobertura} key={"caoc-" + opcionCobertura}>{opcionCobertura}</option>
                        )}
                    </select>
                    <br />
                    {formErrors.cobertura &&
                        <>
                            <span className="error-message">Seleccione cobertura.</span>
                            <br />
                        </>
                    }
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
                        Crear Jerarquía
                    </button>
                </form>
            </dialog>
        </>
    );
}

export default CrearJerarquía;