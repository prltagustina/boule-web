<<<<<<< HEAD
import Header from "./components/Header";
import Meals from "./components/Meals";
function App() {
  return (
    <>
      <Header />
      <Meals />
    </>
  );
}

export default App;
=======
import Cart from './components/Cart.jsx';
import Header from './components/Header.jsx';
import Meals from './components/Meals.jsx';
import { CartContextProvider } from './store/CartContext.jsx';
import { UserProgressContextProvider } from './store/UserProgressContext.jsx';

function App() {
  return (
    <UserProgressContextProvider>
      <CartContextProvider>
        <Header />
        <Meals />
        <Cart />
      </CartContextProvider>
    </UserProgressContextProvider>
  );
}

export default App;
>>>>>>> 5ca97e896659f01ace48d1e53c4f3ae89f4ab6e3
