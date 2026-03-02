import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SERVICES = [
    { id: 'corte', name: 'Corte', price: '$25K' },
    { id: 'corte-barba', name: 'Corte + Barba', price: '$30K' },
    { id: 'arreglo-barba', name: 'Arreglo de Barba', price: '$15K' },
    { id: 'cejas', name: 'Cejas', price: '$8K' },
    { id: 'limpieza', name: 'Limpieza Facial', price: '$80K' },
    { id: 'lineas', name: 'Líneas Básicas', price: '$2K' },
    { id: 'freestyle', name: 'Diseño Free Style', price: '$10K' },
    { id: 'pigmentacion', name: 'Pigmentación', price: '$5K' },
];

const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM',
];

export default function BookingModal({ barber, onClose }) {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const WHATSAPP = '573015981843';

    const handleConfirm = () => {
        const msg = encodeURIComponent(
            `¡Hola BrotherHood! Deseo agendar una cita:\n\n✂️ Servicio: ${selectedService.name}\n🧔 Barbero: ${barber.name}\n📅 Fecha: ${date}\n⏰ Hora: ${time}\n\n¡Nos vemos allá! 🔥`
        );
        window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank');
        onClose();
    };

    return (
        <div className="modal-bg" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>

                <div className="modal-barber">
                    <small>Agendando con</small>
                    <h2>{barber.name}</h2>
                </div>

                {/* Progress */}
                <div className="progress-bar">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`progress-segment ${step >= s ? 'active' : ''}`} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="s1"
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -30, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                        >
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>① Elige el Servicio</h3>
                            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                                {SERVICES.map((svc) => (
                                    <div
                                        key={svc.id}
                                        className={`price-row ${selectedService?.id === svc.id ? 'selected' : ''}`}
                                        onClick={() => { setSelectedService(svc); setStep(2); }}
                                    >
                                        <span>{svc.name}</span>
                                        <span>{svc.price}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="s2"
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -30, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                        >
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>② ¿Qué día vienes?</h3>
                            <input
                                type="date"
                                className="date-input"
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setDate(e.target.value)}
                                value={date}
                            />
                            <div className="step-nav">
                                <button className="btn btn-outline" onClick={() => setStep(1)}>← Atrás</button>
                                <button className="btn" disabled={!date} onClick={() => setStep(3)}>Siguiente →</button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="s3"
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -30, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                        >
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>③ ¿A qué hora?</h3>
                            <div className="time-grid">
                                {TIME_SLOTS.map((t) => (
                                    <button
                                        key={t}
                                        className={`time-btn ${time === t ? 'selected' : ''}`}
                                        onClick={() => setTime(t)}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            {time && (
                                <div className="summary-box">
                                    <div className="summary-row"><span>Barbero</span><span>{barber.name}</span></div>
                                    <div className="summary-row"><span>Servicio</span><span>{selectedService.name}</span></div>
                                    <div className="summary-row"><span>Fecha</span><span>{date}</span></div>
                                    <div className="summary-row"><span>Hora</span><span>{time}</span></div>
                                    <div className="summary-row"><span>Total</span><span>{selectedService.price}</span></div>
                                </div>
                            )}

                            <div className="step-nav">
                                <button className="btn btn-outline" onClick={() => setStep(2)}>← Atrás</button>
                                <button className="btn" disabled={!time} onClick={handleConfirm}>
                                    💬 AGENDAR POR WHATSAPP
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
