<<<<<<< HEAD
import Button from "./UI/Button";
import logoImg from "../assets/logo.jpg";
export default function Header() {
=======
import { useContext } from 'react';

import Button from './UI/Button.jsx';
import logoImg from '../assets/logo.jpg';
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

>>>>>>> 5ca97e896659f01ace48d1e53c4f3ae89f4ab6e3
  return (
    <header id="main-header">
      <div id="title">
        <img src={logoImg} alt="A restaurant" />
<<<<<<< HEAD
        <h1>Boule El Pan</h1>
      </div>
      <nav>
        <Button textOnly>Mi pedido (0)</Button>
      </nav>
    </header>
  );
}
=======
        <h1>ReactFood</h1>
      </div>
      <nav>
        <Button textOnly onClick={handleShowCart}>
          Cart ({totalCartItems})
        </Button>
      </nav>
    </header>
  );
}
>>>>>>> 5ca97e896659f01ace48d1e53c4f3ae89f4ab6e3
