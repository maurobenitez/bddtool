import styles from './BarraLateral.module.css';

const BarraLateral = ({ cb, modo }) => {
    return (
        <div className={styles.estilo}>
            <h1>Sidebar</h1>
            <p>{modo}</p>
            <button onClick={() => cb("añadir entidad")}>añadir entidad</button>
        </div>
    );
}

export default BarraLateral;