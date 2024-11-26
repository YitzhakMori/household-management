import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './LoginPage.module.css';
import { LoginFormData } from '../../modules/LoginDate';

const LoginPage = () => {
  const [Data, setData] = useState<LoginFormData>({
    email: '',
    password: '',
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
        body: JSON.stringify(Data),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Invalid credentials');
      }

      // קריאה ל-JSON
      const data = await response.json();
      console.log('Login successful:', data);

      // שמירת הטוקן ב-localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('data', JSON.stringify(data.user));

      // console.log('Token saved:', data.token);

      // ניתוב לפי תפקיד המשתמש
      if (data.user.role === 'admin') {
        navigate('/admin');
        console.log('Navigating to admin');
      } else {
        navigate('/home');
        console.log('Navigating to home');
      }
    } catch (error: any) {
      console.error('Error:', error.message || error);
      setError(error.message || 'An error occurred');
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
            <input
              type="email"
              id="email"
              value={Data.email}
              onChange={(e) => setData({ ...Data, email: e.target.value })}
              required
            />
            <label>:הכנס אימייל</label>
          </div>
          <br />
          <div className={css.formGroup}>
            <input
              type="password"
              id="password"
              value={Data.password}
              onChange={(e) => setData({ ...Data, password: e.target.value })}
              required
            />
            <label htmlFor="password">:הכנס סיסמה</label>
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
