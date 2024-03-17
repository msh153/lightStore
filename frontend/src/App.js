import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StorePage from './StorePage';
import ShippingCardPage from './ShippingCardPage';
import OrdersHistoryPage from './OrdersHistoryPage';
import Navigation from './Navigation'; // Import the Navigation component

function App() {
  const [storedProducts, setStoredProducts] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : {};
  });
  const [prices, setPrices] = useState({});
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

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

  const calculateTotalPrice = (pricesProps) => {
    let totalPrice = 0;
    for (const productName in storedProducts) {
      const price = prices[productName] || pricesProps[productName];
      const quantity = storedProducts[productName] || 0;
      totalPrice += price * quantity;
    }
    setTotal(totalPrice)
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
        prices,
        updatePrices,
        setTotalItems,
      }}
    >
      <div className="App">
        <Router>
          <Navigation />
          <Routes>
            <Route exact path="/" element={<StorePage />} />
            <Route exact path="/cart" element={<ShippingCardPage />} />
            <Route exact path="/orders-history" element={<OrdersHistoryPage />} />
          </Routes>
        </Router>
      </div>
    </CartContext.Provider>
  );
}

export default App;
export const CartContext = createContext();
