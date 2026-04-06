import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import BarberGrid from '../components/BarberGrid';
import BookingModal from '../components/BookingModal';
import { Link, useNavigate } from 'react-router-dom';

const FLYER_IMG = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800';

const BARBER_PRICES = [
    ['✂ Corte', '$25K'],
    ['✂ Corte + Barba', '$30K'],
    ['✂ Arreglo de Barba', '$15K'],
    ['✂ Cejas', '$8K'],
    ['✂ Limpieza Facial', '$80K'],
    ['✂ Líneas Básicas', '$2K'],
    ['✂ Free Style', '$10K'],
    ['✂ Pigmentación', '$5K'],
];

const MANICURE_PRICES = [
    ['💅 Tradicional', '$18K'],
    ['💅 Semipermanente', '$40K'],
    ['💅 Rubber', '$55K'],
    ['💅 Dipping', '$55K'],
    ['💅 Recubrimiento', '$70K'],
    ['💅 Acr/Poligel Esculpido', '$100K'],
    ['💅 Acr/Poligel Sobre Tip', '$95K'],
    ['💅 Press On', '$75K'],
];

export default function ClientHome() {
    const [selectedCategory, setSelectedCategory] = useState('barber');
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [isBarberLoggedIn, setIsBarberLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const bi = localStorage.getItem('brotherhood_barber');
        if (bi) setIsBarberLoggedIn(true);
    }, []);

    const currentPrices = selectedCategory === 'barber' ? BARBER_PRICES : MANICURE_PRICES;

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
            {isBarberLoggedIn && (
                <motion.button
                    initial={{ x: 100 }}
                    animate={{ x: 0 }}
                    onClick={() => navigate('/dashboard')}
                    style={{
                        position: 'fixed',
                        top: '1.5rem',
                        right: '1.5rem',
                        zIndex: 1000,
                        background: '#000',
                        color: '#fff',
                        border: '2px solid #fff',
                        padding: '0.8rem 1.2rem',
                        fontWeight: 900,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.8rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                        textTransform: 'uppercase'
                    }}
                >
                    ⚡ MI PANEL
                </motion.button>
            )}
            <Header />

            <BarberGrid 
                onSelectBarber={setSelectedBarber} 
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            {/* Services / Flyer Section */}
            <section className="flyer-section" id="services">
                <div className="flyer-grid">
                    <motion.div
                        className="flyer-text"
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="bold">
                            Precios &amp;<br />
                            <span className="stroke-text">Servicios</span>
                        </h2>
                        <p style={{ marginBottom: '2rem' }}>
                            {selectedCategory === 'barber' 
                                ? 'Expertos en degradados, barbas y estilo tradicional con la mejor calidad del mercado.'
                                : 'Especialistas en cuidado de uñas, acrílicas, semipermanentes y spa.'}
                        </p>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {currentPrices.map(([name, price]) => (
                                <div key={name} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 0',
                                    borderBottom: '3px solid #000',
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    fontSize: '1rem'
                                }}>
                                    <span>{name}</span>
                                    <span>{price}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <img
                            src={selectedCategory === 'barber' ? FLYER_IMG : 'https://images.unsplash.com/photo-1604654894611-6973b376cbde?auto=format&fit=crop&q=80&w=800'}
                            alt="Luxury Services"
                            className="flyer-img"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" style={{ position: 'relative' }}>
                <h2 className="gothic footer-title">BrotherHood</h2>
                <p className="footer-sub">Pereira • Colombia</p>

                {/* Info cards al final */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '1.5rem',
                    maxWidth: '700px',
                    margin: '0 auto 3rem',
                }}>
                    <div style={{
                        border: '3px solid #fff',
                        padding: '1.5rem',
                        textAlign: 'left',
                    }}>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.15em', opacity: 0.5, marginBottom: '0.5rem' }}>Ubicación</p>
                        <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Calle 33 #29A-22 Local 2</p>
                        <p style={{ opacity: 0.5, fontWeight: 700, fontSize: '0.9rem' }}>Barrio Villa del Prado, Pereira</p>
                    </div>
                    <div style={{
                        border: '3px solid #fff',
                        padding: '1.5rem',
                        textAlign: 'left',
                    }}>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.15em', opacity: 0.5, marginBottom: '0.5rem' }}>Contacto WhatsApp</p>
                        <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>+57 301 598 1843</p>
                        <p style={{ opacity: 0.5, fontWeight: 700, fontSize: '0.9rem' }}>Atención inmediata</p>
                    </div>
                </div>

                <div className="footer-links">
                    <a href="https://www.instagram.com/brother_hood8_" target="_blank" rel="noreferrer">Instagram</a>
                    <a href="https://wa.me/573015981843" target="_blank" rel="noreferrer">WhatsApp</a>
                </div>

                <Link to="/login" style={{
                    position: 'absolute', bottom: '2rem', right: '2rem',
                    opacity: 0.2, fontWeight: 900, textTransform: 'uppercase',
                    textDecoration: 'none', color: '#fff', fontSize: '0.8rem',
                    fontFamily: 'Inter, sans-serif'
                }}>
                    Acceso Barberos →
                </Link>
            </footer>

            {/* Booking Modal */}
            <AnimatePresence>
                {selectedBarber && (
                    <BookingModal
                        barber={selectedBarber}
                        onClose={() => setSelectedBarber(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
