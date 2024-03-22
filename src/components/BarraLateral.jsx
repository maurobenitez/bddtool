import styles from './BarraLateral.module.css';
import DialogoModal from './DialogoModal';
import { useSelector, useDispatch } from 'react-redux';
import { changeEmail } from '../redux/userSlice';
const BarraLateral = ({ cb, modo }) => {
    const email = useSelector((state) => state.user.email);

    const abrirDialogo = () => {
        const dialog = document.getElementById('modal');
        dialog.showModal();
    }

    const cerrarDialogo = () => {
        const dialog = document.getElementById('modal');
        dialog.close();
    }
    return (
        <div className={styles.estilo}>
            <h1>Sidebar</h1>
            <p>{modo}</p>
            <button onClick={() => cb("añadir entidad")}>añadir entidad</button>
            <DialogoModal />
            <p>{email}</p>
        </div>
    );
}

export default BarraLateral;