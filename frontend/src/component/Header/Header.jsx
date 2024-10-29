import React, { useState } from 'react';
import './Header.css';
import Signup from '../SignUp/Signup';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <div className="header-logo">
        <a href="/">YourLogo</a>
      </div>
      <nav className={`header-nav ${isOpen ? 'open' : ''}`}>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <div className="auth-buttons">
          <a href="/signup" className="auth-button signup">Sign Up</a>
          <a href="/login" className="auth-button login">Login</a>
        </div>
      </nav>
      <div className="menu-toggle" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </header>
  );
};

export default Header;
