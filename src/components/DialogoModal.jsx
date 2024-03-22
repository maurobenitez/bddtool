import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeEmail } from '../redux/userSlice';

const DialogoModal = () => {

    const dispatch = useDispatch();
    const abrirDialogo = () => {
        const dialog = document.getElementById('modal');
        dialog.showModal();
    }

    const cerrarDialogo = () => {
        const dialog = document.getElementById('modal');
        dialog.close();
    }
    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        dispatch(changeEmail(form.email.value));
        console.log(form.email.value);
    }

    return (
        <>
            <button id="openModal" onClick={abrirDialogo}>abrir diálogo</button>
            <dialog id="modal" class="modal">
                <form method="post" onSubmit={handleSubmit}>
                    <label>
                        Text Input: <input name="email" />
                    </label>
                    <button id="closeModal" class="modal-close-btn" onClick={cerrarDialogo}>
                        guardar cambio
                    </button>
                    <button type="submit">
                        submit
                    </button>
                </form>

            </dialog>
        </>
    );
}

export default DialogoModal;