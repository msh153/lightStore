import React, { useEffect, useContext, useState } from 'react';
import './ShippingCardPage.css';
import { CartContext } from './App';
import { Link } from 'react-router-dom';

function ShippingCardPage() {
  const { total, setTotal, storedProducts, setStoredProducts, calculateTotalPrice, prices } = useContext(CartContext);

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  
  useEffect(() => {
    const totalPrice = calculateTotalPrice();
    setTotal(totalPrice);
  }, [storedProducts, prices, calculateTotalPrice, setTotal]);
  
  useEffect(() => {
    let totalPrice = 0;
    for (const productName in storedProducts) {
      const price = prices[productName];
      const quantity = storedProducts[productName];
      totalPrice += price * quantity;
    }
    setTotal(totalPrice);
  }, [storedProducts, prices, setTotal]);


  const removeFromCart = (productName) => {
    const updatedCart = { ...storedProducts };
    delete updatedCart[productName];
    setStoredProducts(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  
    // Recalculate total
    let totalPrice = 0;
    for (const [name, quantity] of Object.entries(updatedCart)) {
      const price = prices[name] || 0;
      totalPrice += price * quantity;
    }
    setTotal(totalPrice);
  };
  

  const handleQuantityChange = (productName, newQuantity) => {
    const updatedCart = { ...storedProducts };
    updatedCart[productName] = parseInt(newQuantity, 10);
    setStoredProducts(updatedCart);
  
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    // Recalculate total price
    let totalPrice = 0;
    for (const [name, quantity] of Object.entries(updatedCart)) {
      const price = prices[name] || 0;
      totalPrice += price * quantity;
    }
    setTotal(totalPrice);
  };
  
  const submitCart = async () => {
    try {
      const response = await fetch('http://localhost:3001/saveCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          phoneNumber,
          address,
          cart: storedProducts
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save cart');
      }

      setStoredProducts({});
      localStorage.removeItem('cart');
      alert('Cart submitted successfully!');
    } catch (error) {
      console.error('Error submitting cart:', error);
      alert('Failed to submit cart. Please try again later.');
    }
  };

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setStoredProducts(parsedCart);
    }
  }, []);  
  
  return (
    <div className="shipping-card-page">
      <div className="shipping-details">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <label htmlFor="address">Address:</label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        ></textarea>
      </div>
      <ul className="product-list">
        {Object.entries(storedProducts).map(([productName, quantity]) => (
          <li className="product-list-item" key={productName}>
            <div>
              <label className="product-name">{productName}</label>
              <label className="product-quantity">
                Quantity:
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(productName, e.target.value)}
                />
              </label>
              <label className="product-price">Price: ${prices[productName] * quantity || 0}</label>
            </div>
            <button className="remove-button" onClick={() => removeFromCart(productName)}>
              Remove
            </button>
          </li>
        ))}
    </ul>
      <div className="total-price">Total Price: ${total}</div>
      <button className='submit-cart-button' onClick={submitCart}>Submit Cart</button>
      <Link className='return-store-button' to="/" >Return to Store</Link>
    </div>
  );
}

export default ShippingCardPage;
