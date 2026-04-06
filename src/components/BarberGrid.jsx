import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import nicoImg from '../assets/nico.png';
import mateoImg from '../assets/mateo.png';
import adrianImg from '../assets/adrian.png';
import veroLogo from '../assets/vero_logo.png';

const TEAM = [
    {
        id: 'nico',
        name: 'Nico',
        category: 'barber',
        description: 'Especialista en degradados y estilo clásico.',
        image: nicoImg,
        instagram: 'https://www.instagram.com/' // Reemplazar con el real
    },
    {
        id: 'mateo',
        name: 'Mateo',
        category: 'barber',
        description: 'Experto en barbas y navaja tradicional.',
        image: mateoImg,
        instagram: 'https://www.instagram.com/' // Reemplazar con el real
    },
    {
        id: 'adrian',
        name: 'Adrián',
        category: 'barber',
        description: 'Creativo en diseños free style y color.',
        image: adrianImg,
        instagram: 'https://www.instagram.com/' // Reemplazar con el real
    },
    {
        id: 'valeria',
        name: 'Vero Nails',
        category: 'manicure',
        description: 'Especialista en cuidado de uñas, acrílicas y semipermanente.',
        image: veroLogo,
        instagram: 'https://www.instagram.com/veronica_gonzaleznails?igsh=MjJ2bGwzeXVpMXV0'
    }
];

export default function BarberGrid({ onSelectBarber, selectedCategory, setSelectedCategory }) {
    const filteredTeam = TEAM.filter(member => member.category === selectedCategory);

    return (
        <section className="barbers-section" id="booking">
            <div className="container">
                <h2 className="section-title">¿Qué servicio buscas?</h2>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
                    <button 
                        className={`btn ${selectedCategory === 'barber' ? '' : 'btn-outline'}`}
                        onClick={() => setSelectedCategory('barber')}
                        style={{ 
                            padding: '0.8rem 1.5rem', 
                            borderRadius: '50px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            fontSize: '1rem',
                            background: selectedCategory === 'barber' ? '#fff' : 'transparent',
                            color: selectedCategory === 'barber' ? '#000' : '#fff',
                            borderColor: '#fff',
                            boxShadow: selectedCategory === 'barber' ? '0 0 15px rgba(255,255,255,0.3)' : 'none'
                        }}
                    >
                        <span>💈</span> Barbería
                    </button>
                    <button 
                        className={`btn ${selectedCategory === 'manicure' ? '' : 'btn-outline'}`}
                        onClick={() => setSelectedCategory('manicure')}
                        style={{ 
                            padding: '0.8rem 1.5rem', 
                            borderRadius: '50px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            fontSize: '1rem',
                            background: selectedCategory === 'manicure' ? '#fff' : 'transparent',
                            color: selectedCategory === 'manicure' ? '#000' : '#fff',
                            borderColor: '#fff',
                            boxShadow: selectedCategory === 'manicure' ? '0 0 15px rgba(255,255,255,0.3)' : 'none'
                        }}
                    >
                        <span>💅</span> Manicure / Pedicure
                    </button>
                </div>

                <div className="grid-3" style={selectedCategory === 'manicure' ? { display: 'flex', justifyContent: 'center' } : {}}>
                    <AnimatePresence mode="popLayout">
                        {filteredTeam.map((member, index) => (
                            <motion.div
                                key={member.id}
                                className="card-dark"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                onClick={() => onSelectBarber(member)}
                                style={selectedCategory === 'manicure' ? { maxWidth: '350px', width: '100%', cursor: 'pointer' } : { cursor: 'pointer' }}
                            >
                                <img src={member.image} alt={member.name} className="barber-img" />
                                <div className="barber-info">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <div className="barber-name">{member.name}</div>
                                        {member.instagram && (
                                            <a 
                                                href={member.instagram} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                style={{ color: '#000', fontSize: '1.5rem', textDecoration: 'none' }}
                                                title="Ver Instagram"
                                            >
                                                📸
                                            </a>
                                        )}
                                    </div>
                                    <div className="barber-desc">{member.description}</div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <button className="btn">
                                            {member.category === 'manicure' ? '💅' : '✂'} AGENDAR CITA
                                        </button>
                                        
                                        {member.category === 'manicure' && (
                                            <a 
                                                href={member.instagram} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="btn btn-outline"
                                                style={{ padding: '0.6rem', fontSize: '0.85rem', borderColor: '#000', background: '#fff', color: '#000' }}
                                            >
                                                📸 VER TRABAJOS
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
