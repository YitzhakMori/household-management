import React, { useState } from 'react';
import css from "./FogotPassword.module.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/House/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setMessage('Email sent! Please check your inbox.');
    } catch (error) {
      setMessage('Error sending email. Please try again.');
    }
  };

  return (
    <div className={css.container}>
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={css.submitButton}>Send Reset Link</button>
      </form>
      {message && <p className={css.message}>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
