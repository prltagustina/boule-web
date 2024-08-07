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

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleWhatsAppOrder(event) {
    event.preventDefault();

    const fd = new FormData(event.target.form);
    const customerData = Object.fromEntries(fd.entries());

    const orderDetails = cartCtx.items.map(item => `${item.name} (${item.quantity} x ${currencyFormatter.format(item.price)})`).join(', ');
    const message = `Hola, me gustaría hacer un pedido:\n\n${orderDetails}\n\nTotal: ${currencyFormatter.format(cartTotal)}\n\nDetalles del cliente:\nNombre: ${customerData.name}\nEmail: ${customerData.email}\nCalle: ${customerData.street}\nCódigo postal: ${customerData['postal-code']}\nCiudad: ${customerData.city}\n\nMétodo de pago: ${paymentMethod}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/543426312155?text=${encodedMessage}`;

    window.open(whatsappLink, '_blank');
  }

  return (
    <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
      <form onSubmit={handleWhatsAppOrder}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

        <Input label="Full Name" type="text" id="name" />
        <Input label="E-Mail Address" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>

        <div>
          <label>Payment Method</label>
          <div>
            <input 
              type="radio" 
              id="cash" 
              name="payment-method" 
              value="Efectivo" 
              onChange={(e) => setPaymentMethod(e.target.value)} 
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
            />
            <label htmlFor="bank-transfer">Transferencia Bancaria</label>
          </div>
        </div>

        <p className="modal-actions">
          <Button type="button" textOnly onClick={handleClose}>
            Close
          </Button>
          <Button type="button" onClick={handleWhatsAppOrder}>
            Order via WhatsApp
          </Button>
        </p>
      </form>
    </Modal>
  );
}
