import { v4 as uuidv4 } from 'uuid';
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    entidades: [
        {
            id: "0",
            x: 100,
            y: 100,
            nombre: "entidad1",
            type: "entidad",
            atributos: [
                {
                    id: "0",
                    x: 50,
                    y: 30,
                    nombre: "atributo 1",
                    type: "atributo"
                },
                {
                    id: "1",
                    x: 150,
                    y: 30,
                    nombre: "atributo 2",
                    type: "atributo"
                },
                {
                    id: "ic00",
                    x: 50,
                    y: 200,
                    nombre: "dni",
                    type: "atributo",
                    clavePrimaria: true,
                },
                {
                    id: "ic01",
                    x: 110,
                    y: 200,
                    nombre: "país",
                    type: "atributo",
                    clavePrimaria: true,

                },
                {
                    id: "ic02",
                    x: 170,
                    y: 200,
                    nombre: "lalñsjfdk",
                    type: "atributo",
                    clavePrimaria: true,
                },
            ],
        },
        {
            id: "1",
            x: 500,
            y: 100,
            nombre: "entidad2",
            type: "entidad",
            atributos: [
                {
                    id: "0",
                    x: 600,
                    y: 80,
                    nombre: "atributo 1",
                    type: "atributo"
                },
                {
                    id: "1",
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
                    id: "0",
                    nombre: "compuesto",
                    x: 500,
                    y: 40,
                    type: "atributo compuesto",
                    atributos: [
                        {
                            id: "0",
                            x: 650,
                            y: 30,
                            nombre: "atributo 1",
                            type: "atributo",
                        },
                        {
                            id: "1",
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
            id: "2",
            x: 500,
            y: 300,
            nombre: "nueva entidad",
            type: "entidad",
            subType: "padre",
            hijos: ["3", "4", "5"],
            cobertura: "P,E",
            atributos: [
                /* {
                    id: "ic22",
                    type: "externo",
                    entidad: "1",
                }, */
                {
                    id: "ic20",
                    x: 650,
                    y: 290,
                    nombre: "atributo 1",
                    type: "atributo",
                    clavePrimaria: true,
                },
                {
                    id: "ic21",
                    x: 650,
                    y: 310,
                    nombre: "atributo 2",
                    type: "atributo",
/*                     clavePrimaria: true,
 */                },
            ],
        },
        {
            id: "3",
            x: 430,
            y: 400,
            nombre: "sub 1",
            type: "entidad",
            subType: "hijo",
            atributos: [
                {
                    x: 327.1166687011719,
                    y: 422,
                    nombre: 'a1',
                    clavePrimaria: false,
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: 1,
                    id: '9f3059a0-aadc-4230-ac0b-ab66314b60b0',
                    type: 'atributo'
                },
                {
                    x: 382.1166687011719,
                    y: 433,
                    nombre: 'b1',
                    clavePrimaria: false,
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: 1,
                    id: '21dff3ed-a4c4-47f6-83be-475ff7373e04',
                    type: 'atributo'
                }
            ]
        },
        {
            id: "4",
            x: 570,
            y: 400,
            nombre: "sub entidad 2",
            type: "entidad",
            subType: "hijo",
            atributos: [
                {
                    x: 467.1166687011719,
                    y: 446,
                    nombre: 'a2',
                    clavePrimaria: false,
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: 1,
                    id: '720f37e6-911e-4652-ab61-cdf6cfce9bd5',
                    type: 'atributo'
                },
                {
                    x: 498.1166687011719,
                    y: 424,
                    nombre: 'b2',
                    clavePrimaria: false,
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: 1,
                    id: 'b8ef1d0b-82c0-44f7-bf6a-18075375b39c',
                    type: 'atributo'
                }
            ]
        },
        {
            id: "5",
            x: 620,
            y: 400,
            nombre: "sub entidad 3",
            type: "entidad",
            subType: "hijo",
            atributos: [
                {
                    x: 601.1166687011719,
                    y: 455,
                    nombre: 'a3',
                    clavePrimaria: false,
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: 1,
                    id: 'f8747422-da99-4fc1-a3f6-4580b3b8227b',
                    type: 'atributo'
                },
                {
                    x: 554.1166687011719,
                    y: 436,
                    nombre: 'b3',
                    clavePrimaria: false,
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: 1,
                    id: '4c75cdec-8144-462b-bea1-e02cb20d6e71',
                    type: 'atributo'
                }
            ]
        },
        {
            id: "6",
            x: 220,
            y: 400,
            nombre: "entidad a borrar",
            type: "entidad",
            atributos: []
        }
    ],
    relaciones: [
        {
            id: "0",
            x: 300,
            y: 100,
            nombre: "relacion",
            entidades: [
                {
                    id: "0",
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: "n",
                },
                {
                    id: "1",
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: "n",
                }
            ],
            type: "relacion",
        },
        {
            id: "1",
            x: 460,
            y: 200,
            nombre: "nueva relacion",
            entidades: [
                {
                    id: "2",
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: "n",
                },
                {
                    id: "1",
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
            const { values, type, id, idAttribute, idc, operation, esRelacion } = action.payload;
            var elemento = null;
            var elementos = [];
            var deleteId = id;
            if (type === "entidad") {
                elementos = state["entidades"];
                elemento = elementos.find((entidad) => entidad.id === id);
            }
            if (type === "relacion") {
                elementos = state["relaciones"];
                elemento = elementos.find((relacion) => relacion.id === id);
            }
            if (type === "atributo") {

                if (esRelacion !== undefined) {
                    deleteId = idAttribute;
                    const relaciones = state["relaciones"];
                    let relacion = relaciones.find((relacion) => relacion.id === id);
                    elementos = relacion["atributos"];
                    elemento = elementos.find((atributo) => atributo.id === idAttribute);
                }
                else {
                    deleteId = idAttribute;
                    const entidades = state["entidades"];
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
                const entidades = state["entidades"];
                let entidad = entidades.find((entidad) => entidad.id === id);
                elementos = entidad["identificadorCompuesto"];
                elemento = elementos.find((atributo) => atributo.id === idAttribute);
            }
            if (type === "atributo compuesto") {
                deleteId = idAttribute;
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
                console.log("aquí2")
                elementos.splice(elementos.findIndex((item) => item.id === deleteId), 1);
            }
        },

        createElement: (state, action) => {
            var elementos = [];
            const { elementData, type, id, idc, esRelacion } = action.payload;
            if (type === "entidad") {
                elementos = state["entidades"];
            }
            if (type === "relacion") {
                elementos = state["relaciones"];
            }
            if (type === "atributo") {
                if (esRelacion !== undefined) {
                    const relaciones = state["relaciones"];
                    let relacion = relaciones.find((relacion) => relacion.id === id);
                    if (!relacion.atributos) {
                        relacion.atributos = [];
                    }
                    elementos = relacion["atributos"];
                } else {
                    const entidades = state["entidades"];
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
            if (type === "externo") {
                const entidades = state["entidades"];
                let entidad = entidades.find((entidad) => entidad.id === id);
                elementos = entidad["atributos"];
            }

            const idElement = uuidv4();
            const elemento = { ...elementData, id: idElement, type };
            elementos.push(elemento);
        },
        deleteHierarchy: (state, action) => {
            const { id } = action.payload;
            const entidades = state["entidades"];
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

export const { manageElements, createElement, deleteHierarchy } = diagramSlice.actions;
export default diagramSlice.reducer;