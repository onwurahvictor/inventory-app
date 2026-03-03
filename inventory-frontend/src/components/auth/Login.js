import React, { useState } from 'react';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    console.log('Attempting login with:', {
      email: formData.email,
      password: '***'
    });

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: data.message || 'Login successful!' 
        });
        
        // Store token and user data
        if (data.data?.token) {
          localStorage.setItem('inventory_token', data.data.token);
          localStorage.setItem('inventory_user', JSON.stringify(data.data.user));
          console.log('Token stored:', data.data.token.substring(0, 20) + '...');
          
          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
        }
        
        // Clear form
        setFormData({
          email: '',
          password: ''
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Login failed' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage({ 
        type: 'error', 
        text: `Network error: ${error.message}. Check if backend is running.` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="auth-links">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="auth-link">
              Register here
            </a>
          </p>
          <p>
            <a href="/forgot-password" className="auth-link">
              Forgot password?
            </a>
          </p>
        </div>
        
        <div className="debug-info">
          <small>
            Backend URL: http://localhost:5000/api/auth/login<br />
            Test credentials: test@example.com / password123
          </small>
        </div>
      </form>
    </div>
  );
};

export default Login;