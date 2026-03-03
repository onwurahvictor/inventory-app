// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import './Login.css';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.email || !formData.password) {
//       setError('Please fill in all fields');
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setError('');
      
//       const result = await login(formData.email, formData.password);
      
//       if (result.success) {
//         navigate('/');
//       } else {
//         setError(result.error || 'Login failed');
//       }
//     } catch (error) {
//       setError('An error occurred during login');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <div className="login-header">
//           <div className="login-logo">
//             <span>📦</span>
//           </div>
//           <h2 className="login-title">Sign in to Inventory</h2>
//           <p className="login-subtitle">
//             Or{' '}
//             <Link to="/register" className="login-link">
//               create a new account
//             </Link>
//           </p>
//         </div>
        
//         <form className="login-form" onSubmit={handleSubmit}>
//           {error && (
//             <div className="alert alert-danger">
//               {error}
//             </div>
//           )}
          
//           <div className="form-group">
//             <label htmlFor="email" className="form-label">
//               Email address
//             </label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               required
//               value={formData.email}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Enter email"
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="password" className="form-label">
//               Password
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               required
//               value={formData.password}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Enter password"
//             />
//           </div>

//           <div className="form-options">
//             <div className="form-check">
//               <input
//                 id="remember-me"
//                 name="remember-me"
//                 type="checkbox"
//                 className="form-check-input"
//               />
//               <label htmlFor="remember-me" className="form-check-label">
//                 Remember me
//               </label>
//             </div>

//             <div className="form-link">
//               <a href="#" className="text-primary">
//                 Forgot password?
//               </a>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="btn btn-primary w-100"
//           >
//             {loading ? (
//               <>
//                 <span className="spinner spinner-sm mr-2"></span>
//                 Signing in...
//               </>
//             ) : (
//               'Sign in'
//             )}
//           </button>
//         </form>

//         <div className="login-demo">
//           <p className="text-muted text-sm">Demo credentials:</p>
//           <div className="text-sm">
//             <p><strong>Email:</strong> demo@example.com</p>
//             <p><strong>Password:</strong> any password works</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// src/pages/Login.js
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import './Login.css';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     const result = await login(email, password);
    
//     if (result.success) {
//       navigate('/');
//     } else {
//       setError(result.error || 'Login failed');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <h1>Sign In</h1>
//         <p className="subtitle">Enter your credentials to access your account</p>
        
//         {error && <div className="error-message">{error}</div>}
        
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">Email Address</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               required
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               required
//             />
//           </div>
          
//           <button 
//             type="submit" 
//             className="btn-primary"
//             disabled={loading}
//           >
//             {loading ? 'Signing in...' : 'Sign In'}
//           </button>
//         </form>
        
//         <div className="login-footer">
//           <p>
//             Don't have an account?{' '}
//             <Link to="/register">Sign up here</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials hint (optional)
  const showDemoHint = true;

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to your inventory management account</p>
        
        {error && (
          <div className="error-message">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ marginRight: '8px' }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          
          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        {showDemoHint && (
          <div className="demo-hint">
            <p>
              <strong>Development Mode:</strong> Any email/password will work.
              <br />
              <small>Example: test@example.com / anypassword</small>
            </p>
          </div>
        )}
        
        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register">Create one here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;