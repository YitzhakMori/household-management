// Login.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './LoginPage.module.css';
import Home from '../Home/Home';
import { LoginFormData } from '../../modules/LoginDate';



const LoginPage= () => {
  const [Data, setData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    

    try {
      const response = await fetch('http://localhost:5001/api/House/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Data )
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      navigate('/Home'); 


    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      
      <h1>ברוכים הבאים</h1>
      <div className={css.container}>
      <form onSubmit={handleSubmit}>
        <div className={css.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            id="email"
            value={Data.email}
            onChange={(e) => setData({ ...Data, email: e.target.value })}
            
            required
          />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={Data.password}
            onChange={(e) => setData({ ...Data, password: e.target.value })}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging In...' : 'Log In'}
        </button>
        {error && <p className={css.error}>{error}</p>}
      </form>
      <div className={css.links}>
        <div className={css.pis}>
        <p>
         ? אין לך חשבון <a href="/signUp">הרשם</a>
        </p>
        <p>
          <a href="/forgot-password">שכחתי סיסמה</a>
        </p>
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default LoginPage;