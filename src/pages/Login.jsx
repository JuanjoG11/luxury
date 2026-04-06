import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BARBERS = [
    { id: 'nico', name: 'Nico' },
    { id: 'mateo', name: 'Mateo' },
    { id: 'adrian', name: 'Adrián' },
    { id: 'valeria', name: 'Vero Nails' },
];

// PINES de acceso simples (cambiables después o vía base de datos)
const PINS = {
    nico: '1111',
    mateo: '2222',
    adrian: '3333',
    valeria: '4444', // Puedes cambiar el PIN si lo deseas
};

export default function Login() {
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (PINS[selectedBarber] === pin) {
            // Guardar el login en localstorage temporalmente
            localStorage.setItem('brotherhood_barber', selectedBarber);
            navigate('/dashboard');
        } else {
            setError('PIN Incorrecto');
            setPin('');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>

            <Link to="/" style={{ color: '#fff', textDecoration: 'none', position: 'absolute', top: '2rem', left: '2rem', fontFamily: 'Inter, sans-serif', fontWeight: 900 }}>
                ← Volver
            </Link>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ width: '100%', maxWidth: '400px' }}>
                <h1 className="gothic" style={{ fontSize: '5rem', textAlign: 'center', marginBottom: '2rem', lineHeight: 0.9 }}>
                    Acceso<br />Equipo
                </h1>

                <div style={{ background: '#111', padding: '2rem', border: '4px solid #fff', boxShadow: '8px 8px 0 #fff' }}>
                    {!selectedBarber ? (
                        <div>
                            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, marginBottom: '1.5rem', textAlign: 'center' }}>¿Quién eres?</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {BARBERS.map(b => (
                                    <button
                                        key={b.id}
                                        className="btn btn-outline"
                                        onClick={() => setSelectedBarber(b.id)}
                                    >
                                        {b.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin}>
                            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, marginBottom: '1.5rem', textAlign: 'center' }}>
                                Hola {BARBERS.find(b => b.id === selectedBarber).name}.
                                <br /><span style={{ opacity: 0.5, fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => setSelectedBarber(null)}>Cambiar usuario</span>
                            </p>

                            <input
                                type="password"
                                placeholder="Ingresa tu PIN"
                                className="date-input"
                                style={{ background: '#000', color: '#fff', borderColor: '#fff' }}
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                maxLength={4}
                                autoFocus
                            />

                            {error && <p style={{ color: '#ff4444', fontWeight: 900, marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

                            <button className="btn btn-outline" type="submit" style={{ width: '100%' }}>
                                ENTRAR AL DASHBOARD
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
