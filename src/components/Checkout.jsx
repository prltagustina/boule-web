import { useContext, useState } from 'react';

import Modal from './UI/Modal.jsx';
import CartContext from '../store/CartContext.jsx';
import { currencyFormatter } from '../util/formatting.js';
import Input from './UI/Input.jsx';
import Button from './UI/Button.jsx';
import UserProgressContext from '../store/UserProgressContext.jsx';
import useHttp from '../hooks/useHttp.js';
import Error from './Error.jsx';

const requestConfig = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const [paymentMethod, setPaymentMethod] = useState(''); // Estado para el método de pago
  const [successMessage, setSuccessMessage] = useState(false); // Estado para controlar el modal de éxito

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp('http://localhost:3000/orders', requestConfig);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
    clearData();
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
    setSuccessMessage(false); // Cerrar el modal de éxito
  }

  function handleWhatsAppOrder(orderDetails, customerData) {
    const message = `Hola, me gustaría hacer un pedido:\n\n${orderDetails}\n\nTotal: ${currencyFormatter.format(cartTotal)}\n\nDetalles del cliente:\nNombre: ${customerData.name}\nEmail: ${customerData.email}\nCalle: ${customerData.street}\nCódigo postal: ${customerData['postal-code']}\nCiudad: ${customerData.city}\n\nMétodo de pago: ${paymentMethod}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/543426312155?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank');
    setSuccessMessage(true); // Mostrar el modal de éxito
  }

  function handleSubmit(event) {
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
      alert('Por favor, complete todos los campos y seleccione una forma de pago.');
      return;
    }

    // Validar que el carrito no esté vacío
    if (cartCtx.items.length === 0) {
      alert('El carrito está vacío. Añade productos antes de enviar el pedido.');
      return;
    }

    const orderDetails = cartCtx.items
      .map(
        (item) => `${item.name} (${item.quantity} x ${currencyFormatter.format(item.price)})`
      )
      .join('\n');

    // Enviar petición al backend
    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );

    // Enviar pedido por WhatsApp
    handleWhatsAppOrder(orderDetails, customerData);
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>
        Cerrar
      </Button>
      <Button>Enviar por WhatsApp</Button>
    </>
  );

  if (isSending) {
    actions = <span>Enviando pedido...</span>;
  }

  if (data && !error) {
    return (
      <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleFinish}>
        <h2>¡Pedido enviado correctamente!</h2>
        <p>Tu pedido ha sido enviado exitosamente. Nos pondremos en contacto contigo por email en breve.</p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Aceptar</Button>
        </p>
      </Modal>
    );
  }

  return (
    <>
      <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <h2>Checkout</h2>
          <p>Total: {currencyFormatter.format(cartTotal)}</p>

          <Input label="Nombre Completo" type="text" id="name" name="name" required />
          <Input label="Correo Electrónico" type="email" id="email" name="email" required />
          <Input label="Calle" type="text" id="street" name="street" required />
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

          {error && <Error title="No se pudo enviar el pedido" message={error} />}

          <p className="modal-actions">{actions}</p>
        </form>
      </Modal>

      {/* Modal de éxito para WhatsApp */}
      {successMessage && (
        <Modal open={successMessage} onClose={handleFinish}>
          <h2>¡Pedido enviado correctamente por WhatsApp!</h2>
          <p>Nos pondremos en contacto contigo pronto.</p>
          <Button onClick={handleFinish}>Cerrar</Button>
        </Modal>
      )}
    </>
  );
}
