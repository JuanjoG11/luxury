import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const [barberId, setBarberId] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertInfo, setAlertInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check login
        const bi = localStorage.getItem('brotherhood_barber');
        if (!bi) {
            navigate('/login');
        } else {
            setBarberId(bi);
        }
    }, [navigate]);

    useEffect(() => {
        if (!barberId) return;

        // Obtener citas de hoy / futuras (simplificado: trae todas confirmadas)
        const fetchAppointments = async () => {
            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .eq('barber_id', barberId)
                .eq('status', 'confirmed')
                .order('date', { ascending: true })
                .order('time', { ascending: true });

            if (!error) {
                setAppointments(data);
            }
            setLoading(false);
        };

        fetchAppointments();

        // Suscripción en tiempo real a nuevas citas
        const channel = supabase
            .channel('public:appointments')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'appointments',
                filter: `barber_id=eq.${barberId}`
            }, (payload) => {
                const newAppt = payload.new;
                setAppointments((prev) => [...prev, newAppt].sort((a, b) => new Date(a.date) - new Date(b.date)));

                // Sonido y alerta
                new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => { });
                setAlertInfo(newAppt);

                setTimeout(() => setAlertInfo(null), 10000); // desaparecer después de 10s
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [barberId]);

    const handleLogout = () => {
        localStorage.removeItem('brotherhood_barber');
        navigate('/login');
    };

    const calculateTotal = () => {
        return appointments.reduce((sum, appt) => {
            const p = parseInt(appt.service_price.replace(/[^0-9]/g, ''), 10) || 0;
            return sum + p;
        }, 0);
    };

    if (!barberId) return null;

    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5', color: '#000', padding: '2rem 1.25rem', fontFamily: 'Inter, sans-serif' }}>

            {/* HEADER DASHBOARD */}
            <div className="dashboard-header">
                <h1 className="gothic" style={{ fontSize: '4.5rem', margin: 0, lineHeight: 0.9 }}>Mi Turno</h1>
                <button onClick={handleLogout} className="btn" style={{ width: 'auto', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}>
                    SALIR →
                </button>
            </div>

            <div className="dashboard-grid">

                {/* RESUMEN */}
                <div>
                    <div style={{ background: '#fff', border: '4px solid #000', padding: '2rem', boxShadow: '8px 8px 0 #000', marginBottom: '2rem' }}>
                        <p style={{ fontWeight: 900, opacity: 0.5, textTransform: 'uppercase' }}>Hola,</p>
                        <h2 style={{ fontSize: '3rem', margin: '0 0 2rem 0', textTransform: 'uppercase', letterSpacing: '-0.05em' }}>
                            {barberId}
                        </h2>

                        <p style={{ fontWeight: 900, opacity: 0.5, textTransform: 'uppercase' }}>Ganancias Generadas</p>
                        <p style={{ fontSize: '4rem', fontWeight: 900, margin: 0 }}>${calculateTotal()}K</p>

                        <p style={{ fontWeight: 900, opacity: 0.5, textTransform: 'uppercase', marginTop: '2rem' }}>Total Citas</p>
                        <p style={{ fontSize: '3rem', fontWeight: 900, margin: 0 }}>{appointments.length}</p>
                    </div>
                </div>

                {/* LISTA DE CITAS */}
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 900 }}>Próximas Citas</h2>
                    {loading ? (
                        <p style={{ fontWeight: 900, opacity: 0.5 }}>Cargando agenda...</p>
                    ) : appointments.length === 0 ? (
                        <p style={{ fontWeight: 900, opacity: 0.5 }}>No tienes citas agendadas aún.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {appointments.map(appt => (
                                <div key={appt.id} className="dashboard-list-item">
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '1.25rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{appt.client_name} - {appt.time}</strong>
                                        <span style={{ fontSize: '0.9rem', opacity: 0.7, fontWeight: 700, display: 'block', lineHeight: 1.5 }}>
                                            📅 {appt.date}<br />📱 {appt.client_phone || 'Sin número'}<br />✂️ {appt.service_name}
                                        </span>
                                    </div>
                                    <div style={{ background: '#000', color: '#fff', padding: '0.5rem 1rem', fontWeight: 900, fontSize: '1.2rem', border: '3px solid #000' }}>
                                        {appt.service_price}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ALERTA EN TIEMPO REAL */}
            <AnimatePresence>
                {alertInfo && (
                    <motion.div
                        initial={{ y: 50, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 50, opacity: 0, scale: 0.9 }}
                        style={{
                            position: 'fixed', bottom: '2rem', right: '2rem', background: '#000', color: '#fff',
                            border: '4px solid #fff', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 9999,
                            maxWidth: '400px'
                        }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
                        <h3 style={{ fontSize: '1.5rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>¡NUEVA CITA AGENDADA!</h3>
                        <p style={{ fontWeight: 700, margin: 0, fontSize: '1.1rem' }}>
                            <strong>{alertInfo.client_name}</strong> te agendó para las <strong>{alertInfo.time}</strong> el <strong>{alertInfo.date}</strong>.
                        </p>
                        <p style={{ opacity: 0.6, marginTop: '1rem', fontWeight: 700, fontSize: '0.85rem' }}>Servicios: {alertInfo.service_name}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
