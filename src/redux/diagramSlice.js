import { v4 as uuidv4 } from 'uuid';
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    entidades: [
        {
            id: 0,
            x: 100,
            y: 100,
            nombre: "entidad1",
            type: "entidad",
            atributos: [
                {
                    id: 0,
                    x: 50,
                    y: 30,
                    nombre: "atributo 1",
                    type: "atributo"
                },
                {
                    id: 1,
                    x: 150,
                    y: 30,
                    nombre: "atributo 2",
                    type: "atributo"
                },
            ],
            identificadorCompuesto: [
                {
                    id: 0,
                    x: 50,
                    y: 200,
                    nombre: "dni",
                    type: "atributo"
                },
                {
                    id: 1,
                    x: 110,
                    y: 200,
                    nombre: "país",
                    type: "atributo"
                },
                {
                    id: 2,
                    x: 170,
                    y: 200,
                    nombre: "lalñsjfdk",
                    type: "atributo"
                },
            ]

        },
        {
            id: 1,
            x: 500,
            y: 100,
            nombre: "entidad2",
            type: "entidad",
            atributos: [
                {
                    id: 0,
                    x: 600,
                    y: 80,
                    nombre: "atributo 1",
                    type: "atributo"

                },
                {
                    id: 1,
                    x: 600,
                    y: 120,
                    nombre: "atributo 2",
                    clavePrimaria: true,
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: "n",
                    type: "atributo"
                },
            ],
            atributosCompuestos: [
                {
                    id: 0,
                    nombre: "compuesto",
                    x: 500,
                    y: 40,
                    type: "atributo compuesto",
                    atributos: [
                        {
                            id: 0,
                            x: 650,
                            y: 30,
                            nombre: "atributo 1",
                            type: "atributo",
                        },
                        {
                            id: 1,
                            x: 650,
                            y: 50,
                            nombre: "atributo 2",
                            type: "atributo"
                        },
                    ],
                }
            ]
        },
        {
            id: 2,
            x: 500,
            y: 300,
            nombre: "nueva entidad",
            type: "entidad",
            subType: "padre",
            hijos: [3, 4, 5],
            cobertura: "T,E",
            atributos: [],
            identificadorCompuesto: [
                {
                    id: 2,
                    type: "externo",
                    entidad: 1
                },
                {
                    id: 0,
                    x: 650,
                    y: 290,
                    nombre: "atributo 1",
                    type: "atributo"
                },
                {
                    id: 1,
                    x: 650,
                    y: 310,
                    nombre: "atributo 2",
                    type: "atributo"
                },

            ],
        },
        {
            id: 3,
            x: 430,
            y: 400,
            nombre: "sub 1",
            type: "entidad",
            subType: "hijo",
            atributos: []
        },
        {
            id: 4,
            x: 570,
            y: 400,
            nombre: "sub entidad 2",
            type: "entidad",
            subType: "hijo",
            atributos: []
        },
        {
            id: 5,
            x: 620,
            y: 400,
            nombre: "sub entidad 3",
            type: "entidad",
            subType: "hijo",
            atributos: []
        },
        {
            id: 6,
            x: 220,
            y: 400,
            nombre: "entidad a borrar",
            type: "entidad",
            atributos: []
        }
    ],
    relaciones: [
        {
            id: 0,
            x: 300,
            y: 100,
            nombre: "relacion",
            entidades: [
                {
                    id: 0,
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: "n",
                },
                {
                    id: 1,
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: "n",
                }
            ],
            type: "relacion",
        },
        {
            id: 1,
            x: 460,
            y: 200,
            nombre: "nueva relacion",
            entidades: [
                {
                    id: 1,
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: "n",
                },
                {
                    id: 2,
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: 1,
                }
            ],
            type: "relacion",
        },
    ],
}



export const diagramSlice = createSlice({
    name: "diagram",
    initialState,
    reducers: {
        manageElements: (state, action) => {
            const { values, type, id, idAttribute, idc, operation } = action.payload;
            var elemento = null;
            var elementos = [];
            if (type === "entidad") {
                elementos = state["entidades"];
                elemento = elementos.find((entidad) => entidad.id === id);
            }
            if (type === "relacion") {
                elementos = state["relaciones"];
                elemento = elementos.find((relacion) => relacion.id === id);
            }
            if (type === "atributo") {
                const entidades = state["entidades"];
                let entidad = entidades.find((entidad) => entidad.id === id);
                if (idc === -1) {
                    elementos = entidad["atributos"];
                    elemento = elementos.find((atributo) => atributo.id === idAttribute);
                } else {
                    let atributosCompuestos = entidad["atributosCompuestos"];

                    let atributoCompuesto = atributosCompuestos.find((atributo) => atributo.id === idc);
                    elementos = atributoCompuesto["atributos"];
                    elemento = elementos.find((atributo) => atributo.id === idAttribute);

                }
            }
            if (type === "identificador compuesto") {
                const entidades = state["entidades"];
                let entidad = entidades.find((entidad) => entidad.id === id);
                elementos = entidad["identificadorCompuesto"];
                elemento = elementos.find((atributo) => atributo.id === idAttribute);
            }
            if (type === "atributo compuesto") {
                const entidades = state["entidades"];
                let entidad = entidades.find((entidad) => entidad.id === id);
                elementos = entidad["atributosCompuestos"];
                elemento = elementos.find((atributo) => atributo.id === idAttribute);
            }
            if (operation === undefined) {
                Object.keys(values).forEach(key => {
                    elemento[key] = values[key];
                });
            } else if (operation === "borrar") {
                elementos.splice(elementos.findIndex((item) => item.id === id), 1);
            }
        },

        createElement: (state, action) => {
            var elementos = [];
            const { elementData, type, id, idc } = action.payload;
            if (type === "entidad") {
                elementos = state["entidades"];
            }
            if (type === "relacion") {
                elementos = state["relaciones"];
            }
            if (type === "atributo") {
                const entidades = state["entidades"];
                let entidad = entidades.find((entidad) => entidad.id === id);
                if (idc === -1) {
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
            if (type === "identificador compuesto") {
                const entidades = state["entidades"];
                let entidad = entidades.find((entidad) => entidad.id === id);
                elementos = entidad["identificadorCompuesto"];
            }
            if (type === "atributo compuesto") {
                const entidades = state["entidades"];
                let entidad = entidades.find((entidad) => entidad.id === id);
                if (!entidad.atributosCompuestos) {
                    entidad.atributosCompuestos = [];
                }
                elementos = entidad["atributosCompuestos"];
            }
            const idElement = uuidv4();
            const elemento = { ...elementData, id: idElement, type };
            elementos.push(elemento);
        }
    }
})

export const { manageElements, createElement } = diagramSlice.actions;
export default diagramSlice.reducer;