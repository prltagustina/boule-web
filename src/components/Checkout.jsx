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

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
    setError(''); // Limpiar el mensaje de error al cerrar
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
      .join(', ');

    const message = `Hola, me gustaría hacer un pedido:\n\n${orderDetails}\n\nTotal: ${currencyFormatter.format(cartTotal)}\n\nDetalles del cliente:\nNombre: ${customerData.name}\nEmail: ${customerData.email}\nCalle: ${customerData.street}\nCódigo postal: ${customerData['postal-code']}\nCiudad: ${customerData.city}\n\nMétodo de pago: ${paymentMethod}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/543426312155?text=${encodedMessage}`;

    // Abrir la aplicación de WhatsApp y mostrar mensaje de éxito
    window.open(whatsappLink, '_blank');
    alert('¡Pedido enviado correctamente por WhatsApp!');
    if (cartCtx.clearCart) { // Verifica que clearCart esté definido
      cartCtx.clearCart(); 
    }
    handleClose(); // Cerrar el modal de checkout
  }

  return (
    <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
      <form onSubmit={handleWhatsAppOrder}>
        <h2>Resumen del pedido</h2>
        <p>Monto total: {currencyFormatter.format(cartTotal)}</p>

        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mensaje de error */}

        <Input label="Nombre Completo" type="text" id="name" name="name" required />
        <Input label="Correo Electrónico" type="email" id="email" name="email" required />
        <Input label="Dirección" type="text" id="street" name="street" required />
        <div className="control-row">
          <Input label="Código Postal" type="text" id="postal-code" name="postal-code" required />
          <Input label="Ciudad" type="text" id="city" name="city" required />
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
          <Button type="submit"> {/* Cambiado a tipo submit para aprovechar la validación del formulario */}
            Enviar por WhatsApp
          </Button>
        </p>
      </form>
    </Modal>
  );
}
