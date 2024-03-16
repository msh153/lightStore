import React, { useState, createContext } from 'react';
import './App.css';
import StorePage from './StorePage';
import ShippingCardPage from './ShippingCardPage';

function App() {
  const [storedProducts, setStoredProducts] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : {};
  });
  const [page, setPage] = useState('store');
  const [prices, setPrices] = useState({});
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const goToCart = () => {
    setPage('cart');
  };

  const goToStore = () => {
    setPage('store');
  };

  const updatePrices = (newPrices) => {
    setPrices((prevPrices) => ({ ...prevPrices, ...newPrices }));
  };


  const updateTotalItems = (storedProducts) => {
    const totalItems = Object.values(storedProducts).reduce(
      (total, quantity) => total + quantity,
      0
    );
    setTotalItems(totalItems);
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    for (const productName in storedProducts) {
      const price = prices[productName] || 0;
      const quantity = storedProducts[productName] || 0;
      totalPrice += price * quantity;
    }
    return totalPrice;
  };

  return (
    <CartContext.Provider 
      value={{ 
          total,
          setTotal,
          storedProducts,
          setStoredProducts,
          totalItems,
          updateTotalItems,
          calculateTotalPrice,
          updatePrices
    }}>
      <div className="App">
        {page === 'store' && (
          <StorePage goToCart={goToCart} />
        )}
        {page === 'cart' && <ShippingCardPage goToStore={goToStore} prices={prices} />}
      </div>
    </CartContext.Provider>
  );
}

export default App;
export const CartContext = createContext();
