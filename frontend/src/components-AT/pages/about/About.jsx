import './About.css';
import Navbar from "../../main-page/Navbar.jsx"

function AboutPage() {
    return (
        <>
        <Navbar />
        <div className="about-us">
            <header>
                <h1 className='abouth1'>O nas</h1>
            </header>
            <main>
                <section className="about-section">
                    <h2>Kim jesteśmy?</h2>
                    <p>
                        DocumentGenerator.pl to narzędzie stworzone z myślą o profesjonalistach, którzy chcą szybko i wygodnie przekształcać pliki w gotowe dokumenty Word lub PDF. Ułatwiamy codzienną pracę kancelarii prawnych, firm szkoleniowych, HR oraz każdemu, kto potrzebuje automatyzacji w tworzeniu dokumentów.
                    </p>
                </section>

                <section className="our-values">
                    <h2>Nasza misja</h2>
                    <p>
                        Naszym celem jest maksymalne uproszczenie procesu konwersji i generowania dokumentów. Dbamy o bezpieczeństwo danych, wygodę użytkownika i intuicyjny interfejs. Wszystko po to, byś mógł skupić się na swojej pracy, a nie na formatowaniu plików.
                    </p>
                </section>

                <section className="contact">
                    <h2>Kontakt</h2>
                    <p>
                        Masz pytania, sugestie lub chcesz zintegrować nasze rozwiązanie z Twoją firmą? Napisz do nas: <a href="mailto:kontakt@documentgenerator.pl" className='contactMail'>kontakt@documentgenerator.pl</a>.
                    </p>
                </section>
            </main>

            <footer>
                <p className='copyright'>&copy; 2025 DocumentGenerator.pl</p>
            </footer>
        </div>
        </>
    );
};

export default AboutPage;
