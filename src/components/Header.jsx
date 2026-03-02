import { motion } from 'framer-motion';

export default function Header() {
    return (
        <header className="header">
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <img src="/logo2.jpg" alt="BrotherHood Logo" style={{ maxWidth: '100%', height: 'auto', maxHeight: '180px', marginBottom: '1rem', mixBlendMode: 'multiply' }} />
                <div className="header-badge" style={{ marginTop: '0' }}>🔥 Alta Calidad &amp; Estilo de Barrio — Pereira</div>
            </motion.div>
        </header>
    );
}
