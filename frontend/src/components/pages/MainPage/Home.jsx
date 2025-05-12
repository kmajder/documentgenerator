import './Home.css';
import moneyBag from "./images/moneyBag.jpeg";
import Slider from "./main-slider/main-slider.jsx"
function Home() {

    return(
        <div className="home-content">
            <Slider>
            </Slider>
            <div className="aboutProcess">
                <h1>Jak to wygląda?</h1>
                <ol>
                    <li>Wybierz model iPhone'a, który chcesz sprzedać.</li>
                    <li>Podaj szczegóły dotyczące stanu urządzenia i dane do kontaktu.</li>
                    <li>Otrzymaj wycenę na podstawie wprowadzonych danych.</li>
                    <li>Jeśli stan się zgadza, skontaktujemy się z Tobą w ciągu 24 godzin i wyślemy etykietę do wysyłki.</li>
                    <li>Wyślij nam urządzenie za pomocą darmowej przesyłki.</li>
                    <li>Po otrzymaniu i sprawdzeniu iPhone'a, wypłacamy pieniądze!</li>
                </ol>
            </div>
            <div className="askUs">
                <h1>Dlaczego warto skorzystać z naszych usług?</h1>
                <ul>
                    <li>Prosty i szybki proces sprzedaży iPhone'a – bez zbędnych formalności.</li>
                    <li>Gwarantujemy konkurencyjne ceny za każde urządzenie.</li>
                    <li>Wystarczy podać dane dotyczące modelu i stanu iPhone'a, a wycenę otrzymasz natychmiast.</li>
                    <li>Po potwierdzeniu stanu urządzenia natychmiast wypłacamy pieniądze!</li>
                    <li>Profesjonalna obsługa i pełna transparentność całego procesu.</li>
                    <li>Dbamy o środowisko – Twoje urządzenie trafi do ponownego użytku lub recyklingu.</li>
                </ul>
            </div>
        </div>
        
    );
}

export default Home