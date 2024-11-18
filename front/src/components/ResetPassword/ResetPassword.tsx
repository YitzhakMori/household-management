import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import css from './ResetPassword.module.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5001/api/House/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (error:any) {
      setMessage(`Error resetting password: ${error.message}`);
    }
  };

  return (
    <div className={css.container}>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={css.submitButton}>Reset Password</button>
      </form>
      {message && <p className={css.message}>{message}</p>}
    </div>
  );
};

export default ResetPassword;
