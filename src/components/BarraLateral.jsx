import styles from './BarraLateral.module.css';
/* import DialogoModal from './DialogoModal';
 */
/* import { useSelector, useDispatch } from 'react-redux';
 *//* import { openDialog, closeDialog } from '../redux/modalSlice';
*/
/* import { manageElements } from '../redux/diagramSlice';
 */
const BarraLateral = ({ cb, modo }) => {
    /*     const dispatch = useDispatch();
     */
    return (
        <div className={styles.estilo}>
            <h1>Sidebar</h1>
            <p>{modo}</p>
            <button onClick={() => cb("entidad")}>añadir entidad</button>
            <button onClick={() => cb("relacion")}>añadir relación</button>
            <button onClick={() => cb("atributo")}>añadir atributo</button>
            <button onClick={() => cb("jerarquía")}>añadir jerarquía</button>
        </div>
    );
}

export default BarraLateral;