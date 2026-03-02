import { motion } from 'framer-motion';

export default function Header() {
    return (
        <header className="header">
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center' }}
            >
                <h1 className="gothic header-title">Brother<br />Hood</h1>
                <div className="header-badge">🔥 Alta Calidad &amp; Estilo de Barrio — Pereira</div>
            </motion.div>
        </header>
    );
}
