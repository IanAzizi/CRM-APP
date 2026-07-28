import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Sending login payload:', { username, password });
    
      const response = await axios.post(
        'http://office.bandarabbasmall.com:5000/api/auth/login',
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // اگر با کوکی یا سشن کار می‌کنی
        }
      );
    
      const { token, user } = response.data;
    
      

      
      
      //console.log('Sending login payload:', { username, password });

 

      localStorage.setItem('accessToken', token);
      localStorage.setItem('role', user.role);

      if (user.role === 'manager') {
        navigate('/dashboard/manager');
      } else {
        navigate('/dashboard/user');
      }

    } catch (err) {
      setError('نام کاربری یا رمز عبور اشتباه است.');
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2 style={styles.title}>ورود به سیستم</h2>

        <input
          type="text"
          placeholder="نام کاربری"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          autoComplete="username"
          required
        />

        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          autoComplete="current-password"
          required
        />

        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" style={styles.button}>ورود</button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    height: '100vh',
    background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    width: '320px',
    gap: '20px',
  },
  title: {
    marginBottom: '10px',
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#333',
  },
  input: {
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    padding: '12px',
    backgroundColor: '#2a5298',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
};

export default Login;
