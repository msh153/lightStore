import React, { useMemo, useEffect, useState, memo, useContext } from 'react';
import './StorePage.css';
import './App.css';
import { CartContext } from './App';
import { Link } from 'react-router-dom';


const sortByPrice = (products, sortOrder) => {
  return [...products].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });
};

const sortByDateAdded = (products, sortOrder) => {
  return [...products].sort((a, b) => {
    const dateA = new Date(a.dateAdded);
    const dateB = new Date(b.dateAdded);
    if (sortOrder === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
};

const Product = memo(({ product, favoriteMedicines, toggleFavorite, addToCart }) => {
  return (
    <div className="product">
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">Price: ${product.price}</p>
      <button className="add-to-cart-button" onClick={() => addToCart(product.name)}>
        {'Add to Cart'}
      </button>
      <button
        className="favorite-button"
        onClick={() => toggleFavorite(product.name)}
      >
        {favoriteMedicines.includes(product.name) ? '⭐' : '✰'}
      </button>
    </div>
  );
});

const StorePage = () => {
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState({});
  const [selectedShopId, setSelectedShopId] = useState();
  const [favoriteMedicines, setFavoriteMedicines] = useState([]);

  const { total, totalItems, updatePrices, calculateTotalPrice, setStoredProducts, updateTotalItems, setTotalItems } = useContext(CartContext);

  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  


  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavoriteMedicines(JSON.parse(savedFavorites));
    }
    
    const getAllShops = async () => {
      const response = await fetch('/api/getShopIds');
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
    const response = await fetch(`/api/getDrugs?shopvalue=${id}`);
    const data = await response.json();
    setProducts((prevProducts) => ({ ...prevProducts, [id]: data }));
    const productPrices = data.reduce((acc, product) => {
      acc[product.name] = product.price;
      return acc;
    }, {});
    updatePrices(productPrices);
    calculateTotalPrice(productPrices);
    setTotalItems(Object.values(JSON.parse(localStorage.cart)).reduce((a, b) => a + b, 0));
  };

  const addToCart = (productName) => {
    setStoredProducts((prevStoredProducts) => {
      const newStoredProducts = { ...prevStoredProducts };
      newStoredProducts[productName] = (prevStoredProducts[productName] || 0) + 1;
      localStorage.setItem('cart', JSON.stringify(newStoredProducts));
      updateTotalItems(newStoredProducts);
      calculateTotalPrice();
      return newStoredProducts;
    });
  };

  const toggleFavorite = (medicineName) => {
    setFavoriteMedicines((prevFavoriteMedicines) => {
      const newFavoriteMedicines = prevFavoriteMedicines.includes(medicineName)
        ? prevFavoriteMedicines.filter((name) => name !== medicineName)
        : [...prevFavoriteMedicines, medicineName];

      // Save favorites to local storage
      localStorage.setItem('favorites', JSON.stringify(newFavoriteMedicines));
      return newFavoriteMedicines;
    });
  };

  const sortedProducts = useMemo(() => {
    const favoriteProducts = Object.values(products[selectedShopId] || []).filter(
      (product) => favoriteMedicines.includes(product.name)
    );
    const nonFavoriteProducts = Object.values(products[selectedShopId] || []).filter(
      (product) => !favoriteMedicines.includes(product.name)
    );
  
    let sortedFavoriteProducts = [...favoriteProducts];
    let sortedNonFavoriteProducts = [...nonFavoriteProducts];
  
    if (sortBy === 'price') {
      sortedFavoriteProducts = sortByPrice(sortedFavoriteProducts, sortOrder);
      sortedNonFavoriteProducts = sortByPrice(sortedNonFavoriteProducts, sortOrder);
    } else if (sortBy === 'dateAdded') {
      sortedFavoriteProducts = sortByDateAdded(sortedFavoriteProducts, sortOrder);
      sortedNonFavoriteProducts = sortByDateAdded(sortedNonFavoriteProducts, sortOrder);
    }
  
    return [...sortedFavoriteProducts, ...sortedNonFavoriteProducts];
  }, [products, selectedShopId, favoriteMedicines, sortBy, sortOrder]);

  return (
    <div className="store-page">
      <div>
        <label htmlFor="shopSelect">Select a Shop:</label>
        { shops.length > 0 ?
            <select
            id="shopSelect"
            value={selectedShopId}
            onChange={(e) => {
              setSelectedShopId(e.target.value);
              getProducts(e.target.value);
            }}>
            {shops.map((shop) => (
              <option key={shop._id} value={shop._id}>
                {shop.name}
              </option>
            ))}
          </select>
          : 
            <select id="shopSelect" disabled>
              <option selected>No shops found</option>
            </select>
        }
      </div>
      {shops.length > 0 && 
        <div>
          <div className='sorting'>
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
            </div>
            <div>
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
          </div>
          <div className="product-list">
            {sortedProducts.map((product, index) => (
              <Product
                key={index}
                product={product}
                favoriteMedicines={favoriteMedicines}
                toggleFavorite={toggleFavorite}
                addToCart={addToCart}
              />
            ))}
          </div>
          <Link className='return-store-button' to="/cart">Go to Cart (Total: {total}$ - {totalItems} items)</Link>
        </div>
        }
      </div>
  );
};

export default StorePage;
