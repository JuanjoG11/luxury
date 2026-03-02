import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import BarberGrid from './components/BarberGrid';
import BookingModal from './components/BookingModal';

const FLYER_IMG = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800';

function App() {
  const [selectedBarber, setSelectedBarber] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Header />

      <BarberGrid onSelectBarber={setSelectedBarber} />

      {/* Services / Flyer Section */}
      <section className="flyer-section">
        <div className="flyer-grid">
          <motion.div
            className="flyer-text"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="bold">
              Precios &amp;<br />
              <span className="stroke-text">Servicios</span>
            </h2>
            <p>
              Echa un vistazo a nuestros servicios y precios. Calidad garantizada en cada corte.
            </p>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {[
                ['✂ Corte', '$25K'],
                ['✂ Corte + Barba', '$30K'],
                ['✂ Arreglo de Barba', '$15K'],
                ['✂ Cejas', '$8K'],
                ['✂ Limpieza Facial', '$80K'],
                ['✂ Líneas Básicas', '$2K'],
                ['✂ Free Style', '$10K'],
                ['✂ Pigmentación', '$5K'],
              ].map(([name, price]) => (
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
            initial={{ scale: 0.92, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <img
              src={FLYER_IMG}
              alt="BrotherHood Barbershop"
              className="flyer-img"
            />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
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

export default App;
