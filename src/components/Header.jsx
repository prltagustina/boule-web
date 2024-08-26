import { useContext } from 'react';
import Button from './UI/Button.jsx';
import logoImg from '../assets/logo.svg'; // Cambiado a SVG
import CartContext from '../store/CartContext.jsx';
import UserProgressContext from '../store/UserProgressContext.jsx';

export default function Header() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
    return totalNumberOfItems + item.quantity;
  }, 0);

  function handleShowCart() {
    userProgressCtx.showCart();
  }

  return (
    <header id="main-header">
      <div id="title">
        {/* Cambiado a logo.svg */}
        <img src={logoImg} alt="Boule logo" width="150" height="150" />
        <h1>BOULE</h1>
      </div>
      {/* Añadido contenedor para el nav */}
      <div className="nav-container">
        <nav>
          <Button textOnly onClick={handleShowCart}>
            Pedido ({totalCartItems})
          </Button>
        </nav>
      </div>
    </header>
  );
}
