import styles from './BarraDeHerramientas.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { saveState, undoState, startTransformation, toggleView, manageElements, createElement, deleteHierarchy, openModal } from '../redux/logicModelSlice';
import { v4 as uuidv4 } from 'uuid';
import 'boxicons/css/boxicons.min.css';

const BarraDeHerramientas = ({ handleExportClick }) => {
    const allData = useSelector(state => state.diagram);
    const etapa = useSelector(state => state.logicDiagram.etapa);
    const entidades = useSelector(state => state.logicDiagram.estadoActual.entidades);
    const relaciones = useSelector(state => state.logicDiagram.estadoActual.relaciones);

    const dispatch = useDispatch();
    const diagrama = useSelector(state => state.diagram);

    const getAtributoCompuesto = () => {
        var data = null;
        entidades.forEach(entidad => {
            if (entidad.atributosCompuestos && entidad.atributosCompuestos.length !== 0) {
                data = { idEntidad: entidad.id, idAtributoCompuesto: entidad.atributosCompuestos[0].id };
                return;
            }
        })
        return data;
    }

    const getAtributoPolivalente = () => {
        var atributoPolivalente = null;
        entidades.forEach(entidad => {
            entidad.atributos.forEach((atributo) => {
                if (atributo.cardinalidadMaxima && (atributo.cardinalidadMaxima === "n" || atributo.cardinalidadMaxima > 1)) {
                    atributoPolivalente = { idEntidad: entidad.id, idAtributo: atributo.id };
                    return;
                }
            });
        })
        return atributoPolivalente;
    }

    const getJerarquía = () => {
        var jerarquía = entidades.find(entidad => entidad.subType && entidad.subType === "padre");
        if (jerarquía === undefined) {
            return null;
        } else {
            return { id: jerarquía.id };
        }
    };

    const transformacionJerarquia1 = ({ id }) => {
        dispatch(deleteHierarchy({ id }));
        const entidadesHija = entidades.find(entidad => entidad.id === id).hijos;
        console.log(entidadesHija);
        var atributosEntidad = [];
        entidadesHija.forEach(idEntidad => {
            atributosEntidad.push(...entidades.find(entidad => entidad.id === idEntidad).atributos);
            dispatch(manageElements({ id: idEntidad, type: "entidad", operation: "borrar" }));
        })
        const moverAtributos = { values: { atributos: atributosEntidad }, type: "entidad", id };
        dispatch(manageElements(moverAtributos));
    }

    const transformacionJerarquia2 = ({ id }) => {
        dispatch(deleteHierarchy({ id }));
        const entidadPadre = entidades.find(entidad => entidad.id === id);
        const entidadesHija = entidadPadre.hijos;
        entidadesHija.forEach(idEntidadHija => {
            var entidadHija = entidades.find(entidad => entidad.id === idEntidadHija);
            const entidadesRelacion = [
                {
                    id: id,
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: 1,
                },
                {
                    id: idEntidadHija,
                    cardinalidadMinima: 1,
                    cardinalidadMaxima: 1,
                }
            ];

            const data = { x: (entidadPadre.x + entidadHija.x) / 2, y: (entidadPadre.y + entidadHija.y) / 2, nombre: `ES UN ${entidadHija.nombre}`, entidades: entidadesRelacion };

            dispatch(createElement({ elementData: data, type: "relacion" }));
        })

    }
    const existeEntidadEnRelacion = (idEntidad, relacion) => {
        const entidades = relacion.entidades;
        var existeEntidad = false;
        entidades.forEach(entidad => {
            if (entidad.id === idEntidad) existeEntidad = true;
        })
        return existeEntidad;
    }
    const buscarRelaciones = (idEntidad) => {
        const relacionesEncontradas = [];
        relaciones.forEach(relacion => {
            if (existeEntidadEnRelacion(idEntidad, relacion)) {
                relacionesEncontradas.push(relacion.id);
            }
        });
        return relacionesEncontradas;
    }

    const transformacionJerarquia3 = ({ id }) => {
        dispatch(deleteHierarchy({ id }));
        const entidadPadre = entidades.find(entidad => entidad.id === id);
        const entidadesHija = entidadPadre.hijos;
        const atributos = entidadPadre.atributos;
        const borrarEntidad = { id, type: "entidad", operation: "borrar" };
        dispatch(manageElements(borrarEntidad));
        const relacionesEncontradas = buscarRelaciones(id);
        relacionesEncontradas.forEach(relacion => {
            let relacionABorrar = { id: relacion, type: "relacion", operation: "borrar" };
            dispatch(manageElements(relacionABorrar));
        });

        atributos.forEach(atributo => {
            var coordenadas = { x: atributo.x - entidadPadre.x, y: atributo.y - entidadPadre.y };
            entidadesHija.forEach(entidadId => {
                var entidadHija = entidades.find(entidad => entidad.id === entidadId);
                var elementData = {
                    x: entidadHija.x + coordenadas.x, y: entidadHija.y + coordenadas.y, nombre: atributo.nombre, clavePrimaria: atributo.clavePrimaria, cardinalidadMinima: 1,
                    cardinalidadMaxima: 1
                };
                if (atributo.cardinalidadMinima !== undefined) {
                    elementData.cardinalidadMinima = atributo.cardinalidadMinima;
                    elementData.cardinalidadMaxima = atributo.cardinalidadMaxima;
                }
                dispatch(createElement({ elementData, type: "atributo", idc: "-1", id: entidadId }))
            })
        })

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

        const data = { x: (entidad.x + atributoCompuesto.x) / 2, y: (entidad.y + atributoCompuesto.y) / 2, nombre: `${entidad.nombre}_${atributoCompuesto.nombre}`, entidades };

        dispatch(createElement({ elementData: data, type: "relacion" }));
    }


    const transformarAtributoPolivalente = ({ idEntidad, idAtributo }) => {
        const entidad = entidades.find(entidad => entidad.id === idEntidad);
        const atributo = entidad.atributos.find(atributo => atributo.id === idAtributo);
        const borrarAtributo = { id: entidad.id, idAttribute: atributo.id, idc: "-1", type: "atributo", operation: "borrar" };
        dispatch(manageElements(borrarAtributo));
        const idElement = uuidv4();
        console.log(idElement);
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

    const transformarAtributocompuesto = ({ idEntidad, idAtributoCompuesto }) => {
        const entidad = entidades.find(entidad => entidad.id === idEntidad);
        const atributoCompuesto = entidad.atributosCompuestos.find(atributo => atributo.id === idAtributoCompuesto);
        transformacion3(entidad, atributoCompuesto);
    }

    const transformar = () => {
        if (getAtributoCompuesto()) {
            dispatch(openModal({ modalAbierto: "transformar atributo compuesto" }));
            return;
        }
        if (getAtributoPolivalente()) {
            dispatch(openModal({ modalAbierto: "transformar atributo polivalente" }));
            return;
        }
        if (getJerarquía()) {
            dispatch(openModal({ modalAbierto: "transformar jerarquía" }));
            return;
        }

    }

    async function getNewFileHandle() {
        const options = {
            types: [{
                description: 'Text Files',
                accept: {
                    'text/plain': ['.txt'],
                },
            }],
        };
        const handle = await window.showSaveFilePicker(options);
        return handle;
    }

    async function writeFile(fileHandle, contents) {
        const writable = await fileHandle.createWritable();
        await writable.write(contents);
        await writable.close();
    }

    const handleSave = async () => {
        try {
            const handle = await getNewFileHandle();
            const fileData = JSON.stringify(allData, null, 2);
            await writeFile(handle, fileData);
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    return (
        <div className={styles.estilo}>
            <button onClick={handleExportClick}>exportar</button>
            <i onClick={handleSave} class='bx bxs-save' style={{ color: '#543b3b' }}  ></i>
            {
                etapa === "conceptual" &&
                <button onClick={() => dispatch(startTransformation({ diagrama }))}>Transformar a modelo lógico</button>
            }
            {
                etapa === "logica" &&
                <>
                    <button onClick={() => dispatch(saveState())}>Guardar estado</button>
                    <i   ></i>
                    <i class='bx bx-undo' style={{ color: '#543b3b' }} onClick={() => dispatch(undoState())}></i>
                    <button onClick={() => dispatch(toggleView({ vista: "conceptual" }))}>modelo conceptual</button>
                    <button onClick={() => dispatch(toggleView({ vista: "lógica" }))}>modelo lógico</button>
                    <button onClick={transformar}>transformar</button>
                </>

            }

        </div>
    );
}

export default BarraDeHerramientas;