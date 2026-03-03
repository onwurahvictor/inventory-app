import React, { useState } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

// // const Register = () => {
// //   const { register, error, clearError, isAuthenticated } = useAuth();
// //   const [formData, setFormData] = useState({
// //     username: '',
// //     email: '',
// //     password: '',
// //     confirmPassword: ''
// //   });
// //   const [errors, setErrors] = useState({});
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [debugInfo, setDebugInfo] = useState('');

// //   // Clear errors when component mounts
// //   useEffect(() => {
// //     clearError?.();
// //   }, [clearError]);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
    
// //     // Clear field error when user starts typing
// //     if (errors[name]) {
// //       setErrors(prev => ({ ...prev, [name]: '' }));
// //     }
// //   };

// //   const validateForm = () => {
// //     const newErrors = {};
    
// //     if (!formData.username.trim()) {
// //       newErrors.username = 'Username is required';
// //     } else if (formData.username.length < 3) {
// //       newErrors.username = 'Username must be at least 3 characters';
// //     }

// //     if (!formData.email.trim()) {
// //       newErrors.email = 'Email is required';
// //     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
// //       newErrors.email = 'Please enter a valid email address';
// //     }

// //     if (!formData.password) {
// //       newErrors.password = 'Password is required';
// //     } else if (formData.password.length < 6) {
// //       newErrors.password = 'Password must be at least 6 characters';
// //     }

// //     if (!formData.confirmPassword) {
// //       newErrors.confirmPassword = 'Please confirm your password';
// //     } else if (formData.password !== formData.confirmPassword) {
// //       newErrors.confirmPassword = 'Passwords do not match';
// //     }

// //     return newErrors;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setDebugInfo('Starting registration...');
    
// //     const formErrors = validateForm();
// //     if (Object.keys(formErrors).length > 0) {
// //       setErrors(formErrors);
// //       setDebugInfo('Form validation failed');
// //       return;
// //     }

// //     setIsSubmitting(true);
// //     setErrors({});
// //     clearError?.();

// //     try {
// //       setDebugInfo('Calling register API...');
// //       console.log('Submitting registration:', formData);
      
// //       const result = await register(formData);
// //       console.log('Registration result:', result);
      
// //       if (result.success) {
// //         setDebugInfo('Registration successful! Redirecting...');
// //         // Registration successful - user will be redirected by AuthContext
// //       } else {
// //         setDebugInfo(`Registration failed: ${result.error}`);
// //         setErrors({ submit: result.error });
// //       }
// //     } catch (err) {
// //       console.error('Registration error in component:', err);
// //       setDebugInfo(`Error: ${err.message}`);
// //       setErrors({ submit: err.message });
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   // If already authenticated, show success message
// //   if (isAuthenticated) {
// //     return (
// //       <div className="auth-card">
// //         <div className="success-message">
// //           <h2>✅ Registration Successful!</h2>
// //           <p>You are now logged in. Redirecting to dashboard...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="auth-card">
// //       <h2>Create Account</h2>
      
// //       {debugInfo && (
// //         <div className="debug-info">
// //           <small>Debug: {debugInfo}</small>
// //         </div>
// //       )}
      
// //       {error && (
// //         <div className="error-message">
// //           <strong>Error:</strong> {error}
// //         </div>
// //       )}
      
// //       {errors.submit && (
// //         <div className="error-message">
// //           <strong>Registration Error:</strong> {errors.submit}
// //         </div>
// //       )}

// //       <form onSubmit={handleSubmit}>
// //         <div className="form-group">
// //           <label>Username *</label>
// //           <input
// //             type="text"
// //             name="username"
// //             value={formData.username}
// //             onChange={handleChange}
// //             placeholder="Enter username"
// //             disabled={isSubmitting}
// //           />
// //           {errors.username && (
// //             <div className="error-text">{errors.username}</div>
// //           )}
// //         </div>

// //         <div className="form-group">
// //           <label>Email *</label>
// //           <input
// //             type="email"
// //             name="email"
// //             value={formData.email}
// //             onChange={handleChange}
// //             placeholder="Enter email"
// //             disabled={isSubmitting}
// //           />
// //           {errors.email && (
// //             <div className="error-text">{errors.email}</div>
// //           )}
// //         </div>

// //         <div className="form-group">
// //           <label>Password *</label>
// //           <input
// //             type="password"
// //             name="password"
// //             value={formData.password}
// //             onChange={handleChange}
// //             placeholder="Enter password (min 6 characters)"
// //             disabled={isSubmitting}
// //           />
// //           {errors.password && (
// //             <div className="error-text">{errors.password}</div>
// //           )}
// //         </div>

// //         <div className="form-group">
// //           <label>Confirm Password *</label>
// //           <input
// //             type="password"
// //             name="confirmPassword"
// //             value={formData.confirmPassword}
// //             onChange={handleChange}
// //             placeholder="Confirm password"
// //             disabled={isSubmitting}
// //           />
// //           {errors.confirmPassword && (
// //             <div className="error-text">{errors.confirmPassword}</div>
// //           )}
// //         </div>

// //         <button 
// //           type="submit" 
// //           className="btn-primary"
// //           disabled={isSubmitting}
// //         >
// //           {isSubmitting ? 'Creating Account...' : 'Create Account'}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default Register;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Simple validation
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    console.log('Attempting registration with:', {
      ...formData,
      password: '***',
      confirmPassword: '***'
    });

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
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
          text: data.message || 'Registration successful!' 
        });
        
        // Store token and user data
        if (data.data?.token) {
          localStorage.setItem('inventory_token', data.data.token);
          localStorage.setItem('inventory_user', JSON.stringify(data.data.user));
          
          // Redirect after success
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        }
        
        // Clear form
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        console.log('Backend error details:', data);
        setMessage({ 
          type: 'error', 
          text: data.message || 'Registration failed' 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
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
      <h2>Register</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username *</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            placeholder="Enter username"
            required
            minLength="3"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Enter email"
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
            placeholder="Enter password (min 6 characters)"
            required
            minLength="6"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Confirm Password *</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            placeholder="Confirm password"
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        
        <div className="debug-info">
          <small>
            Backend URL: http://localhost:5000/api/auth/register
          </small>
        </div>
      </form>
    </div>
  );
};

export default Register;