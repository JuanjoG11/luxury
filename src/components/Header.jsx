import { motion } from 'framer-motion';
import logoImg from '../assets/logo.png';

export default function Header() {
    return (
        <header className="header">
            <div className="container" style={{ padding: 0 }}>
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.5rem' }}
                >
                    <img src={logoImg} alt="BrotherHood Logo" style={{ height: '90px' }} />
                    <h1 className="gothic header-title">Brother<br />Hood</h1>
                </motion.div>

                <div className="header-badge">🔥 Alta Calidad &amp; Estilo de Barrio — Pereira, Colombia</div>

                <div className="header-info">
                    <motion.div
                        className="info-card"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="info-card-icon">📍</span>
                        <div className="info-card-text">
                            <h3>Ubicación</h3>
                            <p>Calle 33 #29A-22 Local 2</p>
                            <small>Barrio Villa del Prado, Pereira</small>
                        </div>
                    </motion.div>

                    <motion.div
                        className="info-card"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="info-card-icon">📞</span>
                        <div className="info-card-text">
                            <h3>Contacto WhatsApp</h3>
                            <p>+57 301 598 1843</p>
                            <small>Atención inmediata</small>
                        </div>
                    </motion.div>
                </div>
            </div>
        </header>
    );
}
