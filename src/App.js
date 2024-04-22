import Diagrama from './components/Diagrama';
import BarraLateral from './components/BarraLateral';
import styles from './App.module.css';
import { useState } from 'react';
import CrearEntidad from './components/CrearEntidad';
import CrearRelacion from './components/CrearRelacion';
import CrearAtributo from './components/CrearAtributo';
import CrearJerarquía from './components/CrearJerarquía';
import { useSelector, /* useDispatch */ } from 'react-redux';
import EditarOBorrarElemento from './components/EditarOBorrarElemento';

const App = () => {
  const [mode, setMode] = useState("normal");
  const modalType = useSelector(state => state.modal.openDialog);
  const coordinate = useSelector(state => state.modal.coordinate);
  const elementEditOrDelete = useSelector(state => state.modal.elementEditOrDelete);
  const editOrDeleteOpen = useSelector(state => state.modal.editOrDeleteOpen);
  const element = useSelector(state => state.modal.elementEdit);

  const cbfunction = (estado) => {
    setMode(estado);
  }

  return (
    <div className={styles.container}>
      <BarraLateral cb={cbfunction} modo={mode} />
      <Diagrama cb={cbfunction} modo={mode} />
      <CrearEntidad isOpen={modalType === "entidad"} x={coordinate.x} y={coordinate.y} element={element} />
      <CrearRelacion isOpen={modalType === "relacion"} x={coordinate.x} y={coordinate.y} />
      <CrearAtributo isOpen={modalType === "atributo"} x={coordinate.x} y={coordinate.y} element={element} />
      <CrearJerarquía isOpen={modalType === "jerarquía"} x={coordinate.x} y={coordinate.y} />
      <EditarOBorrarElemento isOpen={editOrDeleteOpen} element={elementEditOrDelete} />
    </div>
  );
};

export default App;
