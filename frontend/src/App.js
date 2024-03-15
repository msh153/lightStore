import React, { useState } from 'react';
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

  const goToCart = () => {
    setPage('cart');
  };

  const goToStore = () => {
    setPage('store');
  };

  const updatePrices = (newPrices) => {
    setPrices((prevPrices) => ({ ...prevPrices, ...newPrices }));
  };
  return (
    <div className="App">
      {page === 'store' && <StorePage storedProducts={storedProducts} setStoredProducts={setStoredProducts} goToCart={goToCart} updatePrices={updatePrices} />}
      {page === 'cart' && <ShippingCardPage storedProducts={storedProducts} setStoredProducts={setStoredProducts} goToStore={goToStore} prices={prices} />}
    </div>
  );
}

export default App;
