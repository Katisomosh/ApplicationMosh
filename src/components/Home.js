import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

import image1 from '../components/mthanda.jpg'; // Replace with your actual image paths
import image2 from '../components/getty.webp';
import image3 from '../components/honey.webp';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Home() {
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Image list for carousel
  const images = [image1, image2, image3];

  // CSS styles
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
    },
    header: {
      backgroundColor: 'rgb(58, 26, 26)',
      color: 'aqua',
      padding: '20px',
      textAlign: 'center',
    },
    nav: {
      backgroundColor: 'rgb(29, 24, 24)',
      padding: '10px',
      textAlign: 'center',
    },
    link: {
      color: 'white',
      textDecoration: 'none',
      padding: '10px 20px',
      margin: '0 10px',
      backgroundColor: '#007bff',
      borderRadius: '5px',
    },
    userSection: {
      position: 'absolute',
      right: '20px',
      top: '20px',
      color: 'aqua',
      fontSize: '24px',
    },
    content: {
      padding: '20px',
      textAlign: 'center',
      flexGrow: 1,
    },
    chartContainer: {
      width: '80%',
      height: '300px',
      margin: 'auto',
    },
    carouselImage: {
      width: '100%',
      maxWidth: '600px',
      height: 'auto',
      margin: '20px auto',
      borderRadius: '10px',
      transition: 'opacity 0.5s ease-in-out',
    },
  };

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => setProductList(data))
      .catch((error) => console.error('Error fetching products:', error));

    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
      navigate('/Home');
    } else {
      setLoggedInUser(loggedInUser);
    }
  }, [navigate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const filteredProducts = productList.filter((product) => product.quantity > 0);

  const chartData = {
    labels: filteredProducts.map((product) => product.name),
    datasets: [
      {
        label: 'Stock Quantity',
        data: filteredProducts.map((product) => product.quantity),
        backgroundColor: '#007bff',
        barThickness: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { font: { size: 12 } } },
      y: { ticks: { font: { size: 12 } } },
    },
    plugins: { legend: { display: false } },
  };

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    alert('You have been logged out.');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Dashboard - Wings Cafe Inventory System</h1>
        <div style={styles.userSection}>
          <span>{loggedInUser}</span>
        </div>
      </header>

      <nav style={styles.nav}>
        <Link to="/Home" style={styles.link}>Dashboard</Link>
        <Link to="/ProductManagement" style={styles.link}>Product Management</Link>
        <Link to="/PurchasesManagement" style={styles.link}>Purchase Management</Link>
        <Link to="/UserManagement" style={styles.link}>User Management</Link>
        <button style={styles.logoutButton} onClick={logout}>Logout</button>
      </nav>

      <div style={styles.content}>
        <h2>Overview of Current Stock Levels</h2>

        {filteredProducts.length === 0 ? (
          <p style={{ color: 'red', fontSize: '16px' }}>No products found.</p>
        ) : (
          <div style={styles.chartContainer}>
            <Bar data={chartData} options={options} />
          </div>
        )}

        {/* Rotating image carousel */}
        <img
          src={images[currentImageIndex]}
          alt="Product rotation"
          style={styles.carouselImage}
        />
      </div>
    </div>
  );
}

export default Home;
