import './Home.css';
import moneyBag from "./images/moneyBag.jpeg";
import Slider from "./main-slider/main-slider.jsx"

function Home() {

    return(
        <div className="home-content">
            <Slider />
            <div className="aboutProcess">
                <h1>Jak to działa?</h1>
                <ol>
                    <li>Przygotuj plik Excela z danymi, które chcesz umieścić w dokumencie.</li>
                    <li>Dodaj szablon dokumentu Word (.docx) z odpowiednimi znacznikami.</li>
                    <li>Prześlij oba pliki za pomocą naszego formularza.</li>
                    <li>W ciągu kilku sekund otrzymasz gotowy, spersonalizowany dokument.</li>
                    <li>Możesz go od razu pobrać i wykorzystać dalej – bez ręcznego przepisywania.</li>
                </ol>
            </div>
            <div className="askUs">
                <h1>Dlaczego warto skorzystać z DocumentGenerator.pl?</h1>
                <ul>
                    <li>Automatyzujesz tworzenie dokumentów – szybciej i bez błędów.</li>
                    <li>Wystarczy jeden szablon Word i jeden Excel, aby wygenerować dziesiątki gotowych dokumentów.</li>
                    <li>Oszczędzasz czas pracowników i eliminujesz powtarzalne zadania.</li>
                    <li>Rozwiązanie idealne dla firm, kancelarii, instytucji i freelancerów.</li>
                    <li>Bezpieczne przesyłanie plików – dane nie są nigdzie przechowywane na stałe.</li>
                    <li>Nie musisz instalować żadnego oprogramowania – wszystko działa w przeglądarce.</li>
                </ul>
            </div>
        </div>
    );
}

export default Home
