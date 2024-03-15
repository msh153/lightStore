import React, { useEffect, useState } from 'react';
import './App.css';

function StorePage({ storedProducts, setStoredProducts, goToCart, updatePrices }) {
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState({});
  const [totalItemsInCart, setTotalItemsInCart] = useState();
  const [selectedShopId, setSelectedShopId] = useState();

  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const [favoriteMedicines, setFavoriteMedicines] = useState([]);

  const sortByPrice = (a, b) => {
    if (sortOrder === 'asc') {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  };
  
  const sortByDateAdded = (a, b) => {
    const dateA = new Date(a.dateAdded);
    const dateB = new Date(b.dateAdded);
    if (sortOrder === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  };
  
  useEffect(() => {
    const getAllShops = async () => {
      const response = await fetch('http://localhost:3001/getShopIds');
      const data = await response.json();
      setShops(data);
      if (data.length > 0) {
        setSelectedShopId(data[0]._id);
        getProducts(data[0]._id);
      }
    };
    getAllShops();
  }, []);

  const getProducts = async (id) => {
    if (!id || products[id]) return;
    const response = await fetch(`http://localhost:3001/getDrugs?shopvalue=${id}`);
    const data = await response.json();
    setProducts((prevProducts) => ({ ...prevProducts, [id]: data }));
    const productPrices = data.reduce((acc, product) => {
      acc[product.name] = product.price;
      return acc;
    }, {});
    updatePrices(productPrices);
  };

  const addToCart = (productName) => {
    setStoredProducts((prevStoredProducts) => ({
      ...prevStoredProducts,
      [productName]: (prevStoredProducts[productName] || 0) + 1
    }));
    
    localStorage.setItem('cart', JSON.stringify(storedProducts));
    console.log(JSON.stringify(storedProducts))
    setTotalItemsInCart(Object.values(storedProducts).reduce((total, quantity) => total + quantity, 0));
  };

  const toggleFavorite = (medicineName) => {
    setFavoriteMedicines((prevFavoriteMedicines) => {
      if (prevFavoriteMedicines.includes(medicineName)) {
        return prevFavoriteMedicines.filter((name) => name !== medicineName);
      } else {
        return [...prevFavoriteMedicines, medicineName];
      }
    });
  };
  
  return (
    <div className="store-page">
        <h1>Store</h1>
        <label htmlFor="shopSelect">Select a Shop:</label>
        <select
          id="shopSelect"
          value={selectedShopId}
          onChange={(e) => {
            setSelectedShopId(e.target.value);
            getProducts(e.target.value);
          }}
        >
          {shops.length > 0 ? (
            shops.map((shop) => (
              <option key={shop._id} value={shop._id}>
                {shop.name}
              </option>
            ))
          ) : (
            <option disabled>No shops found</option>
          )}
        </select>
        <div>
          <label htmlFor="sortBy">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">None</option>
            <option value="price">Price</option>
            <option value="dateAdded">Date Added</option>
            <option value="favorites">Favorites</option>
          </select>
          <label htmlFor="sortOrder">Order:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="product-list">
          {Object.values(products[selectedShopId] || [])
            .filter((product) => favoriteMedicines.includes(product.name) || sortBy !== 'favorites')
            .sort((a, b) => {
              if (sortBy === 'price') {
                return sortByPrice(a, b);
              } else if (sortBy === 'dateAdded') {
                return sortByDateAdded(a, b);
              } else {
                return 0;
              }
            })
            .map((product, index) => (
              <div key={index} className="product">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">Price: ${product.price}</p>
                <button className="add-to-cart-button" onClick={() => addToCart(product.name)}>
                {favoriteMedicines.includes(product.name) ? '⭐ Add to Cart' : 'Add to Cart'}
                </button>
                <button
                  className="favorite-button"
                  onClick={() => toggleFavorite(product.name)}
                >
                  {favoriteMedicines.includes(product.name) ? 'Unfavorite' : 'Favorite'}
                </button>
              </div>
            ))}
        </div>
      <button className='return-store-button' onClick={goToCart}>Go to Cart ({totalItemsInCart} {totalItemsInCart === 1 ? 'item' : 'items'})</button>
    </div>
  );
}

export default StorePage;
