import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './SignupPage.module.css';
import { SignUpFormData } from '../../modules/LoginDate';
import Home from '../Home/Home';

const SignUpPage = () => {
  const [data, setData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/House/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const responseData = await response.json();
      console.log('signUp successful:', responseData);
      navigate('/verify-email',);
    } catch (error: any) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  return (
    <div className={css.signupContainer}>
    <h1>להרשמה</h1>
    <div className={css.formWrapper}>
      <form onSubmit={handleSubmit} className={css.signupForm}>
        <div className={css.formGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={data.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={data.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={data.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={css.submitButton}>Submit</button>
      </form>
    </div>
  </div>
  );
};

export default SignUpPage;