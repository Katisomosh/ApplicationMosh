import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import image1 from '../components/mthanda.jpg';


const UserManagement = () => {
  const [users, setUsers] = useState([]); // State for users
  const [userForm, setUserForm] = useState({
    user_id: null,  // Changed from id to user_id
    username: '',
    password: '',
  });

  // Fetch users from the backend
  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then((response) => response.json())
      .then((data) => setUsers(data)) // Using setUsers here
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { user_id, username, password } = userForm;

    if (user_id !== null) {
      // Update user in backend via PUT request
      fetch(`http://localhost:5000/users/${user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then(() => {
          // Update user locally
          const updatedUsers = users.map((user) =>
            user.user_id === user_id ? { ...userForm } : user // Use user_id here
          );
          setUsers(updatedUsers); // Update users state
        })
        .catch((err) => console.error('Error updating user:', err));
    } else {
      // Add new user to backend via POST request
      fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers([...users, { user_id: data.user_id, username, password }]); // Use user_id here
        })
        .catch((err) => console.error('Error adding user:', err));
    }

    // Reset form
    setUserForm({
      user_id: null,  // Reset to null for new user
      username: '',
      password: '',
    });
  };

  const editUser = (user_id) => {
    const user = users.find((user) => user.user_id === user_id); // Use user_id here
    setUserForm({
      user_id: user.user_id,  // Use user_id here
      username: user.username,
      password: user.password,
    });
  };

  const deleteUser = (user_id) => { // Use user_id instead of id
    if (!user_id) {
      console.error('Invalid user_id:', user_id);
      return; // Prevent further processing if user_id is invalid
    }

    console.log('Deleting user with ID:', user_id);

    fetch(`http://localhost:5000/users/${user_id}`, { // Use user_id here in URL
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUsers(users.filter((user) => user.user_id !== user_id)); // Use user_id in filter
        } else {
          console.error('Failed to delete user:', data.message);
        }
      })
      .catch((err) => console.error('Error deleting user:', err));
  };

 
  return (
  
<div style={styles.container}>
      <h1 style={styles.header}>User Management</h1>

      <nav>
        <Link to="/Home" style={styles.navLink}>Dashboard</Link>
        <Link to="/ProductManagement" style={styles.navLink}>Product Management</Link>
        <Link to="/PurchasesManagement" style={styles.navLink}>Purchase Management</Link>
        <Link to="/UserManagement" style={styles.navLink}>User Management</Link>
      </nav>

      <form onSubmit={handleFormSubmit} style={styles.form}>
        <input
          type="text"
          name="username"
          value={userForm.username}
          onChange={handleInputChange}
          placeholder="Username"
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          value={userForm.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>
          {userForm.user_id !== null ? 'Update User' : 'Add User'}  {/* Use user_id here */}
        </button>
      </form>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Password</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>  {/* Use user.user_id as the key */}
              <td style={styles.td}>{user.username}</td>
              <td style={styles.td}>{user.password}</td>
              <td style={styles.actions}>
                <button style={styles.editButton} onClick={() => editUser(user.user_id)}>
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button style={styles.deleteButton} onClick={() => deleteUser(user.user_id)}>
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#1e293b',
    minHeight: '100vh',
    color: '#e2e8f0',
    backgroundImage: `url(${image1})`, // Use the imported image
    backgroundSize: 'cover', // Ensures the image covers the entire container
    backgroundPosition: 'center center', // Centers the image
    backgroundRepeat: 'no-repeat',
    
  },
  header: {
    textAlign: 'center',
    fontSize: '2rem',
    color: '#38bdf8',
    marginBottom: '20px',
  },
  navLink: {
    display: 'inline-block',
    textDecoration: 'none',
    color: '#ffffff',
    backgroundColor: '#2563eb',
    padding: '10px 15px',
    borderRadius: '5px',
    fontWeight: 'bold',
    marginRight: '10px',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#1f2937',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    marginTop: '20px',
  },
  th: {
    padding: '15px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    textAlign: 'left',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderBottom: '3px solid #1e293b',
  },
  td: {
    padding: '15px',
    color: '#e2e8f0',
    backgroundColor: '#1f2937',
    borderBottom: '1px solid #374151',
    textAlign: 'left',
  },
  tableRow: {
    transition: 'background-color 0.3s ease',
  },
  tableRowHover: {
    backgroundColor: '#334155',
  },
  form: {
    backgroundColor: 'aqua',
    padding: '30px', // Adds padding around the form
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    maxWidth: '400px', // Limits form width to a maximum of 400px
    width: '100%', // Form takes full width up to the max-width
    margin: '0 auto',
    display: 'flex', // Aligns inputs vertically within the form
    flexDirection: 'column', // Stacks input fields vertically
    alignItems: 'center',
   }, // Centers el
  input: {
    padding: '8px',
    width: '100%',
    border: '1px solid #4b5563',
    borderRadius: '5px',
    backgroundColor: '#111827',
    color: '#e2e8f0',
    marginBottom: '10px',
    display: 'flex', // Center the form horizontally and vertically
    justifyContent: 'center', // Centers horizontally
    alignItems: 'center', //
  },
  submitButton: {
    padding: '8px 12px',
    backgroundColor: 'black',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  editButton: {
    padding: '8px 12px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '5px',
  },
  deleteButton: {
    padding: '8px 12px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  noUsersText: {
    textAlign: 'center',
    padding: '20px',
    color: '#9ca3af',
    fontStyle: 'italic',
  },
};


export default UserManagement;

