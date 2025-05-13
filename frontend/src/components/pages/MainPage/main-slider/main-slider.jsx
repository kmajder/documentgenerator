import React, { useState, useEffect } from 'react';
import './main-slider.css';
import ip14pro from './slides/slide-images/ip14pro.png'
import moneyImage from './slides/slide-images/moneyImage.png'
import padlockImage from './slides/slide-images/padlock.png'
import InPost from './slides/slide-images/inpost.png'
const slides = [
    {
    content: 'Wbudowane hasłowanie plików',
    image: padlockImage,
    color: "#183B4E",
    width: '10%',
    marginLeft: '3rem',
    imageVisible: true
  },
  {
    content: 'Zamień Excela na setki gotowych plików PDF/Word',
    image: ip14pro,
    color: "#183B4E",
    width: '20%',
    marginLeft: '10px',
    imageVisible: false
  },
  {
    content: 'Wygeneruj setki dokumentów w kilka sekund',
    image: moneyImage,
    width: '20%',
    color: "#183B4E",
    marginLeft: 'auto',
    imageVisible: false
  },
  {
    content: 'Dodaj własne szablony!',
    image: ip14pro,
    color: "#183B4E",
    width: '20%',
    marginLeft: 'auto',
    imageVisible: false
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
        {slides[currentSlideIndex].imageVisible !== false && <img style={{ width: slides[currentSlideIndex].width, marginLeft: slides[currentSlideIndex].marginLeft}} src={slides[currentSlideIndex].image} alt="Slider Image"/>}
      </div>
    </div>
  );
  
}

export default Slider;
