import { useContext, useState } from 'react';

import Modal from './UI/Modal.jsx';
import CartContext from '../store/CartContext.jsx';
import { currencyFormatter } from '../util/formatting.js';
import Input from './UI/Input.jsx';
import Button from './UI/Button.jsx';
import UserProgressContext from '../store/UserProgressContext.jsx';

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(false); // Estado para controlar el modal de éxito

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
    setError(''); // Limpiar el mensaje de error al cerrar
  }

  function handleSuccessClose() {
    setSuccessMessage(false); // Cerrar el modal de éxito
  }

  function handleWhatsAppOrder(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());

    // Validar que todos los campos estén completos
    if (
      !customerData.name.trim() || 
      !customerData.email.trim() ||
      !customerData.street.trim() ||
      !customerData['postal-code'].trim() ||
      !customerData.city.trim() ||
      !paymentMethod
    ) {
      setError('Por favor, complete todos los campos y seleccione una forma de pago.');
      return;
    }

    // Validar que el carrito no esté vacío
    if (cartCtx.items.length === 0) {
      setError('El carrito está vacío. Añade productos antes de enviar el pedido.');
      return;
    }

    // Crear mensaje para enviar por WhatsApp
    const orderDetails = cartCtx.items
      .map(
        (item) => `${item.name} (${item.quantity} x ${currencyFormatter.format(item.price)})`
      )
      .join('\n')

    const message = `Hola, me gustaría hacer un pedido:\n\n${orderDetails}\n\nTotal: ${currencyFormatter.format(cartTotal)}\n\nDetalles del cliente:\nNombre: ${customerData.name}\nEmail: ${customerData.email}\nCalle: ${customerData.street}\nCódigo postal: ${customerData['postal-code']}\nCiudad: ${customerData.city}\n\nMétodo de pago: ${paymentMethod}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/543426312155?text=${encodedMessage}`;

    // Abrir la aplicación de WhatsApp y mostrar mensaje de éxito
    window.open(whatsappLink, '_blank');
    setSuccessMessage(true); // Mostrar el modal de éxito
    if (cartCtx.clearCart) { // Verifica que clearCart esté definido
      cartCtx.clearCart(); 
    }
    handleClose(); // Cerrar el modal de checkout
  }

  return (
    <>
      <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
        <form onSubmit={handleWhatsAppOrder}>
          <h2>Resumen del pedido</h2>
          <p>Monto total: {currencyFormatter.format(cartTotal)}</p>

          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mensaje de error */}

          <div>
            <label htmlFor="name">Nombre Completo</label>
            <Input type="text" id="name" name="name" required autoComplete="name" />
          </div>
          <div>
            <label htmlFor="email">Correo Electrónico</label>
            <Input type="email" id="email" name="email" required autoComplete="email" />
          </div>
          <div>
            <label htmlFor="street">Dirección</label>
            <Input type="text" id="street" name="street" required autoComplete="address-line1" />
          </div>
          <div className="control-row">
            <div>
              <label htmlFor="postal-code">Código Postal</label>
              <Input type="text" id="postal-code" name="postal-code" required autoComplete="postal-code" />
            </div>
            <div>
              <label htmlFor="city">Ciudad</label>
              <Input type="text" id="city" name="city" required autoComplete="address-level2" />
            </div>
          </div>

          <div>
            <label>Método de pago</label>
            <div>
              <input 
                type="radio" 
                id="cash" 
                name="payment-method" 
                value="Efectivo" 
                onChange={(e) => setPaymentMethod(e.target.value)} 
                required
              />
              <label htmlFor="cash">Efectivo</label>
            </div>
            <div>
              <input 
                type="radio" 
                id="bank-transfer" 
                name="payment-method" 
                value="Transferencia Bancaria" 
                onChange={(e) => setPaymentMethod(e.target.value)} 
                required
              />
              <label htmlFor="bank-transfer">Transferencia Bancaria</label>
            </div>
          </div>

          <p className="modal-actions">
            <Button type="button" textOnly onClick={handleClose}>
              Cerrar
            </Button>
            <Button type="submit">
              Enviar por WhatsApp
            </Button>
          </p>
        </form>
      </Modal>

      {/* Modal de éxito */}
      <Modal open={successMessage} onClose={handleSuccessClose}>
        <h2>¡Pedido enviado correctamente por WhatsApp!</h2>
        <Button type="button" onClick={handleSuccessClose}>
          Cerrar
        </Button>
      </Modal>
    </>
  );
}
