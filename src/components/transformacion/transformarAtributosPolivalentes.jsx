import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../redux/logicModelSlice';
import { manageElements, createElement, saveState } from '../../redux/logicModelSlice';
import { v4 as uuidv4 } from 'uuid';

const TransformarAtributosPolivalentes = ({ isOpen }) => {

    const entidades = useSelector(state => state.logicDiagram.estadoActual.entidades);

    const dispatch = useDispatch();


    var atributoPolivalente = {};
    const [nombreEntidad, setNombreEntidad] = useState("");
    const [nombreAtributo, setNombreAtributo] = useState("");


    const getAtributoPolivalente = () => {
        if (isOpen) {
            entidades.forEach(entidad => {
                entidad.atributos.forEach((atributo) => {
                    if (atributo.cardinalidadMaxima && (atributo.cardinalidadMaxima === "n" || atributo.cardinalidadMaxima > 1)) {
                        setNombreEntidad(entidad.nombre);
                        setNombreAtributo(atributo.nombre);
                        atributoPolivalente = { idEntidad: entidad.id, idAtributo: atributo.id };
                        return;
                    }
                });
            })
        }
    }

    useEffect(getAtributoPolivalente, [isOpen, nombreEntidad, nombreAtributo]);

    const toggleDialog = () => {
        var dialog = document.getElementById("transformarAtributosPolivalentes");
        if (isOpen === true) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }

    useEffect(toggleDialog, [isOpen]);

    const close = () => {
        document.getElementById("transformarAtributosPolivalentesForm").reset();
        dispatch(closeModal());
    }


    const transformarAtributoPolivalente = ({ idEntidad, idAtributo }) => {
        console.log(nombreEntidad, nombreAtributo);
        const entidad = entidades.find(entidad => entidad.id === idEntidad);
        const atributo = entidad.atributos.find(atributo => atributo.id === idAtributo);
        const borrarAtributo = { id: entidad.id, idAttribute: atributo.id, idc: "-1", type: "atributo", operation: "borrar" };
        dispatch(manageElements(borrarAtributo));
        const idElement = uuidv4();
        const elementData = { x: ((atributo.x - entidad.x) * 2) + entidad.x, y: ((atributo.y - entidad.y) * 2) + entidad.y, nombre: atributo.nombre, atributos: [], id: idElement };
        const crearEntidad = { elementData, type: "entidad" };
        dispatch(createElement(crearEntidad));

        const attributeData = { x: ((atributo.x - entidad.x) * 3) + entidad.x, y: ((atributo.y - entidad.y) * 3) + entidad.y, nombre: atributo.nombre, clavePrimaria: true };
        const crearAtributo = { elementData: attributeData, type: "atributo", id: idElement, idc: "-1" };

        dispatch(createElement(crearAtributo));
        const e = [
            {
                id: idEntidad,
                cardinalidadMinima: 1,
                cardinalidadMaxima: 1,
            },
            {
                id: idElement,
                cardinalidadMinima: 1,
                cardinalidadMaxima: 1,
            }
        ];

        const data = { x: atributo.x, y: atributo.y, nombre: `${entidad.nombre}_${atributo.nombre}`, entidades: e };

        dispatch(createElement({ elementData: data, type: "relacion" }));

    }


    function handleSubmit(e) {
        e.preventDefault();
        dispatch(saveState());
        transformarAtributoPolivalente(atributoPolivalente);

        close();
    }

    return (
        <>
            <dialog id="transformarAtributosPolivalentes" className="modal" onClose={close}>
                <h1>
                    Transformar atributos polivalentes
                </h1>
                <form method="post" onSubmit={handleSubmit} id="transformarAtributosPolivalentesForm">
                    <label>
                        Se eliminará el atributo polivalente {nombreAtributo}, de la entidad {nombreEntidad} siendo reemplazado por una entidad y una relación.
                    </label>
                    <br />
                    <input type="submit" value="Aceptar" id="closeModal" className="modal-close-btn" />
                </form>
            </dialog>
        </>
    );
}


export default TransformarAtributosPolivalentes;