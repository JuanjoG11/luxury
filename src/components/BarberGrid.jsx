import { motion } from 'framer-motion';
import nicoImg from '../assets/nico.png';
import mateoImg from '../assets/mateo.png';
import adrianImg from '../assets/adrian.png';

const BARBERS = [
    {
        id: 'nico',
        name: 'Nico',
        description: 'Especialista en degradados y estilo clásico.',
        image: nicoImg,
    },
    {
        id: 'mateo',
        name: 'Mateo',
        description: 'Experto en barbas y navaja tradicional.',
        image: mateoImg,
    },
    {
        id: 'adrian',
        name: 'Adrián',
        description: 'Creativo en diseños free style y color.',
        image: adrianImg,
    },
];

export default function BarberGrid({ onSelectBarber }) {
    return (
        <section className="barbers-section">
            <div className="container">
                <h2 className="section-title">Elige tu Artista</h2>
                <div className="grid-3">
                    {BARBERS.map((barber, index) => (
                        <motion.div
                            key={barber.id}
                            className="card-dark"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onSelectBarber(barber)}
                        >
                            <img src={barber.image} alt={barber.name} className="barber-img" />
                            <div className="barber-info">
                                <div className="barber-name">{barber.name}</div>
                                <div className="barber-desc">{barber.description}</div>
                                <button className="btn">✂ AGENDAR CITA</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
