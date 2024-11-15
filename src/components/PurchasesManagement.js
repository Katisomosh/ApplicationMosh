import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import image2 from '../components/getty.webp';

const PurchaseManagement = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  const updateProductQuantity = (updatedProduct) => {
    fetch(`http://localhost:5000/products/${updatedProduct.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then(() => {
        const updatedProducts = products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        );
        setProducts(updatedProducts);
      })
      .catch((err) => console.error('Error updating product:', err));
  };

  const handleBuy = (index) => {
    const product = products[index];
    const quantityToBuy = prompt('Enter quantity to buy:', '1');
    if (quantityToBuy && !isNaN(quantityToBuy)) {
      const updatedQuantity = product.quantity + parseInt(quantityToBuy);
      const updatedProduct = { ...product, quantity: updatedQuantity };
      updateProductQuantity(updatedProduct);
    }
  };

  const handleSell = (index) => {
    const product = products[index];
    if (!product) {
      console.error('Product not found!');
      return;
    }

    const quantityToSell = prompt('Enter quantity to sell:', '1');
    if (quantityToSell && !isNaN(quantityToSell) && product.quantity >= quantityToSell) {
      const updatedQuantity = product.quantity - quantityToSell;
      const updatedProduct = { ...product, quantity: updatedQuantity };
      updateProductQuantity(updatedProduct);
    } else {
      alert('Invalid quantity or insufficient stock!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.header}>Purchase Management - Wings Cafe Inventory System</h1>
      </div>

      <nav>
        <Link to="/Home" style={styles.navLink}>Dashboard</Link>
        <Link to="/ProductManagement" style={styles.navLink}>Product Management</Link>
        <Link to="/PurchasesManagement" style={styles.navLink}>Purchase Management</Link>
        <Link to="/UserManagement" style={styles.navLink}>User Management</Link>
      </nav>

      <div style={styles.content}>
        
        {products.length > 0 ? (
          <div style={styles.productList}>
            {products.map((product, index) => (
              <div key={product.id} style={styles.productCard}>
                <p><strong>Product Name:</strong> {product.name}</p>
                <p><strong>Quantity:</strong> {product.quantity}</p>
                <p><strong>Price:</strong> M{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
                <button style={styles.button} onClick={() => handleBuy(index)}>Buy</button>
                <button style={styles.button} onClick={() => handleSell(index)}>Sell</button>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.noProductText}>No products available. Please add products first.</p>
        )}
      </div>
    </div>
  );
};

// Updated CSS styles as objects
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#1e293b',
    minHeight: '100vh',
    color: '#e2e8f0',
    backgroundImage: `url(${image2})`, // Use the imported image
    backgroundSize: 'cover', // Ensures the image covers the entire container
    backgroundPosition: 'center center', // Centers the image
    backgroundRepeat: 'no-repeat',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  header: {
    color: '#38bdf8',
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: "auto",
  },
  navLink: {
    textDecoration: 'none',
    color: 'white',
    backgroundColor: '#2563eb',
    padding: '10px 15px',
    borderRadius: '5px',
    fontWeight: 'bold',
    margin: '0 5px',
  },
  content: {
    padding: '20px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#34d399',
    marginBottom: '15px',
  },
  productList: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  productCard: {
    border: '1px solid #374151',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#111827',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    width: 'calc(33% - 10px)',
    boxSizing: 'border-box',
    textAlign: 'center',
    color: '#e2e8f0',
  },
  noProductText: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  button: {
    padding: '12px',
    width: '100%',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px',
  },
  buttonHover: {
    backgroundColor: '#1d4ed8',
  },
};

export default PurchaseManagement;
