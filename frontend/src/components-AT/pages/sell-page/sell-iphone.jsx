import React, { useState } from 'react';
import './sell-iphone.css';
import Nav from "../../main-page/Navbar.jsx";
import { BiInfoCircle } from "react-icons/bi";
import emailjs from '@emailjs/browser';
import ReCAPTCHA from "react-google-recaptcha";
import { AiOutlinePlus } from 'react-icons/ai';
import ImageUploader from './components/image-uploader/image-uploader.jsx';


const iPhoneModels = {
  'iPhone 15': {
    storage: ['128GB', '256GB', '512GB'],
    colors: ['Różowy', 'Żółty', 'Zielony', 'Niebieski', 'Czarny']
  },
  'iPhone 15 Pro': {
    storage: ['128GB', '256GB', '512GB', '1TB'],
    colors: ['Tytan naturalny', 'Tytan niebieski', 'Tytan biały', 'Tytan czarny']
  },
  'iPhone 15 Pro Max': {
    storage: ['256GB', '512GB', '1TB'],
    colors: ['Tytan naturalny', 'Tytan niebieski', 'Tytan biały', 'Tytan czarny']
  },
  'iPhone 14': {
    storage: ['128GB', '256GB', '512GB'],
    colors: ['Niebieski', 'Fioletowy', 'Gwiezdna czerń', 'Księżycowa poświata', '(PRODUCT)RED', 'Żółty']
  },
  'iPhone 14 Plus': {
    storage: ['128GB', '256GB', '512GB'],
    colors: ['Niebieski', 'Fioletowy', 'Gwiezdna czerń', 'Księżycowa poświata', '(PRODUCT)RED', 'Żółty']
  },
  'iPhone 14 Pro': {
    storage: ['128GB', '256GB', '512GB', '1TB'],
    colors: ['Srebrny', 'Złoty', 'Gwiezdna czerń', 'Głęboki fiolet']
  },
  'iPhone 14 Pro Max': {
    storage: ['128GB', '256GB', '512GB', '1TB'],
    colors: ['Srebrny', 'Złoty', 'Gwiezdna czerń', 'Głęboki fiolet']
  },
  'iPhone 13': {
    storage: ['128GB', '256GB', '512GB'],
    colors: ['Różowy', 'Niebieski', 'Gwiezdna biel', '(PRODUCT)RED', 'Księżycowa poświata', 'Zielony']
  },
  'iPhone 13 mini': {
    storage: ['128GB', '256GB', '512GB'],
    colors: ['Różowy', 'Niebieski', 'Gwiezdna biel', '(PRODUCT)RED', 'Księżycowa poświata', 'Zielony']
  },
  'iPhone 13 Pro': {
    storage: ['128GB', '256GB', '512GB', '1TB'],
    colors: ['Srebrny', 'Grafitowy', 'Złoty', 'Sierra Blue', 'Zielony']
  },
  'iPhone 13 Pro Max': {
    storage: ['128GB', '256GB', '512GB', '1TB'],
    colors: ['Srebrny', 'Grafitowy', 'Złoty', 'Sierra Blue', 'Zielony']
  },
  'iPhone 12': {
    storage: ['64GB', '128GB', '256GB'],
    colors: ['Biały', 'Czarny', 'Niebieski', 'Zielony', 'Fioletowy', '(PRODUCT)RED']
  },
  'iPhone 12 mini': {
    storage: ['64GB', '128GB', '256GB'],
    colors: ['Biały', 'Czarny', 'Niebieski', 'Zielony', 'Fioletowy', '(PRODUCT)RED']
  },
  'iPhone 12 Pro': {
    storage: ['128GB', '256GB', '512GB'],
    colors: ['Srebrny', 'Grafitowy', 'Złoty', 'Pacyficzny niebieski']
  },
  'iPhone 12 Pro Max': {
    storage: ['128GB', '256GB', '512GB'],
    colors: ['Srebrny', 'Grafitowy', 'Złoty', 'Pacyficzny niebieski']
  },
  'iPhone 11': {
    storage: ['64GB', '128GB', '256GB'],
    colors: ['Fioletowy', 'Żółty', 'Zielony', 'Czarny', 'Biały', '(PRODUCT)RED']
  },
  'iPhone 11 Pro': {
    storage: ['64GB', '256GB', '512GB'],
    colors: ['Nocna zieleń', 'Srebrny', 'Gwiezdna szarość', 'Złoty']
  },
  'iPhone 11 Pro Max': {
    storage: ['64GB', '256GB', '512GB'],
    colors: ['Nocna zieleń', 'Srebrny', 'Gwiezdna szarość', 'Złoty']
  }
};


const states = [
  'Dostateczny',
  'Dobry',
  'Bardzo dobry',
  'Jak nowy'
];

const App = () => {
  const [selectedModel, setSelectedModel] = useState(Object.keys(iPhoneModels)[0]);
  const [selectedStorage, setSelectedStorage] = useState(iPhoneModels[selectedModel].storage[0]);
  const [selectedColor, setSelectedColor] = useState(iPhoneModels[selectedModel].colors[0]);
  const [functioning, setFunctioning] = useState('');
  const [batteryLevel, setBatteryLevel] = useState('');
  const [screenDamage, setScreenDamage] = useState('');
  const [condition, setCondition] = useState(states[0]);
  const [contactInfo, setContactInfo] = useState('');
  const [flooded, setFlooded] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [images, setImages] = useState([]);

  const sendEmailNotification = async (e) => {
    e.preventDefault();
  
    if (!captchaValue) {
      alert('Potwierdź, że nie jesteś robotem!');
      return;
    }
  
    const userInfo = {
      model: selectedModel,
      storage: selectedStorage,
      color: selectedColor,
      functioning: functioning,
      batteryLevel: batteryLevel,
      screenDamage: screenDamage,
      condition: condition,
      contactInfo: contactInfo,
      flooded: flooded,
      recaptcha: captchaValue, // dodaj token captcha
      images: images // Dodajemy obrazy w base64
    };
  
    try {
      console.log(JSON.stringify(userInfo))
      const response = await fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert('Wiadomość wysłana!');
      } else {
        alert(result.error || 'Wystąpił problem z wysłaniem wiadomości.');
      }
    } catch (error) {
      alert('Błąd połączenia z serwerem.');
    }
  };


  const onCaptchaChange = (value) => {
    console.log("Captcha value:", value);
    setCaptchaValue(value); // Save captcha response
  };

  
  

  return (
    <div className="app">
      <Nav />
      <header className="header">
        <h1>Sprzedaj iPhone'a!</h1>
      </header>

      <main className="main-content">
        <div className="form">
          <form className="product-form">
            <div className="form-group">
              <label htmlFor="model">Jaki model iPhone'a?</label>
              <select
                id="model"
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  setSelectedStorage(iPhoneModels[e.target.value].storage[0]);
                  setSelectedColor(iPhoneModels[e.target.value].colors[0]);
                }}
              >
                {Object.keys(iPhoneModels).map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="storage">Jaka wersja (GB)?</label>
              <select
                id="storage"
                value={selectedStorage}
                onChange={(e) => setSelectedStorage(e.target.value)}
              >
                {iPhoneModels[selectedModel].storage.map((storage) => (
                  <option key={storage} value={storage}>
                    {storage}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="color">Jaki kolor?</label>
              <select
                id="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                {iPhoneModels[selectedModel].colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="functioning">
                Czy iPhone działa sprawnie? 
                <span className="infoIcon">
                  <BiInfoCircle className="BiInfoCircle"/>
                  <span className="tooltip">Sprawny oznacza, że wszystkie funkcje działają bez problemu.</span>
                </span>
              </label>
              <input
                type="text"
                id="functioning"
                value={functioning}
                onChange={(e) => setFunctioning(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="battery">
                Jaki jest poziom baterii?
                <span className="infoIcon">
                  <BiInfoCircle className="BiInfoCircle"/>
                  <span className="tooltip">Podaj procentowy poziom zużycia baterii, np. 85%.</span>
                </span>
              </label>
              <input
                type="text"
                id="battery"
                value={batteryLevel}
                onChange={(e) => setBatteryLevel(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="screenDamage">
                Czy ekran jest uszkodzony?
                <span className="infoIcon">
                  <BiInfoCircle className="BiInfoCircle"/>
                  <span className="tooltip">Podaj, czy ekran ma pęknięcia lub inne uszkodzenia.</span>
                </span>
              </label>
              <input
                type="text"
                id="screenDamage"
                value={screenDamage}
                onChange={(e) => setScreenDamage(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="flooded">
                Czy iPhone był zalany?
                <span className="infoIcon">
                  <BiInfoCircle className="BiInfoCircle"/>
                  <span className="tooltip">Podaj, czy iPhone był narażony na wodę.</span>
                </span>
              </label>
              <input
                type="text"
                id="flooded"
                value={flooded}
                onChange={(e) => setFlooded(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="condition">Jaki stan?</label>
              <select
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="contactInfo">Twój Mail/Instagram:</label>
              <input
                type="text"
                id="contactInfo"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="E-mail lub Instagram"
              />
            </div>
            <ImageUploader images={images} setImages={setImages}/>

            <div className="form-group captcha-div">
              <ReCAPTCHA
                sitekey="6LcZGFEqAAAAACsh_LhYKQPUUEDjjtbQFAoPq2Zp" // Replace with your real site key from Google reCAPTCHA
                onChange={onCaptchaChange}
              />
            </div>

            <button className="buy-button" onClick={sendEmailNotification}>Wyślij</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default App;
