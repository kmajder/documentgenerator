import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import AppleTrade from '../../assets/AppleTradePink.png';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

function Nav() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null); // Referencja do hamburgera

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  // Funkcja do zamknięcia menu, gdy klikniemy poza nim i poza hamburgerem
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
        &#9776; {/* Ikona hamburgera */}
      </div>

      <nav ref={menuRef}>
        <Link to="/sprzedaj-iphone" className="sellLink">Sprzedaj iPhone'a!</Link>
        <Link to="/about" className="about">O nas</Link>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="socialOpen">
          <FaInstagram className="socialIcon" />
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="socialOpen">
          <FaFacebook className="socialIcon" />
        </a>
        <div className="socialMedia">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="socialIcon" />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="socialIcon" />
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
