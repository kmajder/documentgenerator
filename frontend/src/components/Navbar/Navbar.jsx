import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import AppleTrade from './image.png';
import { FaFacebook, FaInstagram, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.js';

function Nav() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (e) => {
    if (
      menuRef.current && 
      !menuRef.current.contains(e.target) && 
      burgerRef.current && 
      !burgerRef.current.contains(e.target)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="mainHeader">
      <Link to="/" className="caseXpertLogo">
        <img src={AppleTrade} className="caseXpertLogoImage" alt="Apple Trade Logo" />
      </Link>

      <div ref={burgerRef} className="menu-toggle" onClick={toggleMenu}>
        &#9776;
      </div>

      <nav ref={menuRef} className={`navbar ${isMenuOpen ? 'open' : ''}`}>
        <div className="nav-buttons">
          <Link to="/upload" className="nav-button primary">
            Wygeneruj dokument
          </Link>
          {user && (
            <Link to="/my-templates" className="nav-button secondary">
              Moje szablony
            </Link>
          )}
        </div>
        
        <div className="right-section">
          <div className="social-icons">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="socialIcon" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="socialIcon" />
            </a>
            {user && (
              <Link to="/account" className="account-icon">
                <FaUser className="socialIcon" />
              </Link>
            )}
            <Link to="/about" className="about">O nas</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Nav;