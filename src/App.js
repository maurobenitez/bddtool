import { useRef } from 'react';
import Diagrama from './components/Diagrama';
import BarraLateral from './components/BarraLateral';
import BarraDeHerramientas from './components/BarraDeHerramientas';
import styles from './App.module.css';
import { useState } from 'react';
import CrearEntidad from './components/CrearEntidad';
import CrearRelacion from './components/CrearRelacion';
import CrearAtributo from './components/CrearAtributo';
import CrearJerarquía from './components/CrearJerarquía';
import { useSelector, /* useDispatch */ } from 'react-redux';
import EditarOBorrarElemento from './components/EditarOBorrarElemento';
import DiagramaLógico from './components/DiagramaLógico';
import TransformarAtributosCompuestos from './components/transformacion/transformarAtributosCompuestos';
import TransformarAtributosPolivalentes from './components/transformacion/transformarAtributosPolivalentes';
import TransformarJerarquias from './components/transformacion/transformarJerarquias';
const App = () => {
  const [mode, setMode] = useState("normal");
  const r1 = useRef(null);
  const r2 = useRef(null);
  const modalType = useSelector(state => state.modal.openDialog);
  const openDialog = useSelector(state => state.logicDiagram.modalAbierto);
  const coordinate = useSelector(state => state.modal.coordinate);
  const elementEditOrDelete = useSelector(state => state.modal.elementEditOrDelete);
  const editOrDeleteOpen = useSelector(state => state.modal.editOrDeleteOpen);
  const element = useSelector(state => state.modal.elementEdit);
  const vista = useSelector(state => state.logicDiagram.vista);
  const cbfunction = (estado) => {
    setMode(estado);
  }

  const handleExportClick = () => {
    var r = vista === "conceptual" ? r1 : r2;
    if (r.current) {
      const uri = r.current.toDataURL();
      downloadURI(uri, 'stage.png');
    }
  };

  const downloadURI = (uri, name) => {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
      <BarraDeHerramientas handleExportClick={handleExportClick} />

      <div className={styles.container}>
        <BarraLateral cb={cbfunction} modo={mode} />
        {
          vista === "conceptual" ?
            <Diagrama cb={cbfunction} modo={mode} stageRef={r1} />
            :
            <DiagramaLógico stageRef={r2} />
        }
        <CrearEntidad isOpen={modalType === "entidad"} x={coordinate.x} y={coordinate.y} element={element} />
        <CrearRelacion isOpen={modalType === "relacion"} x={coordinate.x} y={coordinate.y} element={element} />
        <CrearAtributo isOpen={modalType === "atributo"} x={coordinate.x} y={coordinate.y} element={element} />
        <CrearJerarquía isOpen={modalType === "jerarquía"} x={coordinate.x} y={coordinate.y} element={element} />
        <EditarOBorrarElemento isOpen={editOrDeleteOpen} element={elementEditOrDelete} />
        <TransformarAtributosCompuestos isOpen={openDialog === "transformar atributo compuesto"} />
        <TransformarAtributosPolivalentes isOpen={openDialog === "transformar atributo polivalente"} />
        <TransformarJerarquias isOpen={openDialog === "transformar jerarquía"} />


      </div>
    </>
  );
};

export default App;
