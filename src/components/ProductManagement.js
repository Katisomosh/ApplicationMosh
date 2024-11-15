import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import image from '../components/braai.avif';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    id: null,
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    // Fetch products from backend
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm({ ...productForm, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { id, name, description, category, price, quantity } = productForm;

    if (id !== null) {
      // Update product in backend via PUT request
      fetch(`http://localhost:5000/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, category, price, quantity: parseInt(quantity) }),
      })
        .then((response) => response.json())
        .then(() => {
          // Update product locally
          const updatedProducts = products.map((product) =>
            product.product_id === id
              ? { ...productForm, price: parseFloat(price), quantity: parseInt(quantity) }
              : product
          );
          setProducts(updatedProducts);
        })
        .catch((err) => console.error('Error updating product:', err));
    } else {
      // Add product to backend via POST request
      fetch('http://localhost:5000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, category, price, quantity: parseInt(quantity) }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Add the new product locally
          setProducts([
            ...products,
            { product_id: data.product_id, name, description, category, price, quantity: parseInt(quantity) },
          ]);
        })
        .catch((err) => console.error('Error adding product:', err));
    }

    // Reset form
    setProductForm({
      id: null,
      name: '',
      description: '',
      category: '',
      price: '',
      quantity: '',
    });
  };

  const editProduct = (id) => {
    const product = products.find((product) => product.product_id === id);
    setProductForm({
      id: product.product_id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
    });
  };

  const deleteProduct = (id) => {
    fetch(`http://localhost:5000/products/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // If the product is deleted successfully from the backend, remove it locally
          const updatedProducts = products.filter((product) => product.product_id !== id);
          setProducts(updatedProducts);
        } else {
          console.error('Failed to delete product:', data.message);
        }
      })
      .catch((err) => console.error('Error deleting product:', err));
  };

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <Link to="/Home" style={styles.navLink}>Dashboard</Link>
        <Link to="/ProductManagement" style={styles.navLink}>Product Management</Link>
        <Link to="/PurchasesManagement" style={styles.navLink}>Purchase Management</Link>
        <Link to="/UserManagement" style={styles.navLink}>User Management</Link>
      </nav>

      {/* Product Form */}
      <form onSubmit={handleFormSubmit} style={styles.productForm}>
        <input
          type="text"
          name="name"
          value={productForm.name}
          onChange={handleInputChange}
          placeholder="Product Name"
          required
          style={styles.input}
        />
        <input
          type="text"
          name="description"
          value={productForm.description}
          onChange={handleInputChange}
          placeholder="Product Description"
          required
          style={styles.input}
        />
        <input
          type="text"
          name="category"
          value={productForm.category}
          onChange={handleInputChange}
          placeholder="Category"
          required
          style={styles.input}
        />
        <input
          type="number"
          name="price"
          value={productForm.price}
          onChange={handleInputChange}
          placeholder="Price"
          required
          style={styles.input}
        />
        <input
          type="number"
          name="quantity"
          value={productForm.quantity}
          onChange={handleInputChange}
          placeholder="Quantity"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>
          {productForm.id !== null ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      {/* Product Table */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.product_id} style={styles.tableRow}>
              <td style={styles.td}>{product.name}</td>
              <td style={styles.td}>{product.description}</td>
              <td style={styles.td}>{product.category}</td>
              <td style={styles.td}>{product.price}</td>
              <td style={styles.td}>{product.quantity}</td>
              <td style={styles.actions}>
                <button
                  style={styles.editButton}
                  onClick={() => editProduct(product.product_id)}
                >
                  Edit
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => deleteProduct(product.product_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// CSS styles as objects
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(to right, #2C3E50, #2980B9)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '30px',
    color: '#e2e8f0',
    backgroundImage: `url(${image})`, // Use the imported image
    backgroundSize: 'cover', // Ensures the image covers the entire container
    backgroundPosition: 'center center', // Centers the image
    backgroundRepeat: 'no-repeat',
  },
  nav: {
    backgroundColor: 'black',
    padding: '15px',
    textAlign: 'center',
  },
  navLink: {
    color: '#38bdf8',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '12px 20px',
    margin: '0 10px',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
  productForm: {
    backgroundColor: '#fff',
    padding: '30px',
    marginTop: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #4b5563',
    borderRadius: '5px',
    backgroundColor: '#334155',
    color: '#e2e8f0',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
  },
  submitButton: {
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#2980B9',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  table: {
    width: '100%',
    marginTop: '30px',
    borderCollapse: 'collapse',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  tableHeader: {
    backgroundColor: '#374151',
    color: '#e2e8f0',
    textAlign: 'left',
  },
  th: {
    padding: '10px',
    fontSize: '16px',
  },
  tableRow: {
    borderBottom: '1px solid #4b5563',
  },
  td: {
    padding: '10px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    backgroundColor: '#34d399',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    padding: '5px 10px',
  },
  deleteButton: {
    backgroundColor: '#f87171',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    padding: '5px 10px',
  },
};

export default ProductManagement;
