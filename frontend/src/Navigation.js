import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" activeClassName="active">Store</NavLink>
        </li>
        <li>
          <NavLink to="/cart" activeClassName="active">Cart</NavLink>
        </li>
        <li>
          <NavLink to="/orders-history" activeClassName="active">Orders History</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
