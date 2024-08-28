import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ children, open, onClose, className = '', isEmptyCartModal = false }) {
  const dialog = useRef();

  useEffect(() => {
    const modal = dialog.current;

    if (!modal) return;

    // Mostrar o cerrar el modal basado en el estado `open`
    if (open) {
      modal.showModal();
      modal.focus(); // Enfocar el modal al abrir
    } else {
      modal.close();
    }

    // Función para manejar el evento de cierre del modal
    const handleClose = () => {
      onClose();
    };

    // Función para manejar clics fuera del modal
    const handleOutsideClick = (event) => {
      if (modal && !modal.contains(event.target)) {
        onClose();
      }
    };

    // Agregar el manejador de eventos al modal
    modal.addEventListener('close', handleClose);

    // Agregar el manejador de eventos de clic fuera del modal si es el modal del carrito vacío
    if (isEmptyCartModal) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    // Limpiar los manejadores de eventos al desmontar el componente o actualizar
    return () => {
      modal.removeEventListener('close', handleClose);
      if (isEmptyCartModal) {
        document.removeEventListener('mousedown', handleOutsideClick);
      }
    };
  }, [open, onClose, isEmptyCartModal]);

  return createPortal(
    <dialog
      ref={dialog}
      className={`modal ${className}`}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      role="dialog"
    >
      {children}
    </dialog>,
    document.getElementById('modal')
  );
}
