import React, { useState, useEffect } from 'react';
import './main-slider.css';
import ip14pro from './slides/slide-images/ip14pro.png'
import moneyImage from './slides/slide-images/moneyImage.png'
import InPost from './slides/slide-images/inpost.png'
const slides = [
  {
    content: 'Najlepsze ceny',
    image: moneyImage,
    width: '20%',
    color: "black"
  },
  {
    content: 'Kontakt już w 24 godziny',
    image: ip14pro,
    color: "black",
    width: '20%',
  },
  {
    content: 'Wysyłka InPost',
    image: InPost,
    color: "black",
    width: '20%',
  },
  {
    content: 'Gwarancja satysfakcji',
    image: ip14pro,
    color: "black",
    width: '20%',
  },
];

function Slider() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [fadeProp, setFadeProp] = useState('fade-in');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFadeProp('fade-out');
      setTimeout(() => {
        setCurrentSlideIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
        setFadeProp('fade-in');
      }, 1500); // Czas fade-out zgodny z CSS (1 sekunda)
    }, 3000); // Zmieniamy slajd co 3 sekundy

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="slider">
      <div
        className={`slider-content ${fadeProp}`}
        style={{
          color: slides[currentSlideIndex].color,
        }}
      >
        <h1>{slides[currentSlideIndex].content}</h1>
        <img style={{ width: slides[currentSlideIndex].width}} src={slides[currentSlideIndex].image} alt="Slider Image"/>
      </div>
    </div>
  );
  
}

export default Slider;
