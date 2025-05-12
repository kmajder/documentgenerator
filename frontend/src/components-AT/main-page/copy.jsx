import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import AppleTrade from '../../assets/AppleTradePink.png';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
function Nav() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  const socialMediaDiv = () => {
  return (
    <div className="socialMedia">
      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
        <FaInstagram className="socialIcon" />
      </a>
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
        <FaFacebook className="socialIcon" />
      </a>
    </div>
  );
  };

  return (
    <header className="mainHeader">
      <Link to="/" className="caseXpertLogo">
        <img src={AppleTrade} className="caseXpertLogoImage" alt="Apple Trade Logo" />
      </Link>

      <div className="menu-toggle" onClick={toggleMenu}>
        &#9776; {/* Ikona hamburgera */}
      </div>

      <nav className={`navbar ${isMenuOpen ? 'open' : ''}`}>
        <div 
          className="dropdown"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="dropbtn">iPhone</button>
          <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}>
            <Link to="/kategorie/iphone-11">iPhone 11</Link>
            <Link to="/kategorie/iphone-12">iPhone 12</Link>
            <Link to="/kategorie/iphone-13">iPhone 13</Link>
            <Link to="/kategorie/iphone-14">iPhone 14</Link>
          </div>
          
        </div>
        <Link to="/sprzedaj-iphone" className="sellLink">Sprzedaj iPhone'a!</Link>
        <Link to="/about" className="about">O nas</Link>
      </nav>
      {socialMediaDiv()}
    </header>
  );
}

export default Nav;
