import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallApp() {
    const [isVisible, setIsVisible] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isStandalone, setIsStandalone] = useState(true);

    useEffect(() => {
        // Check if already installed
        const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        setIsStandalone(standalone);

        // Listen for beforeinstallprompt (Android)
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            if (!standalone) setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // For iOS, we can't detect if installable, so we show it if not standalone
        if (!standalone && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
            setIsVisible(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            // iOS or other
            alert('En iOS: Toca el icono de "Compartir" (cuadrado con flecha) y selecciona "Agregar a inicio".');
            return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    if (isStandalone || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                style={{
                    position: 'fixed',
                    bottom: '1rem',
                    left: '1rem',
                    right: '1rem',
                    background: '#000',
                    color: '#fff',
                    padding: '1.5rem',
                    border: '3px solid #fff',
                    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', textTransform: 'uppercase' }}>📱 Instalar aplicación</h4>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', opacity: 0.8 }}>
                            Instala la app para recibir notificaciones y acceso rápido.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', padding: 0 }}
                    >
                        ✕
                    </button>
                </div>
                <button
                    onClick={handleInstall}
                    style={{
                        background: '#fff',
                        color: '#000',
                        border: 'none',
                        padding: '1rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    AGREGAR A MI PANTALLA
                </button>
            </motion.div>
        </AnimatePresence>
    );
}
