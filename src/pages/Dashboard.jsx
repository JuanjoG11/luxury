import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import InstallApp from '../components/InstallApp';

export default function Dashboard() {
    const [barberId, setBarberId] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertInfo, setAlertInfo] = useState(null);
    const [filter, setFilter] = useState('pending'); // 'pending' or 'completed'
    const [showManual, setShowManual] = useState(false);
    
    // Formulario manual
    const [mDate, setMDate] = useState(new Date().toISOString().split('T')[0]);
    const [mTime, setMTime] = useState('9:00 AM');
    const [mClient, setMClient] = useState('');

    const navigate = useNavigate();

    const TIME_SLOTS = [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
        '7:00 PM', '8:00 PM', '9:00 PM'
    ];

    useEffect(() => {
        const bi = localStorage.getItem('brotherhood_barber');
        if (!bi) {
            navigate('/login');
        } else {
            setBarberId(bi);
        }
    }, [navigate]);

    const handleManualBooking = async (e) => {
        e.preventDefault();
        setLoading(true);

        const appointmentData = {
            barber_id: barberId,
            barber_name: barberId.charAt(0).toUpperCase() + barberId.slice(1), // Nombre básico basado en ID
            client_name: mClient.trim() || 'Bloqueo Manual',
            client_phone: 'N/A',
            date: mDate,
            time: mTime,
            status: 'confirmed',
            service_name: 'Bloqueo/Presencial',
            service_price: '$0K'
        };

        const { error } = await supabase.from('appointments').insert([appointmentData]);

        if (!error) {
            setShowManual(false);
            setMClient('');
            fetchAppointments();
        } else {
            console.error('Error detail:', error);
            alert(`Error de Supabase: ${error.message}\nDetalle: ${error.details}\nHint: ${error.hint}`);
        }
        setLoading(false);
    };

    const fetchAppointments = async () => {
        if (!barberId) return;
        setLoading(true);

        let query = supabase
            .from('appointments')
            .select('*')
            .eq('barber_id', barberId)
            .order('date', { ascending: filter === 'pending' })
            .order('time', { ascending: filter === 'pending' });

        if (filter === 'pending') {
            query = query.neq('status', 'cancelled').neq('status', 'completed');
        } else {
            query = query.eq('status', 'completed');
        }

        const { data, error } = await query;

        if (!error) {
            setAppointments(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAppointments();

        const channel = supabase
            .channel('public:appointments')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'appointments',
                filter: `barber_id=eq.${barberId}`
            }, () => {
                fetchAppointments();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [barberId, filter]);

    const handleStatusUpdate = async (id, newStatus) => {
        const { error } = await supabase
            .from('appointments')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            // Animación local o re-fetch
            fetchAppointments();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('brotherhood_barber');
        navigate('/login');
    };

    const calculateTotal = () => {
        // Solo sumamos las completadas para el ingreso real
        const completedOnly = appointments.filter(a => a.status === 'completed');
        return completedOnly.reduce((sum, appt) => {
            const p = parseInt(appt.service_price.replace(/[^0-9]/g, ''), 10) || 0;
            return sum + p;
        }, 0);
    };

    if (!barberId) return null;

    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5', color: '#000', padding: '1rem', fontFamily: 'Inter, sans-serif' }}>
            <InstallApp />

            <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <h1 className="gothic" style={{ fontSize: '3rem', margin: 0 }}>Panel</h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setShowManual(true)} className="btn" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.8rem', background: '#000', color: '#fff' }}>
                        + NUEVA CITA/BLOQUEO
                    </button>
                    <button onClick={handleLogout} className="btn" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.8rem', background: '#fff', color: '#000' }}>
                        SALIR
                    </button>
                </div>
            </div>

            {/* MODAL MANUAL SIMPLE */}
            <AnimatePresence>
                {showManual && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
                    >
                        <motion.div 
                            initial={{ y: 20 }} animate={{ y: 0 }}
                            style={{ background: '#fff', padding: '2rem', border: '4px solid #000', width: '100%', maxWidth: '400px', boxShadow: '10px 10px 0 #000' }}
                        >
                            <h2 style={{ marginBottom: '1.5rem' }}>Agendar Manual</h2>
                            <form onSubmit={handleManualBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input type="date" value={mDate} onChange={e => setMDate(e.target.value)} required style={{ padding: '0.8rem', border: '2px solid #000', fontWeight: 900 }} />
                                <select value={mTime} onChange={e => setMTime(e.target.value)} required style={{ padding: '0.8rem', border: '2px solid #000', fontWeight: 900 }}>
                                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <input type="text" placeholder="Nombre (Opcional)" value={mClient} onChange={e => setMClient(e.target.value)} style={{ padding: '0.8rem', border: '2px solid #000', fontWeight: 900 }} />
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setShowManual(false)} className="btn btn-outline" style={{ border: '2px solid #000' }}>CANCELAR</button>
                                    <button type="submit" className="btn">GUARDAR</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TAB SELECTOR */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setFilter('pending')}
                    style={{
                        flex: 1, padding: '1rem', fontWeight: 900, border: '3px solid #000',
                        background: filter === 'pending' ? '#000' : '#fff',
                        color: filter === 'pending' ? '#fff' : '#000',
                        textTransform: 'uppercase'
                    }}
                >
                    Próximas
                </button>
                <button
                    onClick={() => setFilter('completed')}
                    style={{
                        flex: 1, padding: '1rem', fontWeight: 900, border: '3px solid #000',
                        background: filter === 'completed' ? '#000' : '#fff',
                        color: filter === 'completed' ? '#fff' : '#000',
                        textTransform: 'uppercase'
                    }}
                >
                    Historial
                </button>
            </div>

            <div className="dashboard-grid">
                {/* RESUMEN RÁPIDO */}
                <div style={{ background: '#fff', border: '4px solid #000', padding: '1.5rem', boxShadow: '6px 6px 0 #000', marginBottom: '2rem' }}>
                    <p style={{ fontWeight: 900, opacity: 0.5, fontSize: '0.7rem', textTransform: 'uppercase' }}>Ingresos (Completados)</p>
                    <p style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>${calculateTotal()}K</p>
                </div>

                {/* LISTA CITAS */}
                <div>
                    {loading ? (
                        <p style={{ fontWeight: 900, opacity: 0.5 }}>Actualizando...</p>
                    ) : appointments.length === 0 ? (
                        <p style={{ fontWeight: 900, opacity: 0.5 }}>No hay citas en esta sección.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {appointments.map(appt => (
                                <div key={appt.id} style={{
                                    background: '#fff', border: '3px solid #000', padding: '1rem',
                                    display: 'flex', flexDirection: 'column', gap: '1rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div>
                                            <strong style={{ display: 'block', fontSize: '1.1rem', textTransform: 'uppercase' }}>
                                                {appt.client_name}
                                            </strong>
                                            <span style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: 700 }}>
                                                {appt.time} - {appt.date}
                                            </span>
                                        </div>
                                        <div style={{ background: '#000', color: '#fff', padding: '0.3rem 0.6rem', fontWeight: 900, fontSize: '0.9rem' }}>
                                            {appt.service_price}
                                        </div>
                                    </div>

                                    {filter === 'pending' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <button
                                                onClick={() => handleStatusUpdate(appt.id, 'completed')}
                                                style={{
                                                    background: '#22C55E', color: '#fff', border: '2px solid #000',
                                                    padding: '0.75rem', fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer',
                                                    boxShadow: '4px 4px 0 #000'
                                                }}
                                            >
                                                ✓ FINALIZAR CITA
                                            </button>
                                            
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <button
                                                    onClick={() => {
                                                        const message = `Hola ${appt.client_name}, te recordamos tu cita en Luxury 💈 para hoy ${appt.date} a las ${appt.time}. ¡Te esperamos!`;
                                                        const phone = appt.client_phone?.replace(/[^0-9]/g, '');
                                                        if (phone) {
                                                            const cleanPhone = phone.startsWith('57') ? phone : `57${phone}`;
                                                            window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
                                                        } else {
                                                            alert('No hay número de teléfono registrado');
                                                        }
                                                    }}
                                                    style={{
                                                        flex: 1, background: '#25D366', color: '#fff', border: '2px solid #000',
                                                        padding: '0.6rem', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', cursor: 'pointer',
                                                        boxShadow: '3px 3px 0 #000'
                                                    }}
                                                >
                                                    📱 RECORDATORIO
                                                </button>
                                                
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm(`¿Cancelar cita de ${appt.client_name}?`)) {
                                                            const { error } = await supabase
                                                                .from('appointments')
                                                                .update({ status: 'cancelled' })
                                                                .eq('id', appt.id);
                                                            if (!error) fetchAppointments();
                                                        }
                                                    }}
                                                    style={{
                                                        flex: 1, background: '#EF4444', color: '#fff', border: '2px solid #000',
                                                        padding: '0.6rem', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', cursor: 'pointer',
                                                        boxShadow: '3px 3px 0 #000'
                                                    }}
                                                >
                                                    ✕ CANCELAR
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.6 }}>
                                        ✂️ {appt.service_name} <br />
                                        📱 {appt.client_phone || 'N/A'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ALERTA NOTIFICACIÓN */}
            <AnimatePresence>
                {alertInfo && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        style={{
                            position: 'fixed', bottom: '1rem', left: '1rem', right: '1rem',
                            background: '#000', color: '#fff', border: '3px solid #fff',
                            padding: '1.5rem', zIndex: 9999, boxShadow: '0 0 20px rgba(0,0,0,0.8)'
                        }}
                    >
                        <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>🔔 NUEVA CITA</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>
                            {alertInfo.client_name} acaba de agendar para las {alertInfo.time}.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
