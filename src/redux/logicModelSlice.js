import { v4 as uuidv4 } from 'uuid';
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    etapa: "conceptual",
    vista: "conceptual",
    modalAbierto: "",
    estadoActual: {},
    estadoInicial: {},
    estadosPrevios: [],
};


export const logicModelSlice = createSlice({
    name: "logicDiagram",
    initialState,
    reducers: {
        openModal: (state, action) => {
            const { modalAbierto } = action.payload;
            state.modalAbierto = modalAbierto;
        },
        closeModal: (state) => {
            state.modalAbierto = "";
        },
        toggleView: (state, action) => {
            const { vista } = action.payload;
            state.vista = vista;
        },
        saveState: (state, action) => {
            state.estadosPrevios.push(state.estadoActual);
        },
        undoState: (state, action) => {
            if (state.estadosPrevios.length > 0) {
                state.estadoActual = state.estadosPrevios.pop();
            } else {
                state.estadoActual = state.estadoInicial;
            }
        },
        startTransformation: (state, action) => {
            const { diagrama } = action.payload;
            state.etapa = "logica";
            state.vista = "logica";
            state.estadoActual = diagrama;
            state.estadoInicial = diagrama;
        },

        manageElements: (state, action) => {
            const { values, type, id, idAttribute, idc, operation, esRelacion } = action.payload;
            const { estadoActual } = state;
            var elemento = null;
            var elementos = [];
            var deleteId = id;
            if (type === "entidad") {
                elementos = estadoActual["entidades"];
                elemento = elementos.find((entidad) => entidad.id === id);
            }
            if (type === "relacion") {
                elementos = estadoActual["relaciones"];
                elemento = elementos.find((relacion) => relacion.id === id);
            }
            if (type === "atributo") {

                if (esRelacion !== undefined) {
                    deleteId = idAttribute;
                    const relaciones = estadoActual["relaciones"];
                    let relacion = relaciones.find((relacion) => relacion.id === id);
                    elementos = relacion["atributos"];
                    elemento = elementos.find((atributo) => atributo.id === idAttribute);
                }
                else {
                    deleteId = idAttribute;
                    const entidades = estadoActual["entidades"];
                    let entidad = entidades.find((entidad) => entidad.id === id);
                    if (idc === "-1") {
                        elementos = entidad["atributos"];
                        elemento = elementos.find((atributo) => atributo.id === idAttribute);
                    } else {
                        let atributosCompuestos = entidad["atributosCompuestos"];
                        let atributoCompuesto = atributosCompuestos.find((atributo) => atributo.id === idc);
                        elementos = atributoCompuesto["atributos"];
                        elemento = elementos.find((atributo) => atributo.id === idAttribute);
                    }
                }

            }
            if (type === "identificador compuesto") {
                const entidades = estadoActual["entidades"];
                let entidad = entidades.find((entidad) => entidad.id === id);
                elementos = entidad["identificadorCompuesto"];
                elemento = elementos.find((atributo) => atributo.id === idAttribute);
            }
            if (type === "atributo compuesto") {
                deleteId = idAttribute;
                const entidades = estadoActual["entidades"];
                let entidad = entidades.find((entidad) => entidad.id === id);
                elementos = entidad["atributosCompuestos"];
                elemento = elementos.find((atributo) => atributo.id === idAttribute);
            }
            if (operation === undefined) {
                Object.keys(values).forEach(key => {
                    elemento[key] = values[key];
                });
            } else if (operation === "borrar") {
                elementos.splice(elementos.findIndex((item) => item.id === deleteId), 1);
            }
        },

        createElement: (state, action) => {
            var elementos = [];
            const { elementData, type, id, idc, esRelacion } = action.payload;
            const { estadoActual } = state;
            if (type === "entidad") {
                elementos = estadoActual["entidades"];
            }
            if (type === "relacion") {
                elementos = estadoActual["relaciones"];
            }
            if (type === "atributo") {
                if (esRelacion !== undefined) {
                    const relaciones = estadoActual["relaciones"];
                    let relacion = relaciones.find((relacion) => relacion.id === id);
                    if (!relacion.atributos) {
                        relacion.atributos = [];
                    }
                    elementos = relacion["atributos"];
                } else {
                    const entidades = estadoActual["entidades"];
                    let entidad = entidades.find((entidad) => entidad.id === id);
                    if (idc === "-1") {
                        elementos = entidad["atributos"];
                    } else {
                        if (!entidad.atributosCompuestos) {
                            entidad.atributosCompuestos = [];
                        }
                        var atributosCompuestos = entidad["atributosCompuestos"];
                        let atributoCompuesto = atributosCompuestos.find((atributo) => atributo.id === idc);
                        if (!atributoCompuesto.atributos) {
                            atributoCompuesto.atributos = [];
                        }
                        elementos = atributoCompuesto["atributos"];
                    }
                }
            }
            if (type === "identificador compuesto") {
                const entidades = estadoActual["entidades"];
                let entidad = entidades.find((entidad) => entidad.id === id);
                elementos = entidad["identificadorCompuesto"];
            }
            if (type === "atributo compuesto") {
                const entidades = estadoActual["entidades"];
                let entidad = entidades.find((entidad) => entidad.id === id);
                if (!entidad.atributosCompuestos) {
                    entidad.atributosCompuestos = [];
                }
                elementos = entidad["atributosCompuestos"];
            }
            if (type === "externo") {
                const entidades = estadoActual["entidades"];
                let entidad = entidades.find((entidad) => entidad.id === id);
                elementos = entidad["atributos"];
            }

            const idElement = uuidv4();
            const elemento = { id: idElement, ...elementData, type };
            elementos.push(elemento);
        },
        deleteHierarchy: (state, action) => {
            const { id } = action.payload;
            const { estadoActual } = state;
            const entidades = estadoActual["entidades"];
            const entidad = entidades.find((entidad) => entidad.id === id);
            entidad.subType = "";
            entidad.cobertura = "";
            entidades.forEach(e1 => {
                var subType = e1.subType;
                entidad.hijos.forEach(idEntidad => {
                    if (e1.id === idEntidad) subType = "";
                })
                e1.subType = subType;
            })
/*             entidad.hijos = [];
 */        }
    }
})

export const { manageElements, createElement, deleteHierarchy, saveState, undoState, startTransformation, toggleView, openModal, closeModal } = logicModelSlice.actions;
export default logicModelSlice.reducer;