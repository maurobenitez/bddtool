import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { manageElements, createElement, saveState, closeModal } from '../../redux/logicModelSlice';


const TransformarAtributosCompuestos = ({ isOpen }) => {

    const entidades = useSelector(state => state.logicDiagram.estadoActual.entidades);

    const [selectedOption, setSelectedOption] = useState({
        option: "option1"
    });

    const dispatch = useDispatch();


    var atributoCompuesto = {};

    const getAtributoCompuesto = () => {
        if (isOpen) {
            entidades.forEach(entidad => {
                if (entidad.atributosCompuestos && entidad.atributosCompuestos.length !== 0) {
                    atributoCompuesto = { idEntidad: entidad.id, idAtributoCompuesto: entidad.atributosCompuestos[0].id };
                    return;
                }
            })
        }
    }

    useEffect(getAtributoCompuesto, [isOpen, selectedOption]);

    const toggleDialog = () => {
        var dialog = document.getElementById("transformarAtributosCompuestos");
        if (isOpen === true) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }

    useEffect(toggleDialog, [isOpen]);

    const close = () => {
        document.getElementById("transformarAtributosCompuestosForm").reset();
        dispatch(closeModal());
    }

    const transformacion1 = (entidad, atributoCompuesto) => {
        const borrarEntidad = { id: entidad.id, idAttribute: atributoCompuesto.id, type: "atributo compuesto", operation: "borrar" };
        dispatch(manageElements(borrarEntidad));
        atributoCompuesto.atributos.forEach(atributo => {
            var crearAtributo = { elementData: atributo, type: "atributo", id: entidad.id, idc: "-1" };
            dispatch(createElement(crearAtributo));
        })
    }

    const transformacion2 = (entidad, atributoCompuesto) => {
        const borrarEntidad = { id: entidad.id, idAttribute: atributoCompuesto.id, type: "atributo compuesto", operation: "borrar" };
        dispatch(manageElements(borrarEntidad));
        var nombre = "";
        for (let i = 0; i < atributoCompuesto.atributos.length; i++) {
            nombre += `${atributoCompuesto.atributos[i].nombre}`;
            if (i < atributoCompuesto.atributos.length - 1) nombre += " + ";
        }
        const elementData = { nombre, x: atributoCompuesto.x, y: atributoCompuesto.y };
        var crearEntidad = { elementData, type: "atributo", id: entidad.id, idc: "-1" };
        dispatch(createElement(crearEntidad));
    }

    const transformacion3 = (entidad, atributoCompuesto) => {
        const borrarEntidad = { id: entidad.id, idAttribute: atributoCompuesto.id, type: "atributo compuesto", operation: "borrar" };
        dispatch(manageElements(borrarEntidad));
        const idElement = uuidv4();
        const elementData = { x: atributoCompuesto.x, y: atributoCompuesto.y, nombre: atributoCompuesto.nombre, atributos: atributoCompuesto.atributos, id: idElement };
        const crearEntidad = { elementData, type: "entidad" };
        dispatch(createElement(crearEntidad));
        const entidades = [
            {
                id: entidad.id,
                cardinalidadMinima: 1,
                cardinalidadMaxima: 1,
            },
            {
                id: idElement,
                cardinalidadMinima: 1,
                cardinalidadMaxima: 1,
            }
        ];

        const data1 = { x: (entidad.x + atributoCompuesto.x) / 2, y: (entidad.y + atributoCompuesto.y) / 2, nombre: `${entidad.nombre}_${atributoCompuesto.nombre}`, entidades };

        dispatch(createElement({ elementData: data1, type: "relacion" }));
    }
    const transformarAtributocompuesto = ({ idEntidad, idAtributoCompuesto }, tipo) => {
        dispatch(saveState());
        const entidad = entidades.find(entidad => entidad.id === idEntidad);
        const atributoCompuesto1 = entidad.atributosCompuestos.find(atributo => atributo.id === idAtributoCompuesto);
        if (tipo === "option1") {
            transformacion1(entidad, atributoCompuesto1);
        } else if (tipo === "option2") {
            transformacion2(entidad, atributoCompuesto1);
        } else if (tipo === "option3") {
            transformacion3(entidad, atributoCompuesto1);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        transformarAtributocompuesto(atributoCompuesto, selectedOption.option);
        close();
    }

    const handleOptionChange = (event) => {
        const { value } = event.target;
        setSelectedOption({ ...selectedOption, option: value });
    };
    return (
        <>
            <dialog id="transformarAtributosCompuestos" className="modal" onClose={close}>
                <h1>
                    Transformar atributos compuestos
                </h1>
                <form method="post" onSubmit={handleSubmit} id="transformarAtributosCompuestosForm">
                    <label>
                        <input type="radio" name="option" value="option1" onChange={handleOptionChange} checked={selectedOption.option === "option1"} />
                        Definir los atributos simples sin un atributo compuesto que los resuma.


                    </label><br />
                    <label>
                        <input type="radio" name="option" value="option2" onChange={handleOptionChange} checked={selectedOption.option === "option2"} />
                        Generar un único atributo que se convierta en la concatenación de todos los atributos simples que contiene el atributo compuesto.
                    </label><br />
                    <label>
                        <input type="radio" name="option" value="option3" onChange={handleOptionChange} checked={selectedOption.option === "option3"} />
                        Generar una nueva entidad, que represente el atributo compuesto.
                    </label><br /><br />
                    <input type="submit" value="Aceptar" id="closeModal" className="modal-close-btn" />
                </form>
            </dialog>
        </>
    );
}

export default TransformarAtributosCompuestos;