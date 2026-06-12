import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Footer from '../../components/Footer/Footer';
import './SignIn.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter a valid email and password.');
      return;
    }
    signIn(email, password);
    navigate('/browse');
  };

  return (
    <div className="signin">
      <div className="signin__bg"></div>
      <div className="signin__header">
        <Link to="/" className="signin__logo">NETFLUX</Link>
      </div>

      <div className="signin__body">
        <div className="signin__card">
          <h1>Sign In</h1>
          {error && <div className="signin__error">{error}</div>}
          
          <form className="signin__form" onSubmit={handleSubmit}>
            <div className={`signin__input-group ${email ? 'has-value' : ''}`}>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
              />
              <label htmlFor="email">Email address</label>
            </div>
            
            <div className={`signin__input-group ${password ? 'has-value' : ''}`}>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
              />
              <label htmlFor="password">Password</label>
            </div>

            <button type="submit" className="signin__btn">Sign In</button>

            <div className="signin__options">
              <div className="signin__remember">
                <input type="checkbox" id="remember" defaultChecked />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="signin__help">Need help?</a>
            </div>
          </form>

          <div className="signin__signup">
            <span className="signin__signup-text">New to Netflix?</span>
            <Link to="/" className="signin__signup-link">Sign up now.</Link>
          </div>

          <p className="signin__captcha">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
