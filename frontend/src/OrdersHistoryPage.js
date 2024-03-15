import React, { useState } from 'react';

const OrdersHistoryPage = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orders, setOrders] = useState([]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOrderIdChange = (e) => {
    setOrderId(e.target.value);
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3001/getOrders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phoneNumber, orderId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div>
      <h1>Orders History</h1>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input type="tel" id="phoneNumber" value={phoneNumber} onChange={handlePhoneNumberChange} />
      </div>
      <div>
        <label htmlFor="orderId">Order ID:</label>
        <input type="text" id="orderId" value={orderId} onChange={handleOrderIdChange} />
      </div>
      <button onClick={fetchOrders}>Search Orders</button>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <div>Order ID: {order._id}</div>
            <div>Email: {order.email}</div>
            <div>Phone Number: {order.phoneNumber}</div>
            <div>Address: {order.address}</div>
            <div>Cart: {JSON.stringify(order.cart)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersHistoryPage;
