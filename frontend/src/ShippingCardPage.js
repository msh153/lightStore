import React, { useEffect, useState } from 'react';
import './ShippingCardPage.css';

function ShippingCardPage({ storedProducts, setStoredProducts, goToStore, prices }) {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [total, setTotal] = useState(0);
  const [quantityInputs, setQuantityInputs] = useState({});

  // Calculate total
  useEffect(() => {
    let totalPrice = 0;
    for (const productName in storedProducts) {
      const price = prices[productName];
      const quantity = storedProducts[productName];
      totalPrice += price * quantity;
    }
    setTotal(totalPrice);
  }, [storedProducts, prices]);

  const removeFromCart = (productName) => {
    const updatedCart = { ...storedProducts };
    delete updatedCart[productName];
    setStoredProducts(updatedCart);
  
    // Recalculate total
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
  
  const handleQuantityChange = (productName, newQuantity) => {
    const updatedCart = { ...storedProducts };
    updatedCart[productName] = parseInt(newQuantity, 10);
    setStoredProducts(updatedCart);
  
    // Recalculate total price
    let totalPrice = 0;
    for (const [name, quantity] of Object.entries(updatedCart)) {
      const price = prices[name] || 0;
      totalPrice += price * quantity;
    }
    setTotal(totalPrice);
  };
  
  
  return (
    <div className="shipping-card-page">
      <h1>Shipping Card</h1>
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
                  value={quantityInputs[productName] || quantity}
                  onChange={(e) => handleQuantityChange(productName, e.target.value)}
                />
              </label>
              <label className="product-price">Price: ${prices[productName] || 0}</label>
            </div>
            <button className="remove-button" onClick={() => removeFromCart(productName)}>
              Remove
            </button>
          </li>
        ))}
    </ul>
      <div className="total-price">Total Price: ${total}</div>
      <button className='submit-cart-button' onClick={submitCart}>Submit Cart</button>
      <button className='return-store-button' onClick={goToStore}>Return to Store</button>
    </div>
  );
}

export default ShippingCardPage;
