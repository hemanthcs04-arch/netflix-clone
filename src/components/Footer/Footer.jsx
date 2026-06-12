import React from 'react';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__socials">
          <a href="#" className="footer__social-link"><FiFacebook /></a>
          <a href="#" className="footer__social-link"><FiInstagram /></a>
          <a href="#" className="footer__social-link"><FiTwitter /></a>
          <a href="#" className="footer__social-link"><FiYoutube /></a>
        </div>
        <ul className="footer__links">
          <li><a href="#">Audio Description</a></li>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Gift Cards</a></li>
          <li><a href="#">Media Center</a></li>
          <li><a href="#">Investor Relations</a></li>
          <li><a href="#">Jobs</a></li>
          <li><a href="#">Terms of Use</a></li>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Legal Notices</a></li>
          <li><a href="#">Cookie Preferences</a></li>
          <li><a href="#">Corporate Information</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
        <div className="footer__service">
          <button className="footer__service-btn">Service Code</button>
        </div>
        <div className="footer__copyright">
          © 2024 Netflix Clone. This is a demo project. Powered by TMDB API.
        </div>
      </div>
    </footer>
  );
}
