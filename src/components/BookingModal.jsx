import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBookedSlots, createAppointment } from '../lib/appointments';

const SERVICES_BY_CATEGORY = {
    barber: [
        { id: 'corte', name: 'Corte', price: 25 },
        { id: 'corte-barba', name: 'Corte + Barba', price: 30 },
        { id: 'arreglo-barba', name: 'Arreglo de Barba', price: 15 },
        { id: 'cejas', name: 'Cejas', price: 8 },
        { id: 'limpieza', name: 'Limpieza Facial', price: 80 },
        { id: 'lineas', name: 'Líneas Básicas', price: 2 },
        { id: 'freestyle', name: 'Diseño Free Style', price: 10 },
        { id: 'pigmentacion', name: 'Pigmentación', price: 5 },
    ],
    manicure: [
        { id: 'tradicional', name: 'Tradicional', price: 18 },
        { id: 'semipermanente', name: 'Semipermanente', price: 40 },
        { id: 'rubber', name: 'Rubber', price: 55 },
        { id: 'dipping', name: 'Dipping', price: 55 },
        { id: 'recubrimiento', name: 'Recubrimiento', price: 70 },
        { id: 'acrilico-esculpido', name: 'Acrílico/Poligel Esculpido', price: 100 },
        { id: 'acrilico-sobre-tip', name: 'Acrílico/Poligel Sobre Tip', price: 95 },
        { id: 'press-on', name: 'Press On', price: 75 },
        { id: 'retoque', name: 'Retoque', price: 70 },
        { id: 'una-adicional', name: 'Uña Adicional', price: 7 },
        { id: 'retiro-sistema', name: 'Retiro Acrílico/Poligel', price: 15 },
        { id: 'retiro-semi', name: 'Retiro Semipermanente', price: 10 },
    ]
};

const TIME_SLOTS = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
    '7:00 PM', '8:00 PM', '9:00 PM'
];

// WhatsApp individual de cada barbero
const BARBER_WHATSAPP = {
    nico: '573207240085',
    mateo: '573015981843',
    adrian: '573117100880',
    valeria: '573000000000', // Reemplazar con el WhatsApp de Vero Nails
};

export default function BookingModal({ barber, onClose }) {
    const [step, setStep] = useState(1);
    const [selectedServices, setSelectedServices] = useState([]);
    
    // Lista dinámica según la categoría (por defecto barbería si no está definido)
    const currentServices = SERVICES_BY_CATEGORY[barber.category || 'barber'];
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');

    // Calcular total sumando todos los servicios seleccionados
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const serviceNames = selectedServices.map((s) => s.name).join(', ');
    const servicePrices = selectedServices.map((s) => `${s.name} ($${s.price}K)`).join(' + ');

    const toggleService = (svc) => {
        setSelectedServices((prev) =>
            prev.find((s) => s.id === svc.id)
                ? prev.filter((s) => s.id !== svc.id)
                : [...prev, svc]
        );
    };

    // Cargar horarios ocupados cuando cambia la fecha
    useEffect(() => {
        if (!date) return;
        setLoadingSlots(true);
        setTime('');
        getBookedSlots(barber.id, date).then((slots) => {
            setBookedSlots(slots);
            setLoadingSlots(false);
        });
    }, [date, barber.id]);

    const handleConfirm = async () => {
        if (!clientName.trim()) { setError('Escribe tu nombre'); return; }
        setError('');
        setSubmitting(true);

        try {
            await createAppointment({
                barberId: barber.id,
                barberName: barber.name,
                serviceName: serviceNames,
                servicePrice: `$${totalPrice}K`,
                date,
                time,
                clientName: clientName.trim(),
                clientPhone: clientPhone.trim(),
            });

            // La notificación al barbero se envía automáticamente desde Supabase
            setDone(true);
        } catch (err) {
            console.error('Detalles del error al agendar:', err);
            if (err.message && (err.message.includes('fetch') || err.message.includes('network'))) {
                setError('Error de conexión. Verifica que el servidor o la base de datos (Supabase) estén activos.');
            } else {
                setError(`Error al agendar: ${err.message || 'Intenta de nuevo.'}`);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (done) {
        return (
            <div className="modal-bg" onClick={onClose}>
                <motion.div
                    className="modal-box"
                    style={{ textAlign: 'center' }}
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¡Cita Agendada!</h2>
                    <p style={{ opacity: 0.6, fontWeight: 700, marginBottom: '2rem' }}>
                        Se le notificó a <strong>{barber.name}</strong> por WhatsApp.<br />
                        Te esperamos el <strong>{date}</strong> a las <strong>{time}</strong>.
                    </p>
                    <button className="btn" onClick={onClose}>CERRAR</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="modal-bg" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>

                <div className="modal-barber">
                    <small>Agendando con</small>
                    <h2>{barber.name}</h2>
                </div>

                {/* Barra de progreso */}
                <div className="progress-bar">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className={`progress-segment ${step >= s ? 'active' : ''}`} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* PASO 1: Servicios (multi-selección) */}
                    {step === 1 && (
                        <motion.div key="s1" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} transition={{ duration: 0.18 }}>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>① Elige tus Servicios</h3>
                            <p style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.5, marginBottom: '1.25rem', textTransform: 'uppercase' }}>
                                Puedes seleccionar varios
                            </p>
                            <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                                {currentServices.map((svc) => {
                                    const isSelected = selectedServices.find((s) => s.id === svc.id);
                                    return (
                                        <div
                                            key={svc.id}
                                            className={`price-row ${isSelected ? 'selected' : ''}`}
                                            onClick={() => toggleService(svc)}
                                        >
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span style={{
                                                    width: '22px', height: '22px', border: '3px solid currentColor',
                                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0, fontWeight: 900, fontSize: '0.8rem'
                                                }}>
                                                    {isSelected ? '✓' : ''}
                                                </span>
                                                {svc.name}
                                            </span>
                                            <span>${svc.price}K</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Total en tiempo real */}
                            {selectedServices.length > 0 && (
                                <div style={{
                                    background: '#000', color: '#fff', padding: '1rem 1.25rem',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    fontFamily: 'Inter, sans-serif', fontWeight: 900, textTransform: 'uppercase',
                                    marginTop: '1rem', fontSize: '1.1rem'
                                }}>
                                    <span>{selectedServices.length} servicio{selectedServices.length > 1 ? 's' : ''}</span>
                                    <span>Total: ${totalPrice}K</span>
                                </div>
                            )}

                            <div style={{ marginTop: '1.25rem' }}>
                                <button
                                    className="btn"
                                    disabled={selectedServices.length === 0}
                                    onClick={() => setStep(2)}
                                >
                                    Siguiente →
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* PASO 2: Fecha */}
                    {step === 2 && (
                        <motion.div key="s2" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} transition={{ duration: 0.18 }}>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>② ¿Qué día vienes?</h3>
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
                    {/* PASO 3: Hora */}
                    {step === 3 && (
                        <motion.div key="s3" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} transition={{ duration: 0.18 }}>
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>③ ¿HORA DE TU CITA? 🔥</h3>
                            {loadingSlots && <p style={{ opacity: 0.5, marginBottom: '1rem', fontWeight: 700 }}>Cargando disponibilidad...</p>}
                            <div className="time-grid">
                                {TIME_SLOTS.map((t) => {
                                    // Normalizar para comparar con la base de datos
                                    const normalize = (timeStr) => {
                                        if (!timeStr) return '';
                                        // "09:00 AM" -> "9 AM", "1:00 PM" -> "1 PM"
                                        return timeStr.replace(/^0/, '').replace(':00', '');
                                    };
                                    
                                    const isBooked = bookedSlots.some(bs => normalize(bs) === normalize(t));
                                    
                                    // Bloquear horas pasadas si es hoy
                                    const isPast = () => {
                                        const now = new Date();
                                        const todayStr = now.toISOString().split('T')[0];
                                        if (date !== todayStr) return false;

                                        const [timePart, modifier] = t.split(' ');
                                        let hours = parseInt(timePart, 10);
                                        let minutes = timePart.includes(':') ? parseInt(timePart.split(':')[1], 10) : 0;

                                        if (modifier === 'PM' && hours !== 12) hours += 12;
                                        if (modifier === 'AM' && hours === 12) hours = 0;

                                        const slotTime = new Date();
                                        slotTime.setHours(hours, minutes, 0, 0);
                                        
                                        return slotTime < new Date(now.getTime() - 15 * 60000);
                                    };

                                    const disabled = isBooked || isPast();
                                    const [hourPart, ampmPart] = t.split(' ');

                                    return (
                                        <button
                                            key={t}
                                            className={`time-btn ${time === t ? 'selected' : ''} ${disabled ? 'booked' : ''}`}
                                            disabled={disabled}
                                            onClick={() => !disabled && setTime(t)}
                                            title={isBooked ? 'Hora ocupada' : isPast() ? 'Hora pasada' : ''}
                                        >
                                            {disabled ? (
                                                <s>{hourPart} {ampmPart}</s>
                                            ) : (
                                                <>
                                                    <span>{hourPart}</span>
                                                    <span style={{ marginLeft: '2px', fontSize: '0.85em' }}>{ampmPart}</span>
                                                </>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="step-nav">
                                <button className="btn btn-outline" onClick={() => setStep(2)}>← Atrás</button>
                                <button className="btn" disabled={!time} onClick={() => setStep(4)}>Siguiente →</button>
                            </div>
                        </motion.div>
                    )}

                    {/* PASO 4: Datos + resumen */}
                    {step === 4 && (
                        <motion.div key="s4" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} transition={{ duration: 0.18 }}>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>④ Tus datos</h3>
                            <input
                                type="text"
                                placeholder="Tu nombre *"
                                className="date-input"
                                style={{ marginBottom: '1rem', fontSize: '1.1rem' }}
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                            />
                            <input
                                type="tel"
                                placeholder="Tu WhatsApp / teléfono"
                                className="date-input"
                                style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}
                                value={clientPhone}
                                onChange={(e) => setClientPhone(e.target.value)}
                            />

                            <div className="summary-box">
                                <div className="summary-row"><span>{barber.category === 'manicure' ? 'Especialista' : 'Barbero'}</span><strong>{barber.name}</strong></div>
                                <div className="summary-row">
                                    <span>Servicios</span>
                                    <strong style={{ textAlign: 'right', maxWidth: '60%' }}>{serviceNames}</strong>
                                </div>
                                <div className="summary-row"><span>Fecha</span><strong>{date}</strong></div>
                                <div className="summary-row"><span>Hora</span><strong>{time}</strong></div>
                                <div className="summary-row" style={{ fontSize: '1.3rem' }}>
                                    <span>Total</span><strong>${totalPrice}K</strong>
                                </div>
                            </div>

                            {error && <p style={{ color: 'red', fontWeight: 700, marginBottom: '1rem' }}>⚠ {error}</p>}

                            <div className="step-nav">
                                <button className="btn btn-outline" onClick={() => setStep(3)}>← Atrás</button>
                                <button className="btn" disabled={submitting || !clientName.trim()} onClick={handleConfirm}>
                                    {submitting ? 'Agendando...' : '✅ CONFIRMAR CITA'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
