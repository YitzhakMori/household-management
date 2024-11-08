import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './VerifyEmail.module.css';

const VerifyEmail = () => {
  const [code, setCode] = useState<string>('');
  const navigate = useNavigate();

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/House/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Invalid code');
      }

      const responseData = await response.json();
      console.log('Verification successful:', responseData);
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={css.container}>
    <h1>אימות מייל</h1>
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <input
          type="text"
          id="code"
          value={code}
          onChange={handleCodeChange}
          required
        />
        <label htmlFor="code">הכנס קוד</label>
      </div>
      <button type="submit" className={css.submitButton}>Submit</button>
    </form>
   
  </div>
  );
};

export default VerifyEmail;