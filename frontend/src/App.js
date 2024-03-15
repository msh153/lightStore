import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [shopIds, setShopIds] = useState([]);
  const [products, setProducts] = useState([[]]);
  const [selectedShopId, setSelectedShopId] = useState();
  const [storedProducts, setStoredProducts] = useState([]);
  const [total, setTotal] = useState([]);


  const setQuantity = (e) => {
    setStoredProducts({[e.target.parentNode.parentNode.firstChild.textContent]: +e.target.value, ...storedProducts})
    setTotal(Object.values(storedProducts).length === 0
     ? +e.target.value
     : Object.values({[e.target.parentNode.parentNode.firstChild.textContent]: +e.target.value, ...storedProducts}).reduce((a, b) => a + +b, 0));
  }
  // const sendUser = async () => {
  //     // POST request using fetch with async/await
  //     const requestOptions = {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ userName: name, userAge: age })
  //     };
  //     await fetch(`api/addUser`, requestOptions)
  // };

  useEffect(() => {
    const getAllShopIds = async () => {
      const response = await fetch("http://localhost:3001/getShopIds");
        response.json().then(
          (res) =>{
            setShopIds(res);
            console.log(res)
            setSelectedShopId(res[0]);
            
            getProducts(res[0]);
          }
      );
    };
    getAllShopIds();
  }, []);

  const getProducts = async (id) => {
    setSelectedShopId(id);
    if(!id || !!products[id])
      return;

    const response = await fetch("http://localhost:3001/getDrugs?shopvalue=" + id);
    const myObj = { key: id };
    response.json().then((res) => setProducts({[myObj.key]: res, ...products}));
  };

  useEffect((id) => {
    if(!id)
      return;

    getProducts(id);
  }, [selectedShopId]);

  return (
    <div className="App">
      <>
        <label htmlFor="shopSelect">Select a Shop:</label>
        <select id="shopSelect" value={selectedShopId} onChange={e => getProducts(e.target.value)}>
          {shopIds ? shopIds.map((shopId) => (
            <option key={shopId} value={shopId}>
              {shopId}
            </option>
          )) : <text>No shops found</text>}
        </select>
        
        <header className="App-header">
          <table>
            <thead>
              <tr>
                <td>Name</td>
                <td>Price($)</td>
                <td>Quantity</td>
              </tr>
            </thead>
            <tbody>
              { products[selectedShopId] ? products[selectedShopId].map((p, index) => (
                            <tr key={index}>
                              <td>{p.name}</td>
                              <td>{p.price}</td>
                              <td><input name={p.name} type={"number"} onChange={(v)=>setQuantity(v)}/></td>
                            </tr>
                )) :  <tr><td>No products found</td></tr>
              }
            </tbody>
        </table>
          </header>
      </>
    </div>
  );
}

export default App;
