import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiX, FiMonitor, FiDownload, FiSmartphone, FiSmile } from 'react-icons/fi';
import Footer from '../../components/Footer/Footer';
import './Landing.css';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (email) navigate('/signin');
  };

  const faqs = [
    {
      q: 'What is Netflix?',
      a: 'Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.'
    },
    {
      q: 'How much does Netflix cost?',
      a: 'Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee.'
    },
    {
      q: 'Where can I watch?',
      a: 'Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device.'
    },
    {
      q: 'How do I cancel?',
      a: 'Netflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks.'
    },
    {
      q: 'What can I watch on Netflix?',
      a: 'Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more.'
    },
    {
      q: 'Is Netflix good for kids?',
      a: 'The Netflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space.'
    }
  ];

  return (
    <div className="landing">
      {/* Hero Section */}
      <div className="landing__hero">
        <div className="landing__hero-bg"></div>
        <div className="landing__nav">
          <Link to="/" className="landing__logo">NETFLUX</Link>
          <Link to="/signin" className="landing__signin-btn">Sign In</Link>
        </div>
        <div className="landing__hero-content">
          <h1 className="landing__hero-title">Unlimited movies, TV shows, and more</h1>
          <p className="landing__hero-subtitle">Watch anywhere. Cancel anytime.</p>
          <p className="landing__hero-cta">Ready to watch? Enter your email to create or restart your membership.</p>
          <form className="landing__form" onSubmit={handleGetStarted}>
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="landing__get-started-btn">
              Get Started {'>'}
            </button>
          </form>
        </div>
      </div>

      <div className="landing__divider"></div>

      {/* Features Sections */}
      <div className="landing__feature">
        <div className="landing__feature-text">
          <h2>Enjoy on your TV</h2>
          <p>Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</p>
        </div>
        <div className="landing__feature-img-wrapper">
          <div className="landing__feature-placeholder"><FiMonitor /></div>
        </div>
      </div>

      <div className="landing__divider"></div>

      <div className="landing__feature landing__feature--reverse">
        <div className="landing__feature-text">
          <h2>Download your shows to watch offline</h2>
          <p>Save your favorites easily and always have something to watch.</p>
        </div>
        <div className="landing__feature-img-wrapper">
          <div className="landing__feature-placeholder"><FiDownload /></div>
        </div>
      </div>

      <div className="landing__divider"></div>

      <div className="landing__feature">
        <div className="landing__feature-text">
          <h2>Watch everywhere</h2>
          <p>Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.</p>
        </div>
        <div className="landing__feature-img-wrapper">
          <div className="landing__feature-placeholder"><FiSmartphone /></div>
        </div>
      </div>

      <div className="landing__divider"></div>

      <div className="landing__feature landing__feature--reverse">
        <div className="landing__feature-text">
          <h2>Create profiles for kids</h2>
          <p>Send kids on adventures with their favorite characters in a space made just for them—free with your membership.</p>
        </div>
        <div className="landing__feature-img-wrapper">
          <div className="landing__feature-placeholder"><FiSmile /></div>
        </div>
      </div>

      <div className="landing__divider"></div>

      {/* FAQ Section */}
      <div className="landing__faq">
        <h2>Frequently Asked Questions</h2>
        <div className="landing__faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="landing__faq-item">
              <button 
                className="landing__faq-question" 
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                {faq.q}
                {openFaq === index ? <FiX className="landing__faq-icon" /> : <FiPlus className="landing__faq-icon" />}
              </button>
              <div className={`landing__faq-answer ${openFaq === index ? 'landing__faq-answer--open' : ''}`}>
                <span>{faq.a}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="landing__hero-cta" style={{marginTop: '40px'}}>Ready to watch? Enter your email to create or restart your membership.</p>
        <form className="landing__form" onSubmit={handleGetStarted}>
          <input 
            type="email" 
            placeholder="Email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="landing__get-started-btn">
            Get Started {'>'}
          </button>
        </form>
      </div>

      <div className="landing__divider"></div>

      <Footer />
    </div>
  );
}
