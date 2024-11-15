import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 
import image3 from '../components/honey.webp';

function Lock() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To show error messages
  const navigate = useNavigate();

  const toggleAuth = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert('Login successful!...Welcome back ' + username);
        navigate('/Home');
      } else {
        setError(result.message || 'Invalid credentials! Please try again.');
      }
    } catch (err) {
      setError('Error during login. Please try again.');
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert('Sign up successful! You can now log in.');
        toggleAuth();
      } else {
        setError(result.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Error during signup. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    <div style={styles.container}>
      {/* Navigation bar */}
      <nav style={styles.nav}>
        <h1 id="main-header" style={styles.navTitle}>Wings Cafe - Login </h1>
      </nav>

      <div className="container" id="auth-container" style={styles.formContainer}>
        <h2 id="auth-header" style={styles.formHeader}>
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <br />
          
          <button type="submit" style={styles.button}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {error && <div style={styles.error}>{error}</div>}

        <div className="switch" onClick={toggleAuth} style={styles.toggleLink}>
          {isLogin
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Login'}
        </div>
      </div>

     
    </div>
  );
}

// Internal CSS styles object
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: 'orange', // Fallback background color (for loading cases)
    backgroundImage: `url(${image3})`, // Use the imported image
    backgroundSize: 'cover', // Ensures the image covers the entire container
    backgroundPosition: 'center center', // Centers the image
    backgroundRepeat: 'no-repeat', // Prevents repeating the image
    minHeight: '100vh', // Ensures the container takes full height
    color: '#e2e8f0',
    justifyContent: 'center', // Center vertically
    alignItems: 'center', 
    display: 'flex',
  },
  nav: {
    backgroundColor: '#007bff',
    padding: '10px',
    width: '100%',
    textAlign: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1,
    borderBottom: 'solid 5px crimson',
    borderRadius: '10px',
  },
  navTitle: {
    color: 'white',
    margin: 0,
  },
  formContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '400px',
    marginTop: '80px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  toggleLink: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark footer background
    color: 'white',
    textAlign: 'center',
    padding: '10px 0',
    width: '100%',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default Lock;
